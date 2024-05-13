import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { SpinnerComponent } from '../spinner/spinner.component';
import { CoreModule } from '../../modules';
import { Router, RouterModule } from '@angular/router';

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
  constructor(private fb: FormBuilder, private authService: AuthService, private router:Router) { }

  createForm() {
    return this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    })
  }
  ngOnInit() {
    this.LoginForm = this.createForm()
  }

  login() {
    if (this.LoginForm.valid) {
      this.isLoading = true
      this.authService.login(this.LoginForm.controls['email'].value, this.LoginForm.controls['password'].value).subscribe(data => {
        if (data) {
          localStorage.setItem('token', data.data.token.accessToken)
          this.authService.getCurrentUser().subscribe(data => {
            if (data) {
              if (data.data.role === 'ADMIN') {
                this.router.navigate(['/dashboard/admin']);
              }
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
}
