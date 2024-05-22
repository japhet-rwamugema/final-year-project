import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { PatientsData } from '../../interfaces';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilterPipe } from '../../pipes/trim.pipe';
import { CoreModule } from '../../modules';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-front-desk-dashboard',
  standalone: true,
  imports: [HttpClientModule, RouterModule, CommonModule, FormsModule, FilterPipe, CoreModule],
  providers: [AuthService],
  templateUrl: './front-desk-dashboard.component.html',
  styleUrl: './front-desk-dashboard.component.css'
})
export class FrontDeskDashboardComponent {

  constructor(private authService: AuthService, private router: Router) { }
  isLoading: boolean = false;
  logoutLoading: boolean = false;
  searchText: string = ''
  patientData!: PatientsData
  ngOnInit() {
    this.isLoading = true;
    this.authService.getPatients(1, 10)
      .subscribe(data => {
        if (data) {
          this.isLoading = false;
          this.patientData = data;
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
}
