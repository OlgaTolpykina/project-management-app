import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ScrollService } from '@core/services/scroll.service';
import { TranslocoService } from '@ngneat/transloco';
import { CreateBoardComponent } from '@board/components/create-board/create-board.component';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.scss'],
})
export class SidenavListComponent implements OnInit {
  @Output() sidenavClose = new EventEmitter();

  availableLangs: string[] | { id: string; label: string }[] = [];

  activeLang: string = 'en';

  isAuthorized: boolean = true;

  constructor(
    public transloco: TranslocoService,
    private scroll: ScrollService,
    public dialog: MatDialog,
  ) {}

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

  openDialog() {
    this.sidenavClose.emit();
    this.dialog.open(CreateBoardComponent, {
      height: '400px',
      width: '300px',
    });
  }
}
