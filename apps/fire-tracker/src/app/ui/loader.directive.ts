import {
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  Directive,
  inject,
  Input,
  OnChanges,
  SimpleChanges,
  TemplateRef,
  ViewContainerRef,
  ViewRef,
} from '@angular/core';
import { initialStatus, StatusType } from '../models/status';

@Component({
  selector: 'tt-loader',
  template: '',
  standalone: true,
  styles: [
    `
      :host {
        display: block;
        color: #ffffff;
        font-size: 90px;
        text-indent: -9999em;
        overflow: hidden;
        width: 1em;
        height: 1em;
        border-radius: 50%;
        margin: 72px auto;
        position: relative;
        -webkit-transform: translateZ(0);
        -ms-transform: translateZ(0);
        transform: translateZ(0);
        -webkit-animation: load6 1.7s infinite ease, round 1.7s infinite ease;
        animation: load6 1.7s infinite ease, round 1.7s infinite ease;
      }
      @-webkit-keyframes load6 {
        0% {
          box-shadow: 0 -0.83em 0 -0.4em, 0 -0.83em 0 -0.42em, 0 -0.83em 0 -0.44em,
            0 -0.83em 0 -0.46em, 0 -0.83em 0 -0.477em;
        }
        5%,
        95% {
          box-shadow: 0 -0.83em 0 -0.4em, 0 -0.83em 0 -0.42em, 0 -0.83em 0 -0.44em,
            0 -0.83em 0 -0.46em, 0 -0.83em 0 -0.477em;
        }
        10%,
        59% {
          box-shadow: 0 -0.83em 0 -0.4em, -0.087em -0.825em 0 -0.42em, -0.173em -0.812em 0 -0.44em,
            -0.256em -0.789em 0 -0.46em, -0.297em -0.775em 0 -0.477em;
        }
        20% {
          box-shadow: 0 -0.83em 0 -0.4em, -0.338em -0.758em 0 -0.42em, -0.555em -0.617em 0 -0.44em,
            -0.671em -0.488em 0 -0.46em, -0.749em -0.34em 0 -0.477em;
        }
        38% {
          box-shadow: 0 -0.83em 0 -0.4em, -0.377em -0.74em 0 -0.42em, -0.645em -0.522em 0 -0.44em,
            -0.775em -0.297em 0 -0.46em, -0.82em -0.09em 0 -0.477em;
        }
        100% {
          box-shadow: 0 -0.83em 0 -0.4em, 0 -0.83em 0 -0.42em, 0 -0.83em 0 -0.44em,
            0 -0.83em 0 -0.46em, 0 -0.83em 0 -0.477em;
        }
      }
      @keyframes load6 {
        0% {
          box-shadow: 0 -0.83em 0 -0.4em, 0 -0.83em 0 -0.42em, 0 -0.83em 0 -0.44em,
            0 -0.83em 0 -0.46em, 0 -0.83em 0 -0.477em;
        }
        5%,
        95% {
          box-shadow: 0 -0.83em 0 -0.4em, 0 -0.83em 0 -0.42em, 0 -0.83em 0 -0.44em,
            0 -0.83em 0 -0.46em, 0 -0.83em 0 -0.477em;
        }
        10%,
        59% {
          box-shadow: 0 -0.83em 0 -0.4em, -0.087em -0.825em 0 -0.42em, -0.173em -0.812em 0 -0.44em,
            -0.256em -0.789em 0 -0.46em, -0.297em -0.775em 0 -0.477em;
        }
        20% {
          box-shadow: 0 -0.83em 0 -0.4em, -0.338em -0.758em 0 -0.42em, -0.555em -0.617em 0 -0.44em,
            -0.671em -0.488em 0 -0.46em, -0.749em -0.34em 0 -0.477em;
        }
        38% {
          box-shadow: 0 -0.83em 0 -0.4em, -0.377em -0.74em 0 -0.42em, -0.645em -0.522em 0 -0.44em,
            -0.775em -0.297em 0 -0.46em, -0.82em -0.09em 0 -0.477em;
        }
        100% {
          box-shadow: 0 -0.83em 0 -0.4em, 0 -0.83em 0 -0.42em, 0 -0.83em 0 -0.44em,
            0 -0.83em 0 -0.46em, 0 -0.83em 0 -0.477em;
        }
      }
      @-webkit-keyframes round {
        0% {
          -webkit-transform: rotate(0deg);
          transform: rotate(0deg);
        }
        100% {
          -webkit-transform: rotate(360deg);
          transform: rotate(360deg);
        }
      }
      @keyframes round {
        0% {
          -webkit-transform: rotate(0deg);
          transform: rotate(0deg);
        }
        100% {
          -webkit-transform: rotate(360deg);
          transform: rotate(360deg);
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoaderComponent {}

@Directive({
  selector: '[ttLoader]',
  standalone: true,
})
export class LoaderDirective implements OnChanges {
  @Input('ttLoader')
  status = initialStatus();

  private readonly vcRef = inject(ViewContainerRef);
  private readonly templateRef = inject(TemplateRef);
  private viewRef: ViewRef | ComponentRef<LoaderComponent> | undefined;

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['status'].previousValue?.type !== this.status.type) {
      this.updateView();
    }
  }

  private updateView(): void {
    this.viewRef?.destroy();
    if (this.status.type === StatusType.Loading) {
      this.viewRef = this.vcRef.createComponent(LoaderComponent);
    } else if (this.status.type === StatusType.Success) {
      this.viewRef = this.vcRef.createEmbeddedView(this.templateRef);
    }
  }
}
