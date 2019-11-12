import { TestBed } from '@angular/core/testing';

import { BackupmodelService } from './backupmodel.service';

describe('BackupmodelService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BackupmodelService = TestBed.get(BackupmodelService);
    expect(service).toBeTruthy();
  });
});
