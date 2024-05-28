import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CoreModule } from '../../modules';
import { AuthService } from '../../services/auth.service';
import { catchError, of } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ImageTpesList, InsuranceList, UserWithRole } from '../../interfaces';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-appointment',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, CoreModule, HttpClientModule],
  providers: [AuthService],
  templateUrl: './create-appointment.component.html',
  styleUrl: './create-appointment.component.css'
})
export class CreateAppointmentComponent {
  patientForm!: FormGroup;
  publisherForm!: FormGroup;
  isLoading: boolean = false;
  error: string = '';
  id: any;
  data: any;
  role!: string;
  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private activetedRoute: ActivatedRoute,
    private router: Router,
    private toastService: ToastrService
  ) { }
  imageTypes: ImageTpesList[] = [];
  insuranceTypes: InsuranceList[] = [];
  users!: UserWithRole;

  ngOnInit() {
    this.id = this.activetedRoute.snapshot.params['id'];
    if (this.id) {
      this.data = history.state
      if (this.data) {
        this.data = this.data.data.content.find((patient: any) => patient.id === this.id)
      }
    }
    this.patientForm = this.fb.group({
      firstName: [this.data.firstName, Validators.required],
      lastName: [this.data.lastName, Validators.required],
      phoneNumber: [this.data.phoneNumber, Validators.required],
      address: [this.data.address, Validators.required],
      dateOfBirth: [this.data.dateOfBirth, Validators.required],
      imageTypeId: ['', Validators.required],
      insuranceId: ['', Validators.required],
      appointmentDate: ['', Validators.required],
      radiologistId: ['', Validators.required],
      technicianId: ['', Validators.required],
    });
    this.publisherForm = this.patientForm
    this.authService.getImageTypeList().subscribe((imageTypes) => {
      this.imageTypes.push(imageTypes);
    });
    this.authService.getInsuranceList().subscribe((insurance) => {
      this.insuranceTypes.push(insurance);
    });
    this.getCurrentUser();
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
      this.error = ''
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
                  catchError((error) => {
                    this.isLoading = false;
                    this.toastService.error(error.error.error);
                    return of(null);
                  })
                )
                .subscribe((data) => {
                  if (data) {
                    this.isLoading = false;
                    this.patientForm.reset();
                    this.publisherForm.reset();
                    this.toastService.success('Appointment created successfully');
                    setTimeout(() => {
                      this.router.navigate(['/dashboard/frontdesk']);
                    }, 2000);
                  } else {
                    this.isLoading = false;
                  }
                });
            }
          }
        });
    }
  }

  getCurrentUser() {
    this.authService.getCurrentUser().subscribe((user) => {
      if (user) {
        this.role = user.data.role;
      }
    });
  }
}
