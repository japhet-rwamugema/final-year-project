import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddimagetypeComponent } from './addimagetype.component';

describe('AddimagetypeComponent', () => {
  let component: AddimagetypeComponent;
  let fixture: ComponentFixture<AddimagetypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddimagetypeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddimagetypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
