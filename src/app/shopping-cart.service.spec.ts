import { TestBed } from '@angular/core/testing';

import { ShppingCartService } from './shpping-cart.service';

describe('ShppingCartService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShppingCartService = TestBed.get(ShppingCartService);
    expect(service).toBeTruthy();
  });
});
