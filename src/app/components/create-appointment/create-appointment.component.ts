import { CommonModule } from '@angular/common';
import { Component, ViewChild, ViewRef } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CoreModule } from '../../modules';
import { AuthService } from '../../services/auth.service';
import { catchError, of } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ImageTpesList, InsuranceList, UserWithRole } from '../../interfaces';
import { ToastrService } from 'ngx-toastr';
import { FrontDeskComponent } from '../front-desk/front-desk.component';

@Component({
  selector: 'app-create-appointment',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    CoreModule,
    HttpClientModule,
  ],
  providers: [AuthService],
  templateUrl: './create-appointment.component.html',
  styleUrl: './create-appointment.component.css',
})
export class CreateAppointmentComponent extends FrontDeskComponent {
  override patientForm!: FormGroup;
  override publisherForm!: FormGroup;
  override isLoading: boolean = false;
  override error: string = '';
  id: any;
  data: any;
  role!: string;
  constructor(
    authService: AuthService,
    fb: FormBuilder,
    private activetedRoute: ActivatedRoute,
    router: Router,
    private toastService: ToastrService
  ) {
    super(authService, fb, router, toastService);
  }
  override imageTypes: ImageTpesList[] = [];
  override insuranceTypes: InsuranceList[] = [];
  override users!: UserWithRole;

  override ngOnInit() {
    this.id = this.activetedRoute.snapshot.params['id'];
    if (this.id) {
      this.data = history.state;
      if (this.data) {
        this.data = this.data.data.content.find(
          (patient: any) => patient.id === this.id
        );
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
    this.publisherForm = this.patientForm;
    this.getImageTypeList();
    this.getUserAndRoles();
    this.getInsuranceList();
    this.getCurrentUser();
  }

  override submit() {
    if (this.publisherForm.valid) {
      this.error = '';
      this.isLoading = true;
      const {
        imageTypeId,
        insuranceId,
        appointmentDate,
        radiologistId,
        technicianId,
      } = this.publisherForm.controls;
      const patientId = this.id;
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

  getCurrentUser() {
    this.authService.getCurrentUser().subscribe((user) => {
      if (user) {
        this.role = user.data.role;
      }
    });
  }
}
