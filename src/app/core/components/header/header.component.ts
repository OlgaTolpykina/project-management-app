import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ScrollService } from '@core/services/scroll/scroll.service';
import { TranslocoService } from '@ngneat/transloco';
import { UserAuthServiceService } from '@auth/services/user-auth-service.service';
import { CreateBoardComponent } from '@board/components/create-board/create-board.component';
import { ProgressBarService } from '@core/services/loading/progress-bar.service';
import { RouteService } from '@core/services/route.service';
import { SearchService } from '@shared/services/search.service';

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

  isAuthorized: boolean = false;

  currentUrl = '';

  constructor(
    public transloco: TranslocoService,
    private scroll: ScrollService,
    public dialog: MatDialog,
    public authService: UserAuthServiceService,
    public progressBar: ProgressBarService,
    private route: RouteService,
    public searchService: SearchService,
  ) {}

  ngOnInit(): void {
    this.activeLang = localStorage.getItem('lang') || 'en';
    this.transloco.setActiveLang(this.activeLang);
    this.authService.getIsAuthorizedStatus();
    this.route.currentRoute$.subscribe((url) => (this.currentUrl = url));
  }

  @HostListener('document:scroll', [])
  onWindowScroll() {
    this.scrolled = document.documentElement.scrollTop > 0;
  }

  changeLang(lang: string) {
    this.transloco.setActiveLang(lang);
    this.activeLang = lang;
    localStorage.setItem('lang', lang);
  }

  onToggleSidenav = () => {
    this.sidenavToggle.emit();
  };

  onScrollToAnchor(elementId: string) {
    this.scroll.anchorScroll$.next(elementId);
  }

  openDialog() {
    this.dialog.open(CreateBoardComponent, {
      height: '400px',
      width: '300px',
    });
  }
}
