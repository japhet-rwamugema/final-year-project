import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CoreModule } from '../../modules';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { catchError, Observable, of, throwError } from 'rxjs';
import { Users } from '../../interfaces';
import { FilterPipe, TrimPipe } from '../../pipes/trim.pipe';
import { FormsModule } from '@angular/forms';
import { CreateInsuranceComponent } from '../create-insurance/create-insurance.component';
import { AddimagetypeComponent } from '../addimagetype/addimagetype.component';

@Component({
  selector: 'app-admin-dashboard-users',
  standalone: true,
  imports: [
    RouterModule,
    HttpClientModule,
    FormsModule,
    CommonModule,
    CoreModule,
    TrimPipe,
    FilterPipe,
    CreateInsuranceComponent,
    AddimagetypeComponent
  ],
  providers: [AuthService],
  templateUrl: './admin-dashboard-users.component.html',
  styleUrl: './admin-dashboard-users.component.css',
})
export class AdminDashboardUsersComponent {
  searchText: string = '';
  isLoading: boolean = false;
  users!: Users;
  error!: string;
  createInsurance: boolean = false;
  addImage: boolean = false;
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.refreshPage();
  }

  logout() {
    this.isLoading = true;
    this.authService
      .logout()
      .pipe(
        catchError((error) => {
          this.error = 'Something went wrong';
          this.isLoading = false;
          return of(null);
        })
      )
      .subscribe((logout) => {
        localStorage.clear();
        this.isLoading = false;
        this.router.navigate(['/']);
      });
  }

  deleteUser(id: string) {
    this.users.data.content = this.users.data.content.filter(
      (user) => user.id !== id
    );
  }

  refreshPage() {
    this.isLoading = true;
    this.authService
      .getUsers(1, 5)
      .pipe(
        catchError((error) => {
          this.error = 'Something went wrong';
          this.isLoading = false;
          return of(null);
        })
      )
      .subscribe((users) => {
        if (users) {
          this.users = users;
          this.isLoading = false;
        }
      });
  }

  openCreateInsurance() {
    this.addImage = false;
    this.createInsurance = !this.createInsurance;
  }

  openAddImage() {
    this.createInsurance = false
    this.addImage =!this.addImage;
  }
}
