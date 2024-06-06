import { Component, HostListener, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CoreModule } from '../../modules';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { catchError, Observable, of, throwError } from 'rxjs';
import { Users } from '../../interfaces';
import { FilterPipe, SortByCreatedAtPipe, TrimPipe } from '../../pipes/trim.pipe';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaginationComponent } from '../pagination/pagination.component';
import { ToastrService } from 'ngx-toastr';
import { SidebarComponent } from '../sidebar/sidebar.component';

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
    PaginationComponent,
    SidebarComponent
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
      phoneNumber: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', Validators.required]
    });
  }
  totalPages: number = 0;
  ngOnInit() {
    this.onResize();
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
        this.toastService.error(error.error.message);
        return of(null);
      })
    ).subscribe((response) => {
      if (response) {
        this.statusLoading = false;
        this.toastService.success('User deactivated successfully');
        this.fetchUser();
      }
    });
  }

  activateStatus(id: string) {
    this.statusLoading = true;
    this.authService.activateStatus(id).pipe(
      catchError((error) => {
        this.statusLoading = false;
        this.toastService.error(error.error.message);
        return of(null);
      })
    ).subscribe((response) => {
      if (response) {
        this.toastService.success('User activated successfully');
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
            this.signUpLoading = false;
            this.toastService.error(error.error.message);
            return of(null);
          })
        )
        .subscribe((response) => {
          if (response) {
            this.signUpLoading = false;
            this.createUser = false;
            this.toastService.success('User created successfully');
            setTimeout(() => {
              this.fetchUser();
            }, 2000)
            this.signupForm.reset();
          }
        });
    }
    else {
      this.showFormErrors(this.signupForm);
    }
  }

  public showFormErrors(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control && control.invalid && control.touched) {
        const errors = this.getControlErrors(control);
        if (errors.length > 0) {
          this.toastService.error(`${key}: ${errors.join(', ')}`);
        }
      }
    });
  }

  public getControlErrors(control: AbstractControl): string[] {
    const errors: string[] = [];
    if (control.errors) {
      for (const errorName in control.errors) {
        if (control.errors.hasOwnProperty(errorName)) {
          switch (errorName) {
            case 'required':
              errors.push('is required');
              break;
            case 'minlength':
              const minLengthError = control.errors['minlength'];
              errors.push(`must be at least ${minLengthError.requiredLength} characters long`);
              break;
            default:
              errors.push(`${errorName} error`);
          }
        }
      }
    }
    return errors;
  }
  isSidebarOpen = false;
  viewSidebar(isOpen: boolean) {
    this.isSidebarOpen = isOpen;
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?: Event): void {
    const width = window.innerWidth;
  }

}
