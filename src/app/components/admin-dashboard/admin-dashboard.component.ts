import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { catchError, of } from 'rxjs';
import { ImageTpesList, InsuranceList, PatientsData, Users } from '../../interfaces';
import { HttpClientModule } from '@angular/common/http';
import { CoreModule } from '../../modules';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    RouterModule,
    HttpClientModule,
    CoreModule,
    ReactiveFormsModule,
  ],
  providers: [AuthService],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent {
  addImage: boolean = false;
  createInsurance: boolean = false;
  insuranceForm: FormGroup;
  imageForm: FormGroup;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private toastService: ToastrService
  ) {
    this.insuranceForm = this.fb.group({
      name: ['', Validators.required],
      rating: [''],
    });
    this.imageForm = this.fb.group({
      name: ['', Validators.required],
      totalCost: ['', [Validators.required]],
    });
  }

  isLoading: boolean = false;
  page: number = 1;
  users!: Users;
  imageTypes!: ImageTpesList;
  insuranceList!: InsuranceList;
  patientData!: PatientsData

  ngOnInit() {
    this.fetchUser();
    this.fetchImages();
    this.fetchInsurance();
    this.fetchPatients();
  }

  fetchUser() {
    this.isLoading = true;
    this.authService
      .getUsers(this.page, 5)
      .pipe(
        catchError(() => {
          this.isLoading = false;
          return of(null);
        })
      )
      .subscribe((users) => {
        if (users) {
          this.users = users;
          this.isLoading = false;
        }
      });
  }

  fetchImages() {
    this.authService.getImageTypeList().subscribe((data) => {
      if (data) {
        this.imageTypes = data;
      }
    });
  }

  fetchInsurance() {
    this.authService.getInsuranceList().subscribe((data) => {
      if (data) {
        this.insuranceList = data;
      }
    });
  }
  fetchPatients() {
    this.authService.getPatients(1, 5).subscribe((data) => {
      if (data) {
        this.patientData = data;
      }
    })
  }

  openCreateInsurance() {
    this.addImage = false;
    this.createInsurance = !this.createInsurance;
  }

  openAddImage() {
    this.createInsurance = false;
    this.addImage = !this.addImage;
  }
  onSubmit() {
    if (this.insuranceForm.valid) {
      this.isLoading = true;
      const { name, rating } = this.insuranceForm.controls;
      this.authService
        .createInsurance(name.value, parseInt(rating.value, 10))
        .pipe(
          catchError((error) => {
            this.isLoading = false;
            this.createInsurance = false;
            this.toastService.error(error.error.error);
            return of(null);
          })
        )
        .subscribe((data) => {
          if (data) {
            this.isLoading = false;
            this.createInsurance = false;
            this.insuranceForm.reset();
            this.toastService.success('Insurance created Successfully');
            this.fetchInsurance();
          }
        });
    }
  }

  onCreateImage() {
    if (this.imageForm.valid) {
      this.isLoading = true;
      console.log(this.imageForm.value);
      const { name, totalCost } = this.imageForm.controls;
      this.authService
        .createImageType(name.value, totalCost.value)
        .pipe(
          catchError((error) => {
            this.isLoading = false;
            this.toastService.error('Image Type Creation Failed');
            return of(null);
          })
        )
        .subscribe((data) => {
          if (data) {
            this.isLoading = false;
            this.addImage = false;
            this.imageForm.reset();
            this.toastService.success('Image Type Created Successfully');
            this.fetchImages();
          }
        });
    }
  }


}
