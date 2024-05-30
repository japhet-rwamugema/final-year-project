import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { catchError, of } from 'rxjs';
import { AppointmentUserData } from '../../interfaces';
import { AuthService } from '../../services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { CoreModule } from '../../modules';
import { TrimPipe, FilterPipe } from '../../pipes/trim.pipe';
import { PaginationComponent } from '../pagination/pagination.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-quality-assurance',
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
  templateUrl: './quality-assurance.component.html',
  styleUrl: './quality-assurance.component.css',
})
export class QualityAssuranceComponent {
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
  ngOnInit() {
    this.fetchData();
  }

  onPageChange(page: number) { 
    this.page = page;
    this.fetchData();
  }
  fetchData(date: string = this.dataControl.value) {
    this.isLoading = true;
    if (date) {
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
    } else {
      this.authService
        .getAppointmentsByDate(1, 10)
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
    }
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
  markAsQualityAssured(id: string) {
    this.ischeckinLoading = true;
    this.router.navigateByUrl(`/study/${id}`, { state: this.patientData });
  }
  markAsPaid(id: string) {
    this.ischeckinLoading = false;
    this.authService
      .markAsPaid(id)
      .pipe(
        catchError((error) => {
          this.toastr.error(error.error.message);
          this.ischeckinLoading = false;
          return of(null);
        })
      )
      .subscribe((data) => {
        if (data) {
          this.toastr.success('Marked as paid successfully');
          this.ischeckinLoading = false;
          this.fetchData();
        }
      });
  }
  report(id: string) {
    this.router.navigateByUrl(`/study/${id}`, { state: this.patientData });
  }
}
