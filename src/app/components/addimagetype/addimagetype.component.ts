import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '../../modules';
import { AuthService } from '../../services/auth.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-addimagetype',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CoreModule],
  providers:[AuthService],
  templateUrl: './addimagetype.component.html',
  styleUrl: './addimagetype.component.css'
})
export class AddimagetypeComponent {
  insuranceForm: FormGroup;
isLoading: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.insuranceForm = this.fb.group({
      name: ['', Validators.required],
      totalCost: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.insuranceForm.valid) {
      this.isLoading = true;
      console.log(this.insuranceForm.value);
      const { name, totalCost } = this.insuranceForm.controls
      this.authService.createImageType(name.value, totalCost.value).pipe(
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
