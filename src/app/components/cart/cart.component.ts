import { Component } from '@angular/core';

@Component({
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.scss']
})
export class CartComponent{
    messages = [
        {
          from: 'Entity 1',
          subject: 'Message Subject 1',
          content: 'Message Content 1'
        },
        {
          from: 'Entity 2',
          subject: 'Message Subject 2',
          content: 'Message Content 2'
        },
      ]
}