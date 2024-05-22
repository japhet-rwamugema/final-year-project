import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import {
  AppointmentCreation,
  ImageTpesList,
  imageTypeData,
  InsuranceList,
  UserWithRole,
} from '../../interfaces';
import { HttpClientModule } from '@angular/common/http';
import { catchError, of } from 'rxjs';
import { CoreModule } from '../../modules';
import { setDataService } from '../../services/data-service';
import { state } from '@angular/animations';

@Component({
  selector: 'app-front-desk',
  standalone: true,
  imports: [
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    CoreModule,
  ],
  providers: [AuthService, setDataService],
  templateUrl: './front-desk.component.html',
  styleUrl: './front-desk.component.css',
})
export class FrontDeskComponent {
  patientForm!: FormGroup;
  publisherForm!: FormGroup;
  isLoading: boolean = false;
  error: string = '';
  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private dataService: setDataService<AppointmentCreation>,
    private router:Router
  ) {}
  imageTypes: ImageTpesList[] = [];
  insuranceTypes: InsuranceList[] = [];
  users!: UserWithRole;

  createForm() {
    return this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
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
    this.authService.getUsersAndRoles().subscribe((users) => {
      if (users) {
        this.users = users;
      }
    });
    this.authService.getImageTypeList().subscribe((imageTypes) => {
      this.imageTypes.push(imageTypes);
    });
    this.authService.getInsuranceList().subscribe((insurance) => {
      this.insuranceTypes.push(insurance);
    });
  }

  onSave() {
    if (this.patientForm.valid) {
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
      } = this.patientForm.controls;

      this.publisherForm = this.fb.group({
        firstName: [firstName.value, Validators.required],
        lastName: [lastName.value, Validators.required],
        phoneNumber: [phoneNumber.value, Validators.required],
        address: [address.value, Validators.required],
        dateOfBirth: [dateOfBirth.value, Validators.required],
        imageTypeId: [imageTypeId.value, Validators.required],
        insuranceId: [insuranceId.value, Validators.required],
        appointmentDate: [appointmentDate.value, Validators.required],
        radiologistId: [radiologistId.value, Validators.required],
        technicianId: [technicianId.value, Validators.required],
      });
    }
  }

  submit() {
    if (this.publisherForm.valid) {
      this.error =  ''
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
          catchError(() => {
            this.isLoading = false;
            this.error = 'creating patient failed';
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
}
