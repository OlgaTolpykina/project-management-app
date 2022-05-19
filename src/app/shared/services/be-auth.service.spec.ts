import { TestBed } from '@angular/core/testing';

import { BeAuthService } from './be-auth.service';

describe('BeAuthService', () => {
  let service: BeAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BeAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
