import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TrimPipe } from '../../pipes/trim.pipe';
import { catchError, of } from 'rxjs';
import { CoreModule } from '../../modules';

@Component({
  selector: 'app-study',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule, RouterModule, TrimPipe, CoreModule],
  providers: [AuthService],
  templateUrl: './study.component.html',
  styleUrl: './study.component.css'
})
export class StudyComponent {
  radiologyReport() {
    if (this.commentControl.valid) {
      this.isLoading = true;
      this.authService.markAsConsulted(this.appointmentId, this.commentControl.value)
        .pipe(
          catchError((error: any) => {
            this.isLoading = false;
            return of(null)
          }))
        .subscribe(data => {
          if (data) {
            this.isLoading = false;
            this.route.navigate(['/dashboard/radiology']);
          }
        })
    }
  }
  commentControl: FormControl
  constructor(private authService: AuthService, private router: ActivatedRoute, private route: Router) {
    this.commentControl = new FormControl('', Validators.required)
  }
  selectedimage!: File
  file!: File
  role: string = ''
  data!: any[]
  appointmentId!: string
  isLoading: boolean = false

  onFileSelected(event: any) {
    this.file = event.target.files[0];
    if (this.file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedimage = e.target.result
      };
      reader.readAsDataURL(this.file);
    }
  }
  fetch() {
    this.authService.getCurrentUser()
      .subscribe(user => {
        if (user) {
          this.role = user.data.role;
        }
      })
  }
  ngOnInit() {
    const id = this.router.snapshot.paramMap.get('id');
    if (id) {
      this.appointmentId = id;
    }
    const data = history.state
    this.data = data.data.content.filter((appointment: any) => appointment.id === id);
    console.log(this.data);
    this.fetch();
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
      this.authService.makeReport(this.file, this.commentControl.value, this.appointmentId)
        .pipe(
          catchError((error) => {
            this.isLoading = false;
            return of(null)
          })
        )
        .subscribe(response => {
          if (response) {
            this.isLoading = false;
            this.route.navigate(['/dashboard/technician'])
          }
        })
    }
  }
}
