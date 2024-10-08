import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ImageTpesList, InsuranceList, UserWithRole } from '../../interfaces';
import { HttpClientModule } from '@angular/common/http';
import { catchError, of } from 'rxjs';
import { CoreModule } from '../../modules';
import { ToastrService } from 'ngx-toastr';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-front-desk',
  standalone: true,
  imports: [
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    CoreModule,
    SidebarComponent
  ],
  providers: [AuthService],
  templateUrl: './front-desk.component.html',
  styleUrl: './front-desk.component.css',
})
export class FrontDeskComponent {
  patientForm!: FormGroup;
  publisherForm!: FormGroup;
  isLoading: boolean = false;
  error: string = '';
  maxDate: string;
  role!: string;
  constructor(
    public authService: AuthService,
    public fb: FormBuilder,
    public router: Router,
    public toastr: ToastrService
  ) {
    this.minDate = new Date().toISOString().split('T')[0];
    const futureDate = new Date();
    futureDate.setDate(new Date().getDate() + 30);
    this.maxDate = futureDate.toISOString().split('T')[0];
  }
  imageTypes: ImageTpesList[] = [];
  insuranceTypes: InsuranceList[] = [];
  users!: UserWithRole;
  minDate!: string
  createForm() {
    return this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: [
        '',
        [Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
        ]
      ],
      address: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      imageTypeId: ['', Validators.required],
      insuranceId: ['', Validators.required],
      appointmentDate: ['', Validators.required],
      radiologistId: ['', Validators.required],
      technicianId: ['', Validators.required],
    });


  }
  ngOnInit() {
    this.patientForm = this.createForm();
    this.publisherForm = this.createForm();
  
    this.getImageTypeList();
    this.getInsuranceList();
    this.getUserAndRoles();
    this.getCurrentUser()
  }

  getImageTypeList() {
    this.authService.getImageTypeList().subscribe((imageTypes) => {
      this.imageTypes.push(imageTypes);
    });
  }
  getInsuranceList() {
    this.authService.getInsuranceList().subscribe((insurance) => {
      this.insuranceTypes.push(insurance);
    });
  }

  getUserAndRoles() {
    this.authService.getUsersAndRoles().subscribe((users) => {
      if (users) {
        this.users = users;
      }
    });
  }
  onSave() {
    if (this.patientForm.valid) {
      this.publisherForm.patchValue(this.patientForm.value);
     
    } else if (this.patientForm.invalid) {
      this.toastr.error('Please fill all required fields')
    } else {
      this.showFormErrors(this.patientForm)
    }
  }

  submit() {
    if (this.publisherForm.controls['appointmentDate'].valid) {
      this.error = '';
      this.isLoading = true;
      const {
        firstName,
        lastName,
        phoneNumber,
        address,
        dateOfBirth,
        imageTypeId,
        insuranceId,
        appointmentDate,
        radiologistId,
        technicianId,
      } = this.publisherForm.controls;

      this.authService
        .createPatient(
          firstName.value,
          lastName.value,
          phoneNumber.value,
          address.value,
          dateOfBirth.value
        )
        .pipe(
          catchError((error) => {
            this.isLoading = false;
            this.toastr.error(error.error.error)
            return of(null);
          })
        )
        .subscribe((data) => {
          {
            if (data) {
              const patientId = data.data.id;
              this.authService
                .createAppointment(
                  patientId,
                  radiologistId.value,
                  technicianId.value,
                  insuranceId.value,
                  imageTypeId.value,
                  appointmentDate.value
                )
                .pipe(
                  catchError(() => {
                    this.isLoading = false;
                    this.error = 'creating appointment failed';
                    return of(null);
                  })
                )
                .subscribe((data) => {
                  if (data) {
                    this.isLoading = false;
                    this.patientForm.reset();
                    this.publisherForm.reset();
                    this.router.navigate(['/dashboard/frontdesk']);
                  } else {
                    this.isLoading = false;
                    this.error = 'creating appointment failed';
                  }
                });
            }
          }
        });
    }
  }

  public showFormErrors(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control && control.invalid && control.touched) {
        const errors = this.getControlErrors(control);
        if (errors.length > 0) {
          this.toastr.error(`${key}: ${errors.join(', ')}`);
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

  getCurrentUser() {
    this.authService.getCurrentUser().subscribe((user) => {
      if (user) {
        this.role = user.data.role;
      }
    });
  }

  logout() {
    this.isLoading = true;
    this.authService.logout()
      .pipe(
        catchError((error) => {
          this.isLoading = false;
          this.router.navigate(['/']);
          return of(null);
        })
      )
      .subscribe((data) => {
        if (data) {
          this.isLoading = false;
          this.router.navigate(['/']);
        }
      });
  }

  isOpen = false;
  openSidebar(isOpen: boolean) {
    this.isOpen = isOpen;
  }
  toggleSidebar(): void { 
    this.isOpen = !this.isOpen;
  }
}
