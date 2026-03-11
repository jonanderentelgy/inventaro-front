import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablePanelComponent } from './table-panel.component';

describe('TablePanelComponent', () => {
  let component: TablePanelComponent;
  let fixture: ComponentFixture<TablePanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablePanelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TablePanelComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
