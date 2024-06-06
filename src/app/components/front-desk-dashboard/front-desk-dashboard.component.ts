import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AppointmentUserData, PatientsData } from '../../interfaces';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilterPipe } from '../../pipes/trim.pipe';
import { CoreModule } from '../../modules';
import { catchError, of } from 'rxjs';
import { PaginationComponent } from '../pagination/pagination.component';
import { ToastrService } from 'ngx-toastr';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-front-desk-dashboard',
  standalone: true,
  imports: [
    HttpClientModule,
    RouterModule,
    CommonModule,
    FormsModule,
    FilterPipe,
    CoreModule,
    PaginationComponent,
    SidebarComponent
  ],
  providers: [AuthService],
  templateUrl: './front-desk-dashboard.component.html',
  styleUrl: './front-desk-dashboard.component.css',
})
export class FrontDeskDashboardComponent {
  viewPatientInfo(id: string) {
    this.router.navigateByUrl(`/dashboard/frontdesk/${id}`, {
      state: this.patientData,
    });
  }
  role!: string;
  page: number = 1;

  onPageChange(page: number) {
    this.page = page;
    this.fetchPatients();
  }
  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}
  isLoading: boolean = false;
  logoutLoading: boolean = false;
  searchText: string = '';
  patientData!: PatientsData;
  ngOnInit() {
    this.isLoading = true;
    this.getCurrentUser();
    this.fetchPatients();
  }
  fetchPatients() {
    this.authService.getPatients(this.page, 5).subscribe((data) => {
      if (data) {
        this.isLoading = false;
        this.patientData = data;
      }
    });
  }
  deleteUser(id: string) {
    this.patientData.data.content = this.patientData.data.content.filter(
      (patient) => patient.id !== id
    );
  }
  logout() {
    this.logoutLoading = true;
    this.authService
      .logout()
      .pipe(
        catchError((error) => {
          this.router.navigate(['/']);
          this.logoutLoading = false;
          return of(null);
        })
      )
      .subscribe(() => {
        localStorage.removeItem('token');
        this.logoutLoading = false;
        this.router.navigate(['/']);
      });
  }

  scheduleAppointment(id: string) {
    this.router.navigateByUrl(`/dashboard/frontdesk/create/${id}`, {
      state: this.patientData,
    });
  }

  getCurrentUser() {
    this.authService.getCurrentUser().subscribe((user) => {
      if (user) {
        this.role = user.data.role;
      }
    });
  }

  statusLoading: boolean = false;
  changeStatus(id: string) {
    this.statusLoading = true;
    this.authService
      .changeStatusToInactive(id)
      .pipe(
        catchError((error) => {
          this.statusLoading = false;
          this.toastr.error(error.error.message);
          return of(null);
        })
      )
      .subscribe((data) => {
        if (data) {
          this.statusLoading = false;
          this.toastr.success('Status changed successfully');
          this.fetchPatients();
        }
      });
  }

  activateStatus(id: string) {
    this.statusLoading = true;
    this.authService
      .changeStatusToActive(id)
      .pipe(
        catchError((error) => {
          this.statusLoading = false;
          this.toastr.error(error.error.error);
          return of(null);
        })
      )
      .subscribe((data) => {
        if (data) {
          this.statusLoading = false;
          this.toastr.success('Status changed successfully');
          this.fetchPatients();
        }
      });
  }

  isOpen = false;
  openSidebar(isOpen: boolean) {
    this.isOpen = isOpen;
  }

  toggleSidebar(): void { 
    this.isOpen = !this.isOpen;
  }
}
