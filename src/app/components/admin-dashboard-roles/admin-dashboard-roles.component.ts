import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { catchError, of } from 'rxjs';
import { Users } from '../../interfaces';
import { HttpClientModule } from '@angular/common/http';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CoreModule } from '../../modules';
import { FilterPipe } from '../../pipes/trim.pipe';

@Component({
  selector: 'app-admin-dashboard-roles',
  standalone: true,
  imports: [RouterModule, HttpClientModule, ReactiveFormsModule, CoreModule, FilterPipe, FormsModule],
  providers:[AuthService],
  templateUrl: './admin-dashboard-roles.component.html',
  styleUrl: './admin-dashboard-roles.component.css'
})
export class AdminDashboardRolesComponent {

  constructor(private authService: AuthService, private router:Router) { 
    this.roleControl = new FormControl('ADMIN', Validators.required)
  }

  seartchText:string = '';
  roleControl!: FormControl
  logoutLoading: boolean = false;
  isLoading: boolean = false;
  tableData!:Users 
  ngOnInit() {
    this.fetchUser(this.roleControl.value)
   }

  fetchUser(role: string) {
    this.isLoading = true;
    this.authService
      .getUsers(1, 5, role)
      .pipe(
        catchError((error) => {
          this.isLoading = false;
          return of(null);
        })
      )
      .subscribe((users) => {
        if (users) {
          this.tableData = users;
          this.isLoading = false;
        }
      });
  }

  change() {
    this.fetchUser(this.roleControl.value)
  }
  logout() {
    this.logoutLoading = true;
    this.authService
      .logout()
      .pipe(
        catchError((error) => {
          this.logoutLoading = false;
          return of(null);
        })
      )
      .subscribe((logout) => {
        localStorage.clear();
        this.logoutLoading = false;
        this.router.navigate(['/']);
      });
  }
}
