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
      name: 'Ольга Толпыкина - teamlead, frontend',
      description:
        'С Front-end разработкой я познакомилась полгода назад и благодаря RSSchool поняла, что это то, что мне действительно интересно. Обучение очень интенсивное, но не просто изучаешь сухую теорию, а получаешь реальные навыки. Я не планирую останавливаться, а буду лишь продолжать развиваться в данной сфере.',
    },
    {
      src: '../../../../assets/img/AK-photo.png',
      alt: 'Teammate photo',
      name: 'Алексадр Короткевич - frontend',
      description:
        'Я изучаю Front-end-разработку в течение года. До этого не был связан с программированием, но сейчас четко решил не останавливаться и реализовать свое желание сменить сферу. Уверен, что все получится.',
    },
    {
      src: '../../../../assets/img/avatar-male2.png',
      alt: 'Teammate photo',
      name: 'Сергей Сержан - fullstack',
      description: '',
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
