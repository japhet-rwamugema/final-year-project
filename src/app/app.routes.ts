import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { FrontDeskComponent } from './components/front-desk/front-desk.component';
import { TechnicianDashboardComponent } from './components/technician/technician-dashboard.component';
import { TechnologistStudiesComponent } from './components/technologist-studies/technologist-studies.component';
import { TechnologistReportComponent } from './components/technologist-report/technologist-report.component';
import { PatientCheckInComponent } from './components/patient-check-in/patient-check-in.component';
import { AdminDashboardUsersComponent } from './components/admin-dashboard-users/admin-dashboard-users.component';
import { AdminDashboardRolesComponent } from './components/admin-dashboard-roles/admin-dashboard-roles.component';
import { FrontDeskDashboardComponent } from './components/front-desk-dashboard/front-desk-dashboard.component';
import { StudyComponent } from './components/study/study.component';

export const routes: Routes = [{
    path: '', component: LoginComponent
}, {
    path: 'dashboard/admin', component: AdminDashboardComponent
},
{
    path: 'dashboard/admin/users', component: AdminDashboardUsersComponent
},
{
    path: 'dashboard/admin/roles', component: AdminDashboardRolesComponent
},
{
    path: 'dashboard/frontdesk', component: FrontDeskDashboardComponent
},
{
    path: 'dashboard/frontdesk/create', component: FrontDeskComponent,
},
{
    path: 'dashboard/technician', component: TechnicianDashboardComponent
}, {
    path: 'technologist/patient-studies', component: TechnologistStudiesComponent
}, {
    path: 'technologist/reports', component: TechnologistReportComponent
}, {
    path: 'study/:id', component: StudyComponent
},
{
    path: "patient-checkin", component: PatientCheckInComponent
},


];
