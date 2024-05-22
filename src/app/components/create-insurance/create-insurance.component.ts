import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CoreModule } from '../../modules';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-create-insurance',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CoreModule],
  providers: [AuthService],
  templateUrl: './create-insurance.component.html',
  styleUrl: './create-insurance.component.css'
})
export class CreateInsuranceComponent {
  insuranceForm: FormGroup;
  isLoading: boolean = false;
  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.insuranceForm = this.fb.group({
      name: ['', Validators.required],
      rating: ['']
    });
  }


  ngOnInit() {

  }
  onSubmit() {
    if (this.insuranceForm.valid) {
      this.isLoading = true;
      const { name, rating } = this.insuranceForm.controls;
      console.log(name.value, rating.value);

      this.authService.createInsurance(name.value, parseInt(rating.value,10))
        .pipe(
          catchError(error => {
            this.isLoading = false;
            return of(null);
          })
        )
        .subscribe(data => {
          if (data) {
            this.isLoading = false;
            this.insuranceForm.reset();
          }
        })
    } else {
      console.log('Form is invalid');
    }
  }
}
