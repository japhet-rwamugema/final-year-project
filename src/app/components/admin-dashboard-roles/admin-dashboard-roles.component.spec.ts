import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashboardRolesComponent } from './admin-dashboard-roles.component';

describe('AdminDashboardRolesComponent', () => {
  let component: AdminDashboardRolesComponent;
  let fixture: ComponentFixture<AdminDashboardRolesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDashboardRolesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminDashboardRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
