import { TestBed, inject } from '@angular/core/testing';

import { MglService } from './mgl.service';

describe('MglService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MglService]
    });
  });

  it('should be created', inject([MglService], (service: MglService) => {
    expect(service).toBeTruthy();
  }));
});
