import { Component, OnInit } from '@angular/core';
import { trigger, transition, useAnimation } from '@angular/animations';
import { fadeIn, fadeOut } from '@shared/animations/animations';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
  animations: [
    trigger('carouselAnimation', [
      transition('void => *', [useAnimation(fadeIn)]),
      transition('* => void', [useAnimation(fadeOut)]),
    ]),
  ],
})
export class CarouselComponent implements OnInit {
  slides = [
    {
      src: '../../../../assets/img/avatar-female.png',
      alt: 'Teammate photo',
      description: 'AAAAAA',
    },
    {
      src: '../../../../assets/img/avatar-male1.png',
      alt: 'Teammate photo',
      description: 'ББББББ',
    },
    {
      src: '../../../../assets/img/avatar-male2.png',
      alt: 'Teammate photo',
      description: 'ВВВВВВ',
    },
  ];

  currentSlide = 0;

  ngOnInit(): void {
    this.preloadImages();
  }

  preloadImages() {
    for (const slide of this.slides) {
      new Image().src = slide.src;
    }
  }

  onPreviousClick() {
    const previous = this.currentSlide - 1;
    this.currentSlide = previous < 0 ? this.slides.length - 1 : previous;
  }

  onNextClick() {
    const next = this.currentSlide + 1;
    this.currentSlide = next === this.slides.length ? 0 : next;
  }
}
