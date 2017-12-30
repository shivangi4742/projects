import { TestBed, inject } from '@angular/core/testing';

import { ZgService } from './zg.service';

describe('ZgService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ZgService]
    });
  });

  it('should be created', inject([ZgService], (service: ZgService) => {
    expect(service).toBeTruthy();
  }));
});
