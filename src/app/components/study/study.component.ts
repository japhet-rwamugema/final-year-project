import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Route, Router, RouterModule } from '@angular/router';
import { AppointmentUserData } from '../../interfaces';
import { TrimPipe } from '../../pipes/trim.pipe';

@Component({
  selector: 'app-study',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule, RouterModule, TrimPipe],
  providers: [AuthService],
  templateUrl: './study.component.html',
  styleUrl: './study.component.css'
})
export class StudyComponent {
  commentControl:FormControl
  constructor(private authService: AuthService, private router: ActivatedRoute) {
    this.commentControl = new FormControl('', Validators.required)
   }
  selectedimage!: File
  file!: File
  role: string = ''
  data!: any[]

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
    console.log(this.commentControl.value);
  }
}
