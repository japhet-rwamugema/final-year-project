import { Injectable } from '@angular/core';
import { environment } from '../../environments/env';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { AddImageResponse, AppointmentCreation, AppointmentUserData, CheckInResponse, currentUserResponse, ErrorResponse, ImageTpesList, ImageTypeData, InsuranceData, InsuranceList, loginResponse, Logout, Patient, PatientsData, StatusResponse, UploadImageResponse, UserRegister, Users, UserWithRole } from '../interfaces';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  token: string | null = null;
  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<loginResponse> {
    const response = this.http.post<loginResponse>(`${environment.BACKEND_URL}/auth/signin`, {
      email, password
    })
    return response
  }
  userRegister(user: UserRegister): Observable<loginResponse> {
    this.setHeaders()
    const header = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    })
    const response = this.http.post<loginResponse>(`${environment.BACKEND_URL}/users/register`, {
      ...user
    }, {
      headers: header
    })
    return response
  }
  logout(): Observable<Logout> {
    this.setHeaders();
    const header = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    })
    return this.http.post<Logout>(`${environment.BACKEND_URL}/auth/signOut`,
      null,
      {
        headers: header
      })
  }
  getCurrentUser(): Observable<currentUserResponse> {
    this.setHeaders();
    const header = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    })
    return this.http.get<currentUserResponse>(`${environment.BACKEND_URL}/auth/currentUser`, {
      headers: header
    })
  }
  setHeaders() {
    this.token = localStorage.getItem('token');
  }

  getInsuranceList(): Observable<InsuranceList> {
    this.setHeaders();
    const header = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    })
    return this.http.get<InsuranceList>(`${environment.BACKEND_URL}/insurances/list`, {
      headers: header
    })
  }

  getImageTypeList(): Observable<ImageTpesList> {
    this.setHeaders()
    const header = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    })
    return this.http.get<ImageTpesList>(`${environment.BACKEND_URL}/imageTypes/list`, {
      headers: header,
    });
  }

  createPatient(firstName: string,
    lastName: string,
    phoneNumber: string,
    address: string,
    dateOfBirth: Date): Observable<Patient> {
    this.setHeaders();
    const header = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    })
    return this.http.post<Patient>(`${environment.BACKEND_URL}/patients/register`,
      {
        firstName,
        lastName,
        phoneNumber,
        address,
        dateOfBirth
      },
      {
        headers: header,
      })
  }

  getUsers(page: number, limit: number, role?:string): Observable<Users> {
    this.setHeaders();
    const header = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    })

    let params = new HttpParams()
      .set('page', page)
      .set('limit', limit)
    
    if (role) { 
      params = params.set('role', role)
    }
    return this.http.get<Users>(`${environment.BACKEND_URL}/users/search`, {
      headers: header,
      params
    })
  }
  getUsersAndRoles(role?: string): Observable<UserWithRole> {
    this.setHeaders();
    const header = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    })
    if (role) {
      return this.http.get<UserWithRole>(`${environment.BACKEND_URL}/users/asList`, {
        headers: header,
        params: {
          role,
        }
      })
    }
    return this.http.get<UserWithRole>(`${environment.BACKEND_URL}/users/asList`, {
      headers: header,
    })
  }
  createAppointment(
    patientId: string,
    radiologistId: string,
    technicianId: string,
    insuranceId: string,
    imageTypeId: string,
    date: Date,
  ): Observable<AppointmentCreation> {
    this.setHeaders()
    const header = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    })
    return this.http.post<AppointmentCreation>(`${environment.BACKEND_URL}/patientAppointments/register`,
      {
        patientId,
        radiologistId,
        technicianId,
        insuranceId,
        imageTypeId,
        date,
      },
      {
        headers: header,
      })
  }

  createInsurance(name: string, rate: number): Observable<InsuranceData> {
    this.setHeaders();
    const header = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    })
    return this.http.post<InsuranceData>(`${environment.BACKEND_URL}/insurances/register`,
      {
        name,
        rate
      },
      {
        headers: header
      })
  }
  createImageType(name: string, totalCost: number): Observable<ImageTypeData> {
    this.setHeaders();
    const header = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    })
    return this.http.post<ImageTypeData>(`${environment.BACKEND_URL}/imageTypes/register`,
      {
        name,
        totalCost
      },
      {
        headers: header
      })
  }

  getPatients(page: number, limit: number): Observable<PatientsData> {
    this.setHeaders()
    const header = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    })
    return this.http.get<PatientsData>(`${environment.BACKEND_URL}/patients`, {
      headers: header,
      params: {
        page,
        limit
      }
    }
    )
  }
  getAppointmentsByDate(page: number, limit: number, date?: string): Observable<AppointmentUserData> {
    this.setHeaders();
    const header = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    let url = `${environment.BACKEND_URL}/patientAppointments/myAppointments`;

    const params:any = { page: page, limit: limit };
    if (date) {
      params.date = date
    }

    return this.http.get<AppointmentUserData>(url, {
      headers: header,
      params: params
    });
  }


  uploadImage(file: File): Observable<UploadImageResponse> {
    this.setHeaders();
    const header = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    })

    const formData = new FormData();
    formData.append('file', file);    
    return this.http.post<UploadImageResponse>(`${environment.BACKEND_URL}/files/upload`, formData, { headers: header })

  }

  addImageOnAppointment(id: string, remarks: string, imageId: string): Observable<AddImageResponse> {
    this.setHeaders();
    const header = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    })
    const options = {
      imageId: imageId,
      remarks: remarks
    }
    return this.http.put<AddImageResponse>(`${environment.BACKEND_URL}/patientAppointments/${id}/addImage`,
      options,
      { headers: header })
  }

  makeReport(file: File, remarks: string, appointmentId: string): Observable<AddImageResponse> {
    return this.uploadImage(file)
      .pipe(
        switchMap(response => this.addImageOnAppointment(appointmentId, remarks, response.data.id))
      )
  }

  checkIn(id: string): Observable<CheckInResponse> {
    this.setHeaders();
    const header = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    })
    return this.http.put<CheckInResponse>(`${environment.BACKEND_URL}/patientAppointments/${id}/checkIn`,
      null,
      {
        headers: header
      })
  }
  qualityAssured(id: string): Observable<CheckInResponse> {
    this.setHeaders();
    const header = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    })
    return this.http.put<CheckInResponse>(`${environment.BACKEND_URL}/patientAppointments/${id}/markAsQualityChecked`,
      null,
      {
        headers: header
      })
  }
  markAsConsulted(id: string, finalRemarks: string): Observable<CheckInResponse> {
    this.setHeaders();
    const header = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    })
    return this.http.put<CheckInResponse>(`${environment.BACKEND_URL}/patientAppointments/${id}/markAsConsulted`,
      { finalRemarks },
      {
        headers: header
      })
  }
  markAsPaid(id: string): Observable<CheckInResponse> {
    this.setHeaders();
    const header = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    })
    return this.http.put<CheckInResponse>(`${environment.BACKEND_URL}/patientAppointments/${id}/markAsPaid`,
      null,
      {
        headers: header
      })
  }

  deActivateStatus(id: string): Observable<StatusResponse> {
    this.setHeaders();
    const header = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    })
    return this.http.put<StatusResponse>(`${environment.BACKEND_URL}/users/${id}/deactivate`,
    null,
      {
        headers: header
      }
    )
  }
  activateStatus(id: string): Observable<StatusResponse> {
    this.setHeaders();
    const header = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    })
    return this.http.put<StatusResponse>(`${environment.BACKEND_URL}/users/${id}/activate`,
    null,
      {
        headers: header
      }
    )
  }

  getFileName(name:string): Observable<ArrayBuffer> {
    return this.http.get<ArrayBuffer>(`${environment.BACKEND_URL}/files/raw/${name}`, { responseType: 'arrayBuffer' as 'json' })
  }

  changeStatusToInactive(id: string): Observable<StatusResponse> {
    this.setHeaders();
    const header = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    })
    return this.http.put<StatusResponse>(`${environment.BACKEND_URL}/patients/${id}/deactivate`,
      null,
      {
        headers: header
      })
  }

  changeStatusToActive(id: string): Observable<StatusResponse> {
    this.setHeaders();
    const header = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    })
    return this.http.put<StatusResponse>(`${environment.BACKEND_URL}/patients/${id}/activate`,
      null,
      {
        headers: header
      })
  }
}


