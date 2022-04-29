import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ScrollService } from '@core/services/scroll.service';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.scss'],
})
export class SidenavListComponent implements OnInit {
  @Output() sidenavClose = new EventEmitter();

  availableLangs: string[] | { id: string; label: string }[] = [];

  activeLang: string = 'en';

  constructor(public transloco: TranslocoService, private scroll: ScrollService) {}

  ngOnInit(): void {
    this.activeLang = this.transloco.getActiveLang();
  }

  changeLang(lang: string) {
    this.transloco.setActiveLang(lang);
    this.activeLang = lang;
  }

  public onSidenavClose = () => {
    this.sidenavClose.emit();
  };

  onScrollToAnchor(elementId: string) {
    this.sidenavClose.emit();
    this.scroll.anchorScroll$.next(elementId);
  }
}
