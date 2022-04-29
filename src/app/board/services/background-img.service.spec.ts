import { TestBed } from '@angular/core/testing';

import { BackgroundImgService } from './background-img.service';

describe('BackgroundImgService', () => {
  let service: BackgroundImgService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackgroundImgService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
