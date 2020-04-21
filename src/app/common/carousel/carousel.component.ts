import { AfterViewInit, Component, ContentChildren, Directive, ElementRef, Input, OnInit, QueryList, TemplateRef, ViewChild, ViewChildren, DoCheck } from '@angular/core';
import { CarouselItemDirective } from './carousel-item.directive';
import { animate, AnimationBuilder, AnimationFactory, AnimationPlayer, style } from '@angular/animations';

@Directive({
    selector: '.carousel-item'
})
export class CarouselItemElement {
}

@Component({
    selector: 'carousel',
    exportAs: 'carousel',
    template: `
    <section class="carousel-wrapper" [ngStyle]="carouselWrapperStyle">
      <ul class="carousel-inner" #carousel>
        <li *ngFor="let item of items;" class="carousel-item">
          <ng-container [ngTemplateOutlet]="item.tpl"></ng-container>
        </li>
      </ul>
    </section>
    <div *ngIf="showControls" style="margin-top: 1em">
      <button (click)="next()" mat-button>Next</button>
      <button (click)="prev()" mat-button>Prev</button>
    </div>
  `,
    styles: [`
    ul {
      list-style: none;
      margin: 0;
      padding: 0;
      width: 6000px;
    }

    .carousel-wrapper {
      overflow: hidden;
    }

    .carousel-inner {
      display: flex;
    }

  `]
})
export class CarouselComponent implements AfterViewInit, DoCheck {

    @ContentChildren(CarouselItemDirective) items: QueryList<CarouselItemDirective>;

    @ViewChildren(CarouselItemElement, { read: ElementRef }) private itemsElements: QueryList<ElementRef>;

    @ViewChild('carousel') private carousel: ElementRef;
    @Input() timing = '350ms ease-in';
    @Input() showControls = true;
    private player: AnimationPlayer;
    private itemWidth: number;
    private currentSlide = 0;
    carouselWrapperStyle = {}

    next() {
        // debugger;
        if (this.currentSlide + 1 === this.items.length)
            return;
        this.currentSlide = (this.currentSlide + 1) % this.items.length;
        const offset = this.currentSlide * this.itemWidth;
        const myAnimation: AnimationFactory = this.buildAnimation(offset);
        this.player = myAnimation.create(this.carousel.nativeElement);
        this.player.play();
    }

    private buildAnimation(offset) {
        return this.builder.build([
            animate(this.timing, style({ transform: `translateX(-${offset}px)` }))
        ]);
    }

    prev() {
        if (this.currentSlide === 0)
            return;

        this.currentSlide = ((this.currentSlide - 1) + this.items.length) % this.items.length;
        const offset = this.currentSlide * this.itemWidth;

        const myAnimation: AnimationFactory = this.buildAnimation(offset);
        this.player = myAnimation.create(this.carousel.nativeElement);
        this.player.play();
    }

    constructor(private builder: AnimationBuilder) {
    }

    ngDoCheck(): void {

    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.itemWidth = this.itemsElements.first.nativeElement.getBoundingClientRect().width;
            this.carouselWrapperStyle = {
                width: `${this.itemWidth}px`
            }
        }, 1000);

    }

}
