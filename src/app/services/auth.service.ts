import { Injectable } from '@angular/core';
import { environment } from '../../environments/env';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppointmentCreation, AppointmentUserData, currentUserResponse, ErrorResponse, ImageTpesList, ImageTypeData, InsuranceData, InsuranceList, loginResponse, Logout, Patient, PatientsData, Users, UserWithRole } from '../interfaces';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  token: string | null = null;
  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<loginResponse> {
    const response =  this.http.post<loginResponse>(`${environment.BACKEND_URL}/auth/signin`, {
      email, password
    })    
    return response
  }
  logout(): Observable<Logout> {
    this.setHeaders();
    const header = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    })
    return this.http.post<Logout>(`${environment.BACKEND_URL}/auth/signOut`, {
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

  getUsers(page: number, limit: number): Observable<Users> {
    this.setHeaders();
    const header = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    })
    return this.http.get<Users>(`${environment.BACKEND_URL}/users/search`, {
      headers: header,
      params: {
        page,
        limit
      }
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
  getAppointmentsByDate(page: number, limit: number, date:string): Observable<AppointmentUserData> {
    this.setHeaders()
    const header = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    })
    return this.http.get<AppointmentUserData>(`${environment.BACKEND_URL}/patientAppointments/myAppointments/${date}`, {
      headers: header,
      params: {
        page,
        limit
      }
    }
    )
  }
}


