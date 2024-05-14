import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadiologyStudyComponent } from './radiology-study.component';

describe('RadiologyStudyComponent', () => {
  let component: RadiologyStudyComponent;
  let fixture: ComponentFixture<RadiologyStudyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RadiologyStudyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RadiologyStudyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
