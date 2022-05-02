import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ScrollService } from '@core/services/scroll.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();

  scrolled: boolean = false;

  currentItem = 0;

  isEnabled = true;

  constructor(private scroll: ScrollService) {}

  ngOnInit(): void {
    let subscription = this.scroll.anchorScroll$.subscribe((id) => {
      if (id) {
        const element = <HTMLElement>document.getElementById(id);
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest',
        });
      }
    });
    this.subscriptions.add(subscription);
  }

  @HostListener('document:scroll', [])
  onWindowScroll() {
    this.scrolled = document.documentElement.scrollTop > 200;
  }

  onScrollToTop() {
    document.documentElement.scrollTop = 0;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
