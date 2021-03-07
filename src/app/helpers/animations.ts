import {
  trigger, state, style, transition,
  animate, group
} from '@angular/animations';

export const SlideInOutAnimation = [
  trigger('slideInOut', [
    state('in', style({
      'max-height': '500px', 'opacity': '1', 'display': 'block'
    })),
    state('out', style({
      'max-height': '0px', 'opacity': '0', 'display': 'none'
    })),
    transition('in => out', [group([
        animate('40ms ease-in-out', style({
          'opacity': '0'
        })),
        animate('60ms ease-in-out', style({
          'max-height': '0px'
        })),
        animate('70ms ease-in-out', style({
          'display': 'none'
        }))
      ]
    )]),
    transition('out => in', [group([
        animate('1ms ease-in-out', style({
          'display': 'block'
        })),
        animate('60ms ease-in-out', style({
          'max-height': '500px'
        })),
        animate('80ms ease-in-out', style({
          'opacity': '1'
        }))
      ]
    )])
  ]),
];
