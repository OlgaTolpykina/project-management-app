import { Component, OnInit } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  availableLangs: string[] | { id: string; label: string }[] = [];

  activeLang: string = 'en';

  constructor(private transloco: TranslocoService) {}

  ngOnInit(): void {
    this.activeLang = this.transloco.getActiveLang();
    // this.availableLangs = this.transloco.getAvailableLangs();
  }

  changeLang(lang: string) {
    this.transloco.setActiveLang(lang);
    this.activeLang = lang;
  }
}
