import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard-users',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './admin-dashboard-users.component.html',
  styleUrl: './admin-dashboard-users.component.css'
})
export class AdminDashboardUsersComponent {
  tableData = [
  
    {
    staffId:'20002',
    user:'Courtney henry',
    role:'Technologist',
    status:'Active'
  },
    {
    staffId:'20002',
    user:'Courtney henry',
    role:'Technologist',
    status:'Active'
  },
    {
    staffId:'20002',
    user:'Courtney henry',
    role:'Technologist',
    status:'Active'
  },
    {
    staffId:'20002',
    user:'Courtney henry',
    role:'Technologist',
    status:'Active'
  },
    {
    staffId:'20002',
    user:'Courtney henry',
    role:'Technologist',
    status:'Active'
  },
    {
    staffId:'20002',
    user:'Courtney henry',
    role:'Technologist',
    status:'Active'
  },
    {
    staffId:'20002',
    user:'Courtney henry',
    role:'Technologist',
    status:'Active'
  },
  
  ]
}
