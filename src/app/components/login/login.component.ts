import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { CoreModule } from '../../modules';
import { Router, RouterModule } from '@angular/router';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, HttpClientModule, CoreModule, RouterModule],
  providers: [AuthService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  LoginForm!: FormGroup
  hidePassword: boolean = false
  isLoading: boolean = false
  error!: string

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) { }

  createForm() {
    return this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    })
  }
  ngOnInit() {
    this.LoginForm = this.createForm()
    this.LoginForm.valueChanges.subscribe(() => {
      this.error = ''
    })
  }
  login() {
    if (this.LoginForm.valid) {
      this.isLoading = true
      this.authService.login(this.LoginForm.controls['email'].value, this.LoginForm.controls['password'].value)
        .pipe(
          catchError(() => {
            this.error = 'Something went wrong'
            this.isLoading = false;
            return of(null);
          })
        )
        .subscribe((data) => {
          if (data) {
            localStorage.setItem('token', data.data.token.accessToken)
            this.authService.getCurrentUser().subscribe(data => {
              if (data) {
                this.redirectUserWithRole(data.data.role);
              }
            })
            this.isLoading = false
          }
        })
    }
  }


  togglePassword() {
    this.hidePassword = !this.hidePassword
  }

  redirectUserWithRole(role: string): void {
    switch (role) {
      case 'ADMIN':
        this.router.navigate(['/dashboard/admin']);
        break;
      case 'FRONT_DESK':
        this.router.navigate(['/dashboard/frontdesk']);
        break;
      case 'QUALITY_ASSURANCE':
        this.router.navigate(['/quality']);
        break;
      case 'FINANCE':
        this.router.navigate(['/quality']);
        break;
      case 'RADIOLOGIST':
        this.router.navigate(['/dashboard/radiology']);
        break;
      case 'TECHNICIAN':
        this.router.navigate(['/dashboard/technician']);
        break;

      default:
        break;
    }
  }
}
