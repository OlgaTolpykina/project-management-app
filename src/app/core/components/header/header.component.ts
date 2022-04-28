import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Output() public sidenavToggle = new EventEmitter();

  availableLangs: string[] | { id: string; label: string }[] = [];

  activeLang: string = 'en';

  scrolled: boolean = false;

  isAuthorized: boolean = true;

  constructor(private transloco: TranslocoService) {}

  ngOnInit(): void {
    this.activeLang = this.transloco.getActiveLang();
  }

  @HostListener('document:scroll', [])
  onWindowScroll() {
    this.scrolled = document.documentElement.scrollTop > 0;
  }

  changeLang(lang: string) {
    this.transloco.setActiveLang(lang);
    this.activeLang = lang;
  }

  public onToggleSidenav = () => {
    this.sidenavToggle.emit();
  };
}
