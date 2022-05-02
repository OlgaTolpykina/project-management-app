import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ScrollService } from '@core/services/scroll.service';
import { TranslocoService } from '@ngneat/transloco';
import { UserAuthServiceService } from '@auth/services/user-auth-service.service';
import { CreateBoardComponent } from '@board/components/create-board/create-board.component';

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

  authService: UserAuthServiceService;

  constructor(public transloco: TranslocoService, authService: UserAuthServiceService) {
    this.authService = authService;
  }
  constructor(
    public transloco: TranslocoService,
    private scroll: ScrollService,
    public dialog: MatDialog,
  authService: UserAuthServiceService
  ) {
this.authService = authService;
}

  ngOnInit(): void {
    this.activeLang = this.transloco.getActiveLang();
    this.authService.getIsAuthorizedStatus();
  }

  @HostListener('document:scroll', [])
  onWindowScroll() {
    this.scrolled = document.documentElement.scrollTop > 0;
  }

  changeLang(lang: string) {
    this.transloco.setActiveLang(lang);
    this.activeLang = lang;
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
