import { TestBed, inject } from '@angular/core/testing';

import { PayrequestserviceService } from './payrequestservice.service';

describe('PayrequestserviceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PayrequestserviceService]
    });
  });

  it('should be created', inject([PayrequestserviceService], (service: PayrequestserviceService) => {
    expect(service).toBeTruthy();
  }));
});
