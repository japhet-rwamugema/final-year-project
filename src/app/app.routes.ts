import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { FrontDeskComponent } from './components/front-desk/front-desk.component';
import { FrontDestPatientConfirmationComponent } from './components/front-dest-patient-confirmation/front-dest-patient-confirmation.component';
import { TechnologistStudiesComponent } from './components/technologist-studies/technologist-studies.component';
import { TechnologistReportComponent } from './components/technologist-report/technologist-report.component';
import { RadiologyStudyComponent } from './components/radiology-study/radiology-study.component';
import { PatientCheckInComponent } from './components/patient-check-in/patient-check-in.component';
import { AdminDashboardUsersComponent } from './components/admin-dashboard-users/admin-dashboard-users.component';
import { AdminDashboardRolesComponent } from './components/admin-dashboard-roles/admin-dashboard-roles.component';

export const routes: Routes = [{
    path:'', component:LoginComponent
},{
    path:'dashboard/admin', component: AdminDashboardComponent
}, 
{
    path:'dashboard/admin/users', component: AdminDashboardUsersComponent
},
{
    path:'dashboard/admin/roles', component: AdminDashboardRolesComponent
},
{
    path:'frontdesk', component: FrontDeskComponent,
},
    {
        path:'frontdesk/appointment-confirmation', component: FrontDestPatientConfirmationComponent
    },{
        path:'technologist/patient-studies', component: TechnologistStudiesComponent
    },{
        path:'technologist/reports', component: TechnologistReportComponent
    }, {
        path:'radiology', component:RadiologyStudyComponent
    },
    {
        path:"patient-checkin", component:PatientCheckInComponent
    }
];
