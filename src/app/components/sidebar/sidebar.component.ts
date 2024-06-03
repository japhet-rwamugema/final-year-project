import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CoreModule } from '../../modules';
import { catchError, of } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    RouterModule,
    HttpClientModule,
    CoreModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,

  ],
  providers:[AuthService],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  router = inject(Router)
  authService = inject(AuthService)
  isLogout: boolean = false;
  @Input() isSidebarOpen = false;
  @Output() sidebarToggled = new EventEmitter<boolean>();

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
    this.sidebarToggled.emit(this.isSidebarOpen);
  }

  logout() {
    this.isLogout = true;
    this.authService.logout().pipe(
      catchError(() => {
        this.isLogout = false;
        this.router.navigate(['/']);
        return of(null);
      })
    ).subscribe(() => {
      this.isLogout = false;
      this.router.navigate(['/']);
    });
  }

}
