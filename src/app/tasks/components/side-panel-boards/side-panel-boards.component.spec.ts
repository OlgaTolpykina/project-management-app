import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidePanelBoardsComponent } from './side-panel-boards.component';

describe('SidePanelBoardsComponent', () => {
  let component: SidePanelBoardsComponent;
  let fixture: ComponentFixture<SidePanelBoardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SidePanelBoardsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidePanelBoardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
