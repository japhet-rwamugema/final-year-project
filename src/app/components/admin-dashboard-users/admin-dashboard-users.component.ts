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
import { RegisteruserComponent } from '../registeruser/registeruser.component';

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
    AddimagetypeComponent,
    RegisteruserComponent
  ],
  providers: [AuthService],
  templateUrl: './admin-dashboard-users.component.html',
  styleUrl: './admin-dashboard-users.component.css',
})
export class AdminDashboardUsersComponent {
  searchText: string = '';
  isLoading: boolean = false;
  logoutLoading: boolean = false;
  users!: Users;
  error!: string;
  createInsurance: boolean = false;
  addImage: boolean = false;
  createUser: boolean = false;
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.fetchUser();
  }

  logout() {
    this.logoutLoading = true;
    this.authService
      .logout()
      .pipe(
        catchError((error) => {
          this.error = 'Something went wrong';
          this.logoutLoading = false;
          return of(null);
        })
      )
      .subscribe((logout) => {
        localStorage.clear();
        this.logoutLoading = false;
        this.router.navigate(['/']);
      });
  }

  deleteUser(id: string) {
    this.users.data.content = this.users.data.content.filter(
      (user) => user.id !== id
    );
  }

  fetchUser() {
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

  openCreateUser() { 
    this.createUser = !this.createUser;
    this.addImage = false;
    this.createInsurance = false;
  }
  openCreateInsurance() {
    this.addImage = false;
    this.createUser = false;
    this.createInsurance = !this.createInsurance;
  }

  openAddImage() {
    this.createInsurance = false
    this.createUser = false;
    this.addImage =!this.addImage;
  }

  statusLoading: boolean = false;
  changeStatus(id: string) {
    this.statusLoading = true;
    this.authService.deActivateStatus(id).pipe(
      catchError((error) => {
        this.statusLoading = false;
        return of(null);
      })
    ).subscribe((response) => { 
      if (response) {
        this.statusLoading = false;
        this.fetchUser();
      }
    });
  }

  activateStatus(id: string) {
    this.statusLoading = true;
    this.authService.activateStatus(id).pipe(
      catchError((error) => {
        this.statusLoading = false;
        return of(null);
      })
    ).subscribe((response) => { 
      if (response) {
        this.statusLoading = false;
        this.fetchUser();
      }
    });
  }
}
