import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnologistReportComponent } from './technologist-report.component';

describe('TechnologistReportComponent', () => {
  let component: TechnologistReportComponent;
  let fixture: ComponentFixture<TechnologistReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechnologistReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TechnologistReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
