import { Component } from '@angular/core';
import { CoreModule } from '../../modules';
import { Router, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { AppointmentUserData } from '../../interfaces';
import { FilterPipe, TrimPipe } from '../../pipes/trim.pipe';
import { catchError, of } from 'rxjs';
import { CommonModule, DatePipe } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginationComponent } from '../pagination/pagination.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-technician-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CoreModule,
    RouterModule,
    HttpClientModule,
    TrimPipe,
    FilterPipe,
    PaginationComponent
  ],
  providers: [AuthService, DatePipe],
  templateUrl: './technician-dashboard.component.html',
  styleUrl: './technician-dashboard.component.css',
})
export class TechnicianDashboardComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
    private dataPipe: DatePipe,
    private toastr: ToastrService
  ) {
    this.dataControl = new FormControl('');
  }
  dataControl!: FormControl;
  isLoading: boolean = false;
  logoutLoading: boolean = false;
  searchText: string = '';
  role: string = '';
  patientData!: AppointmentUserData;
  page: number = 1;
  onPageChange(page: number) { 
    this.page = page;
    this.fetchData();
  }
  ngOnInit() {
    this.fetchData();
  }

  fetchData(date: string = this.dataControl.value) {
    this.isLoading = true;
    this.authService
      .getAppointmentsByDate(1, 5, date)
      .pipe(
        catchError(() => {
          this.isLoading = false;
          return of(null);
        })
      )
      .subscribe((data) => {
        if (data) {
          this.isLoading = false;
          this.patientData = data;
        }
      });

    this.authService.getCurrentUser().subscribe((user) => {
      if (user) {
        this.role = user.data.role;
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

  change() {
    this.fetchData();
  }

  ischeckinLoading: boolean = false;
  checkIn(id: string) {
    this.ischeckinLoading = true;
    this.authService
      .checkIn(id)
      .pipe(
        catchError((error) => {
          this.ischeckinLoading = false;
          this.toastr.error(error.error.message);
          return of(null);
        })
      )
      .subscribe((data) => {
        if (data) {
          this.toastr.success('Checked in successfully');
          this.ischeckinLoading = false;
          this.fetchData();
        }
      });
  }
  report(id: string) {
    this.router.navigateByUrl(`/study/${id}`, { state: this.patientData });
  }
}
