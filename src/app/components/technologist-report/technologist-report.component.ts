import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CoreModule } from '../../modules';
import { AuthService } from '../../services/auth.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-technologist-report',
  standalone: true,
  imports: [CommonModule, RouterModule, CoreModule],
  templateUrl: './technologist-report.component.html',
  styleUrl: './technologist-report.component.css',
})
export class TechnologistReportComponent {
  constructor(private activeRoute: ActivatedRoute, private auth: AuthService, private router: Router) { }
  data!: any;
  patientData!: any
  role!: string;
  id!: string
  loading: boolean = false;
  ngOnInit() {
    this.id = this.activeRoute.snapshot.params['id'];
    const dd = history.state
    this.patientData = dd.data.content.find((patient: any) => patient.id === this.id);
    this.fetch()
    this.getCurrentUser()
  }
  
  fetch() {
    this.loading = true;
    this.auth.getAppointmentsByDate(1, 20)
      .subscribe((data) => {
        this.loading = false;
        this.data = data.data.content.find((appointment) => appointment.patient.id === this.id);        
      });
  }
  isLoading: boolean = false;
  logout() {
    this.isLoading = true;
    this.auth.logout()
      .pipe(
        catchError((error) => {
          this.isLoading = false;
          this.router.navigate(['/']);
          return of(null);
        })
      )
      .subscribe((data) => {
        if (data) {
          this.isLoading = false;
          this.router.navigate(['/']);
        }
      });
  }

  schedule() {
    this.router.navigateByUrl(`/dashboard/frontdesk/create/${this.id}`, { state: history.state })
  }

  getCurrentUser() {
    this.auth.getCurrentUser()
      .subscribe((data) => {
        if (data) {
          this.role = data.data.role;
        }
       });
  }

}
