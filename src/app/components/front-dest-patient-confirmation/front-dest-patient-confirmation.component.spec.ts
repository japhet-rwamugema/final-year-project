import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrontDestPatientConfirmationComponent } from './front-dest-patient-confirmation.component';

describe('FrontDestPatientConfirmationComponent', () => {
  let component: FrontDestPatientConfirmationComponent;
  let fixture: ComponentFixture<FrontDestPatientConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FrontDestPatientConfirmationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FrontDestPatientConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
