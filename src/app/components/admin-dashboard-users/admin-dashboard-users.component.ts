import { Component, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CoreModule } from '../../modules';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { catchError, Observable, of, throwError } from 'rxjs';
import { Users } from '../../interfaces';
import { FilterPipe, SortByCreatedAtPipe, TrimPipe } from '../../pipes/trim.pipe';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaginationComponent } from '../pagination/pagination.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-dashboard-users',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule,
    FormsModule,
    CommonModule,
    CoreModule,
    TrimPipe,
    FilterPipe,
    SortByCreatedAtPipe,
    PaginationComponent
  ],
  providers: [AuthService],
  templateUrl: './admin-dashboard-users.component.html',
  styleUrl: './admin-dashboard-users.component.css',
})
export class AdminDashboardUsersComponent {
  searchText: string = '';
  isLoading: boolean = false;
  logoutLoading: boolean = false;
  signUpLoading: boolean = false;
  users!: Users;
  error!: string;
  createInsurance: boolean = false;
  addImage: boolean = false;
  createUser: boolean = false;
  signupForm: FormGroup;
  page: number = 1;
  constructor(private authService: AuthService, private router: Router, private fb: FormBuilder, private toastService:ToastrService) {
    this.signupForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', Validators.required]
    });
  }
  totalPages: number = 0;
  ngOnInit() {
    this.fetchUser();
    if (this.users) {
      this.totalPages = this.users.data.totalPages;
    }
  }

  onPageChanged(page: number) {
    this.page = page;
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
      .getUsers(this.page, 5)
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

  onSubmit() {
    if (this.signupForm.valid) {
      this.signUpLoading = true;
      this.authService.userRegister(this.signupForm.value)
        .pipe(
          catchError((error) => {
            this.isLoading = false;
            return of(null);
          })
        )
        .subscribe((response) => {
          if (response) {
            this.isLoading = false;
            this.createUser = false;
            this.toastService.success('User created successfully');
            setTimeout(() => {
              this.fetchUser();
            }, 2000)
            this.signupForm.reset();
          }
        });
    }
  }
}
