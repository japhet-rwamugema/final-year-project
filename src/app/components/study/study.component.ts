import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TrimPipe } from '../../pipes/trim.pipe';
import { catchError, of } from 'rxjs';
import { CoreModule } from '../../modules';
import { environment } from '../../../environments/env';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-study',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    TrimPipe,
    CoreModule,
  ],
  providers: [AuthService],
  templateUrl: './study.component.html',
  styleUrl: './study.component.css',
})
export class StudyComponent {
  backendUrl: string = environment.BACKEND_URL;
  radiologyReport() {
    if (this.commentControl.valid) {
      this.isLoading = true;
      this.authService
        .markAsConsulted(this.appointmentId, this.commentControl.value)
        .pipe(
          catchError((error: any) => {
            this.isLoading = false;
            this.toast.error(error.error.message);
            return of(null);
          })
        )
        .subscribe((data) => {
          if (data) {
            this.isLoading = false;
            this.toast.success('Marked as consulted successfully');
            setTimeout(() => { 
              this.route.navigate(['/dashboard/radiology']);
            }, 2000);
          }
        });
    }
  }
  commentControl: FormControl;
  constructor(
    private authService: AuthService,
    private router: ActivatedRoute,
    private route: Router,
    private toast: ToastrService,
    private http: HttpClient
  ) {
    this.commentControl = new FormControl('', Validators.required);
  }
  selectedimage!: File;
  file!: File;
  role: string = '';
  data!: any[];
  appointmentId!: string;
  isLoading: boolean = false;
  imageUrl!: string;


  onFileSelected(event: any) {
    this.file = event.target.files[0];
    if (this.file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedimage = e.target.result;
      };
      reader.readAsDataURL(this.file);
    }
  }
  fetch() {
    this.authService.getCurrentUser().subscribe((user) => {
      if (user) {
        this.role = user.data.role;
      }
    });
  }

  ngOnInit() {
    const id = this.router.snapshot.paramMap.get('id');
    if (id) {
      this.appointmentId = id;
    }
    const data = history.state;
    this.data = data.data.content.filter(
      (appointment: any) => appointment.id === id
    );
    this.fetch();
    this.fetchImage();
  }
  fetchImage(name: string =this.data[0].images[0].image.name) {
    this.authService.getFileName(name)
      .pipe(
        catchError(() => {
          this.toast.error('Fetching image failed');
          return of(null);
        })
      )
      .subscribe((arrayBuffer: ArrayBuffer | null) => {
        if (arrayBuffer) { 
          const blob = new Blob([arrayBuffer], { type: 'image/jpeg' });
          const reader = new FileReader();
          reader.onload = (event: any) => {
            this.imageUrl = event.target.result;
          };
          reader.readAsDataURL(blob);
        }
    });
  }

  viewMode: string = 'hide';
  showMore() {
    this.viewMode = 'more';
  }
  viewHide() {
    this.viewMode = 'hide';
  }

  makeReport() {
    if (this.commentControl.valid) {
      this.isLoading = true;
      this.authService
        .makeReport(this.file, this.commentControl.value, this.appointmentId)
        .pipe(
          catchError((error) => {
            this.toast.error(error.error.message);
            this.isLoading = false;
            return of(null);
          })
        )
        .subscribe((response) => {
          if (response) {
            this.isLoading = false;
            this.toast.success('Report created successfully');

            setTimeout(() => {
              this.route.navigate(['/dashboard/technician']);
            }, 2000);
          }
        });
    }
  }

  qualityAssured() {
    this.isLoading = true;
    this.authService
      .qualityAssured(this.appointmentId)
      .pipe(
        catchError((error) => {
          this.isLoading = false;
          this.toast.error(error.error.message);
          return of(null);
        })
      )
      .subscribe((data) => {
        if (data) {
          this.isLoading = false;
          this.toast.success('Quality checked successfully');
          setTimeout(() => {
            this.route.navigate(['/quality']);
          }, 2000);
        }
      });
  }

  logoutLoading: boolean = false;
  logout() {
    this.logoutLoading = true;
    this.authService
      .logout()
      .pipe(
        catchError((error) => {
          this.route.navigate(['/']);
          this.logoutLoading = false;
          return of(null);
        })
      )
      .subscribe(() => {
        localStorage.removeItem('token');
        this.logoutLoading = false;
        this.route.navigate(['/']);
      });
  }
}
