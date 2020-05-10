import { AnimationTriggerMetadata, animate, query, sequence, style, transition, trigger } from '@angular/animations';

export const routerAnimation: AnimationTriggerMetadata = trigger('routerAnimation', [
  transition('* => *', [
    query(':enter > *', style({ opacity: 0, position: 'fixed' }), {
      optional: true,
    }),

    sequence([
      query(
        ':leave > *',
        [
          style({ transform: 'translateY(0%)', opacity: 1 }),
          animate(
            '0.2s ease-in-out',
            style({ transform: 'translateY(0%)', opacity: 0 }),
          ),
          style({ position: 'fixed' }),
        ],
        { optional: true },
      ),
      query(
        ':enter > *',
        [
          style({
            transform: 'translateY(0%)',
            opacity: 0,
            position: 'static',
          }),
          animate(
            '0.5s ease-in-out',
            style({ transform: 'translateY(0%)', opacity: 1 }),
          ),
        ],
        { optional: true },
      ),
    ]),
  ]),
]);
