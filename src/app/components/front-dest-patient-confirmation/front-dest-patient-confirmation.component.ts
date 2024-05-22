import { Component } from '@angular/core';
import { CoreModule } from '../../modules';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { setDataService } from '../../services/data-service';
import { AppointmentCreation, AppointmentData } from '../../interfaces';
import { TrimPipe } from '../../pipes/trim.pipe';

@Component({
  selector: 'app-front-dest-patient-confirmation',
  standalone: true,
  imports: [CoreModule, RouterModule, HttpClientModule, TrimPipe],
  providers: [AuthService, setDataService],
  templateUrl: './front-dest-patient-confirmation.component.html',
  styleUrl: './front-dest-patient-confirmation.component.css',
})
export class FrontDestPatientConfirmationComponent {
  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  appoinmentData!: AppointmentData;

  ngOnInit() {
    this.appoinmentData = history.state;
  }
}
