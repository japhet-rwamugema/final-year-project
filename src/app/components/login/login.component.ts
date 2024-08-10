import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { CoreModule } from '../../modules';
import { Router, RouterModule } from '@angular/router';
import { catchError, filter, of, Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    CoreModule,
    RouterModule,
  ],
  providers: [AuthService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  public LoginForm!: FormGroup;
  public hidePassword: boolean = false;
  public isLoading: boolean = false;
  public error!: string;
  public subscription: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.LoginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
  ngOnInit() {
    this.subscription.add(
      this.LoginForm.valueChanges.subscribe(() => {
        this.error = '';
      })
    );
  }
  public login() {
    if (this.LoginForm.valid) {
      this.isLoading = true;

      this.subscription.add(
        this.authService
          .login(
            this.LoginForm.controls['email'].value,
            this.LoginForm.controls['password'].value
          )
          .pipe(
            catchError((error) => {
              this.error = error.error.message;
              this.isLoading = false;
              return of(null);
            }),
            filter((data) => !!data && !!data.data && !!data.data.token && !!data.data.token.accessToken)
          )
          .subscribe((data) => {
            if (data && data.data && data.data.token && data.data.token.accessToken) {
              localStorage.setItem('token', data.data.token.accessToken);
            }
            this.subscription.add(
              this.authService
                .getCurrentUser()
                .pipe(filter((data) => !!data))
                .subscribe((data) => {
                  this.redirectUserWithRole(data.data.role);
                })
            );
            this.isLoading = false;
          })
      );
    }
  }

  public togglePassword() {
    this.hidePassword = !this.hidePassword;
  }

  private redirectUserWithRole(role: string): void {
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

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
