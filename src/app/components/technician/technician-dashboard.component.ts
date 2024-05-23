import { Component } from '@angular/core';
import { CoreModule } from '../../modules';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { setDataService } from '../../services/data-service';
import { AppointmentCreation, AppointmentData, AppointmentUserData, PatientsData } from '../../interfaces';
import { FilterPipe, TrimPipe } from '../../pipes/trim.pipe';
import { catchError, of } from 'rxjs';
import { CommonModule, DatePipe } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-technician-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, CoreModule, RouterModule, HttpClientModule, TrimPipe, FilterPipe],
  providers: [AuthService, setDataService, DatePipe],
  templateUrl: './technician-dashboard.component.html',
  styleUrl: './technician-dashboard.component.css',
})
export class TechnicianDashboardComponent {

  constructor(private authService: AuthService, private router: Router, private dataPipe: DatePipe) {
    this.dataControl = new FormControl(this.dataPipe.transform(new Date(), 'yyyy-MM-dd'))
  }
  dataControl!: FormControl
  isLoading: boolean = false;
  logoutLoading: boolean = false;
  searchText: string = ''
  role: string = ''
  patientData!: AppointmentUserData
  ngOnInit() {
    this.fetchData()
  }

  fetchData() {
    this.isLoading = true;
    this.authService.getAppointmentsByDate(1, 10, this.dataControl.value)
      .pipe(catchError(() => {
        this.isLoading = false;
        return of(null);
      }))
      .subscribe(data => {
        if (data) {
          this.isLoading = false;
          this.patientData = data;
        }
      })

    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.role = user.data.role;
      }
    })
  }

  deleteUser(id: string) {
    this.patientData.data.content = this.patientData.data.content.filter(patient => patient.id !== id)
  }

  logout() {
    this.logoutLoading = true;
    this.authService.logout()
      .pipe(
        catchError(error => {
          this.router.navigate(['/'])
          this.logoutLoading = false;
          return of(null);
        })
      )
      .subscribe(() => {
        localStorage.removeItem('token');
        this.logoutLoading = false;
        this.router.navigate(['/']);
      })
  }

  change() {
    this.fetchData()
  }

  report(id: string) {
    this.router.navigateByUrl(`/study/${id}`, { state: this.patientData })
  }
}
