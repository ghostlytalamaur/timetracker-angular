import { Directionality } from '@angular/cdk/bidi';
import { Point } from '@angular/cdk/drag-drop/drag-ref';
import {
  FlexibleConnectedPositionStrategy,
  HorizontalConnectionPos,
  Overlay,
  OverlayConfig,
  OverlayRef,
  ScrollStrategy,
  VerticalConnectionPos,
} from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import {
  Directive,
  ElementRef,
  HostListener,
  Inject,
  Injectable,
  Input,
  OnDestroy,
  Optional,
  ViewContainerRef,
} from '@angular/core';
import { MAT_MENU_SCROLL_STRATEGY, MatMenu, MenuPositionX, MenuPositionY } from '@angular/material/menu';
import { EMPTY, Observable, Subject, Subscription, fromEvent, merge, of } from 'rxjs';
import { filter, map, mapTo, take, takeUntil, tap } from 'rxjs/operators';

interface ContextMenuConfig {
  element: ElementRef<HTMLElement>;
  position: Point;
  viewContainerRef: ViewContainerRef;
  context: unknown;
}

function log(...args: any[]): void {
  // console.log(performance.now(), ...args);
}

class ContextMenuRef {

  private menuClosingActionsSubscription: Subscription | null = null;
  private closed: Subject<void> = new Subject<void>();

  private subscription = new Subscription();
  private overlayRef: OverlayRef | null;

  constructor(
    private readonly menu: MatMenu,
    private readonly config: ContextMenuConfig,
    overlayRef: OverlayRef,
    private readonly doc: Document,
  ) {
    this.overlayRef = overlayRef;
  }

  show(): void {
    if (!this.overlayRef) {
      return;
    }

    this.overlayRef.attach(new TemplatePortal(this.menu.templateRef, this.config.viewContainerRef));

    if (this.menu.lazyContent) {
      this.menu.lazyContent.attach(this.config.context);
    }

    this.setupSubscriptions();

    this.menu._resetAnimation();
    this.menu._startAnimation();
  }

  close(): void {
    log('menu: close');
    this.menu.closed.emit();
  }

  afterClosed(): Observable<void> {
    return this.closed;
  }

  dispose(): void {
    log('menu: dispose');
    this.overlayRef?.dispose();
    this.overlayRef = null;

    this.doDispose();
  }

  doDispose(): void {
    log('menu: doDispose');
    if (this.overlayRef) {
      this.overlayRef.dispose();
    }

    this.subscription.unsubscribe();
    this.closed.next();
    this.closed.complete();
  }

  private menuClosingActions(): Observable<void> {
    if (!this.overlayRef) {
      return EMPTY;
    }

    const docClick$ = fromEvent(this.doc, 'click', { passive: true })
      .pipe(
        filter(event => {
          if (event.target instanceof Node) {
            return !this.overlayRef?.overlayElement?.contains(event.target);
          }

          return false;
        }),
        mapTo('docClick'),
      );

    const docContextMenu$ = fromEvent(this.doc, 'contextmenu', { passive: true })
      .pipe(
        filter(event => {
          if (event.target instanceof Node) {
            return !(this.overlayRef?.overlayElement?.contains(event.target) || this.config.element.nativeElement?.contains(event.target));
          }

          return false;
        }),
        mapTo('docContextMenu'),
      );

    const detachments$ = this.overlayRef.detachments()
      .pipe(
        mapTo('detachments'),
      );
    return merge(docClick$, docContextMenu$, detachments$)
      .pipe(
        map(reason => log('menu: closing action', reason)),
      );
  }

  private unsubscribeClosingActions(): void {
    if (this.menuClosingActionsSubscription) {
      log('menu: unsubscribe from closing actions');
      this.menuClosingActionsSubscription.unsubscribe();
      this.menuClosingActionsSubscription = null;
    }
  }

  private setupSubscriptions(): void {
    if (!this.overlayRef) {
      return;
    }

    this.subscription.add(this.overlayRef.keydownEvents().subscribe());
    this.menuClosingActionsSubscription = this.menuClosingActions().subscribe(() => this.close());

    const position = this.overlayRef.getConfig().positionStrategy;
    if (this.menu.setPositionClasses && position instanceof FlexibleConnectedPositionStrategy) {
      this.subscription.add(
        position.positionChanges
          .subscribe(change => {
            const posX: MenuPositionX = change.connectionPair.overlayX === 'start' ? 'after' : 'before';
            const posY: MenuPositionY = change.connectionPair.overlayY === 'top' ? 'below' : 'above';

            this.menu.setPositionClasses(posX, posY);
          }));
    }

    this.subscription.add(this.menu.closed.asObservable().subscribe(() => this.destroyMenu()));
  }

  private destroyMenu(): void {
    log('menu: destroyMenu');
    this.unsubscribeClosingActions();
    this.overlayRef?.detach();
    const menu = this.menu;
    menu._resetAnimation();
    if (menu.lazyContent) {
      // Wait for the exit animation to finish before detaching the content.
      menu._animationDone
        .pipe(
          tap(event => log('menu: animation event', {
            toState: event.toState,
            fromState: event.fromState,
            phaseName: event.phaseName,
            triggerName: event.triggerName,
            totalTime: event.totalTime,
          })),
          filter(event => event.toState === 'void'),
          take(1),
          // Interrupt if the content got re-attached.
          takeUntil(menu.lazyContent._attached),
        )
        .subscribe({
          next: () => menu.lazyContent?.detach(),
          complete: () => this.doDispose(),
        })
      ;
    } else {
      this.dispose();
    }
  }
}

