import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedDialogComponent } from './shared-dialog.component';

describe('SharedDialogComponent', () => {
  let component: SharedDialogComponent;
  let fixture: ComponentFixture<SharedDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedDialogComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
