import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CoreModule } from '../../modules';
import { AuthService } from '../../services/auth.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-registeruser',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, CoreModule],
  providers:[AuthService],
  templateUrl: './registeruser.component.html',
  styleUrl: './registeruser.component.css'
})
export class RegisteruserComponent {
  signupForm: FormGroup;
  isLoading: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.signupForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', Validators.required]
    });
   }

  onSubmit(): void {
    this.isLoading = true;
    if (this.signupForm.valid) {
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
          this.signupForm.reset();
        }
      });
    }
  }
}
