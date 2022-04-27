import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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

  constructor(private transloco: TranslocoService) {}

  ngOnInit(): void {
    this.activeLang = this.transloco.getActiveLang();
  }

  changeLang(lang: string) {
    this.transloco.setActiveLang(lang);
    this.activeLang = lang;
  }

  public onToggleSidenav = () => {
    this.sidenavToggle.emit();
  };
}