@Injectable({
  providedIn: 'root',
})
export class ContextMenuService implements OnDestroy {
  private activeMenu: ContextMenuRef | null = null;

  constructor(
    private readonly overlay: Overlay,
    @Inject(MAT_MENU_SCROLL_STRATEGY) private readonly scrollStrategy: () => ScrollStrategy,
    @Optional() private readonly dir: Directionality,
    @Inject(DOCUMENT) private readonly doc: Document,
  ) {
  }

  ngOnDestroy(): void {
    this.activeMenu?.dispose();
    this.activeMenu = null;
  }

  open(menu: MatMenu, config: ContextMenuConfig): ContextMenuRef {
    log('srv: open new menu');
    const overlayConfig = this.getOverlayConfig(menu, config);
    const overlayRef = this.createOverlay(overlayConfig);

    const menuRef = new ContextMenuRef(menu, config, overlayRef, this.doc);
    this.activeMenu?.close();

    // Show new menu only when activeMenu gets closed
    (this.activeMenu?.afterClosed() || of(undefined))
      .subscribe(
        () => {
          log('srv: activating menu');
          menuRef.show();
          this.setActiveMenu(menuRef);
        },
      );

    return menuRef;
  }

  private createOverlay(overlayConfig: OverlayConfig): OverlayRef {
    return this.overlay.create(overlayConfig);
  }

  private getOverlayConfig(menu: MatMenu, config: ContextMenuConfig): OverlayConfig {
    const position = this.overlay.position()
      .flexibleConnectedTo(config.element)
      .withLockedPosition()
      .withTransformOriginOn('.mat-menu-panel');
    this.setPosition(position, menu, config);

    return new OverlayConfig({
      positionStrategy: position,
      backdropClass: menu.backdropClass || 'cdk-overlay-transparent-backdrop',
      scrollStrategy: this.scrollStrategy(),
      direction: this.dir,
      hasBackdrop: !!menu.hasBackdrop,
    });
  }

  private setPosition(positionStrategy: FlexibleConnectedPositionStrategy, menu: MatMenu, config: ContextMenuConfig) {
    const [originX, originFallbackX]: HorizontalConnectionPos[] =
      menu.xPosition === 'before' ? ['end', 'start'] : ['start', 'end'];

    const [overlayY, overlayFallbackY]: VerticalConnectionPos[] =
      menu.yPosition === 'above' ? ['bottom', 'top'] : ['top', 'bottom'];

    let [originY, originFallbackY] = [overlayY, overlayFallbackY];
    const [overlayX, overlayFallbackX] = [originX, originFallbackX];
    const offsetY = 0;

    positionStrategy.setOrigin(config.position);
    if (!menu.overlapTrigger) {
      originY = overlayY === 'top' ? 'bottom' : 'top';
      originFallbackY = overlayFallbackY === 'top' ? 'bottom' : 'top';
    }

    positionStrategy.withPositions([
      { originX, originY, overlayX, overlayY, offsetY },
      { originX: originFallbackX, originY, overlayX: overlayFallbackX, overlayY, offsetY },
      {
        originX,
        originY: originFallbackY,
        overlayX,
        overlayY: overlayFallbackY,
        offsetY: -offsetY,
      },
      {
        originX: originFallbackX,
        originY: originFallbackY,
        overlayX: overlayFallbackX,
        overlayY: overlayFallbackY,
        offsetY: -offsetY,
      },
    ]);
  }

  private setActiveMenu(menuRef: ContextMenuRef | null): void {
    this.activeMenu = menuRef;

    if (menuRef) {
      menuRef.afterClosed()
        .subscribe(() => {
          log('srv: menu closed');
          if (this.activeMenu === menuRef) {
            this.activeMenu = null;
          }
        });
    }
  }

}

@Directive({
  selector: '[appContextMenuTriggerFor]',
})
export class ContextMenuTriggerDirective implements OnDestroy {

  @Input('appContextMenuTriggerFor') menu!: MatMenu;
  @Input() appContextMenuTriggerData: unknown;

  private menuRef: ContextMenuRef | null = null;

  constructor(
    private readonly element: ElementRef<HTMLElement>,
    private readonly viewContainerRef: ViewContainerRef,
    private readonly contextMenuService: ContextMenuService,
  ) {
  }

  @HostListener('contextmenu', ['$event'])
  onContextMenu(event: MouseEvent): void {
    event.preventDefault();
    this.menuRef = this.contextMenuService.open(this.menu, {
      position: { x: event.clientX, y: event.clientY },
      context: this.appContextMenuTriggerData,
      element: this.element,
      viewContainerRef: this.viewContainerRef,
    });
  }

  ngOnDestroy(): void {
    if (this.menuRef) {
      this.menuRef.dispose();
      this.menuRef = null;
    }
  }
}
