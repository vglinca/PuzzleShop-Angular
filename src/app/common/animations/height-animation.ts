import { trigger, state, style, transition, animate } from '@angular/animations';

export const heightAnimation = trigger('changeDivSize', [
    state('initial', style({
      height: '0px',
      opacity: '0',
      overflow: 'hidden',
    })),
    state('final', style({
      height: '*',
      opacity: '1',
    })),
    transition('initial=>final', animate('500ms')),
    transition('final=>initial', animate('500ms'))
  ]);