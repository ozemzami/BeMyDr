import { TestBed } from '@angular/core/testing';

import { RecapService } from './recap.service';

describe('RecapService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RecapService = TestBed.get(RecapService);
    expect(service).toBeTruthy();
  });
});
