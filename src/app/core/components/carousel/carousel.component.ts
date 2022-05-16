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
      src: '../../../../assets/img/OT-photo.JPG',
      alt: 'Teammate photo',
      name: 'OT-name',
      description: 'OT-description',
    },
    {
      src: '../../../../assets/img/AK-photo.png',
      alt: 'Teammate photo',
      name: 'AK-name',
      description: 'AK-description',
    },
    {
      src: '../../../../assets/img/avatar-male2.png',
      alt: 'Teammate photo',
      name: 'SS-name',
      description: 'SS-description',
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
