import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnologistStudiesComponent } from './technologist-studies.component';

describe('TechnologistStudiesComponent', () => {
  let component: TechnologistStudiesComponent;
  let fixture: ComponentFixture<TechnologistStudiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechnologistStudiesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TechnologistStudiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
