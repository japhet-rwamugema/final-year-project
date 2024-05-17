import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard-roles',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './admin-dashboard-roles.component.html',
  styleUrl: './admin-dashboard-roles.component.css'
})
export class AdminDashboardRolesComponent {

  addRole: boolean = false

  openAddRoleDialog(){
    this.addRole = true
  }
  closeAddRoleDialog(){
    this.addRole = false
  }
  tableData = [
  
    {
    roleId:'20002',
    description:'Manages overall system settings and configurations.',
    role:'Technologist',
    status:'Active'
  },
    {
    roleId:'20002',
    description:'Manages overall system settings and configurations.',
    role:'Technologist',
    status:'Active'
  },
    {
    roleId:'20002',
    description:'Manages overall system settings and configurations.',
    role:'Technologist',
    status:'Active'
  },
    {
    roleId:'20002',
    description:'Manages overall system settings and configurations.',
    role:'Technologist',
    status:'Active'
  },
    {
    roleId:'20002',
    description:'Manages overall system settings and configurations.',
    role:'Technologist',
    status:'Active'
  },
    {
    roleId:'20002',
    description:'Manages overall system settings and configurations.',
    role:'Technologist',
    status:'Active'
  },
    {
    roleId:'20002',
    description:'Manages overall system settings and configurations.',
    role:'Technologist',
    status:'Active'
  },
  
  ]
}
