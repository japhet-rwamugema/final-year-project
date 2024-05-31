import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { FrontDeskComponent } from './components/front-desk/front-desk.component';
import { TechnicianDashboardComponent } from './components/technician/technician-dashboard.component';
import { RadiologyComponent } from './components/radiologist-dashboard/radiology.component';
import { TechnologistReportComponent } from './components/technologist-report/technologist-report.component';
import { QualityAssuranceComponent } from './components/quality-assurance/quality-assurance.component';
import { AdminDashboardUsersComponent } from './components/admin-dashboard-users/admin-dashboard-users.component';
import { AdminDashboardRolesComponent } from './components/admin-dashboard-roles/admin-dashboard-roles.component';
import { FrontDeskDashboardComponent } from './components/front-desk-dashboard/front-desk-dashboard.component';
import { StudyComponent } from './components/study/study.component';
import { CreateAppointmentComponent } from './components/create-appointment/create-appointment.component';
import { AuthGuard } from './guard.guard';

export const routes: Routes = [{
    path: '', component: LoginComponent
}, {
    path: 'dashboard/admin', component: AdminDashboardComponent,
    canActivate: [AuthGuard]
},
{
    path: 'dashboard/admin/users', component: AdminDashboardUsersComponent,
    canActivate: [AuthGuard]
},
{
    path: 'dashboard/admin/roles', component: AdminDashboardRolesComponent,
    canActivate: [AuthGuard]
},
{
    path: 'dashboard/frontdesk', component: FrontDeskDashboardComponent,
    canActivate: [AuthGuard]
},
{
    path: 'dashboard/frontdesk/create', component: FrontDeskComponent,
    canActivate: [AuthGuard]
},
{
    path: 'dashboard/frontdesk/create/:id', component: CreateAppointmentComponent,
    canActivate: [AuthGuard]
},
{
    path: 'dashboard/technician', component: TechnicianDashboardComponent,
    canActivate: [AuthGuard]
}, {
    path: 'dashboard/radiology', component: RadiologyComponent,
    canActivate: [AuthGuard]
}, {
    path: 'dashboard/frontdesk/:id', component: TechnologistReportComponent,
    canActivate: [AuthGuard]
}, {
    path: 'study/:id', component: StudyComponent,
    canActivate: [AuthGuard]
},
{
    path: "quality", component: QualityAssuranceComponent,
    canActivate: [AuthGuard]
},

];
