import { Injectable } from '@angular/core';
import { environment } from '../../environments/env';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  token:string | null = null;
  constructor(private http:HttpClient) { }

  login(email:string, password:string):Observable<loginResponse>{
    return this.http.post<loginResponse>(`${environment.BACKEND_URL}/auth/signin`, {
      email, password
    })
    
  }

  getCurrentUser():Observable<currentUserResponse>{
    this.setHeaders();
    const header = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    })
    return this.http.get<currentUserResponse>(`${environment.BACKEND_URL}/users/register`,{
      headers: header
    })
  }
  setHeaders(){
     this.token = localStorage.getItem('token');
  }
}
interface loginResponse {
  data: {
    token: {
      accessToken: string
      tokenType: string
      refreshToken: any
    }
  }
  message: string
  status: string
  error: any
  timestamp: string
}

export interface currentUserResponse {
  data: {
    createdAt: string
    updatedAt: string
    id: string
    firstName: string
    lastName: string
    fullName: string
    phoneNumber: string
    email: string
    role: string
    status: string
    loginStatus: string
    lastLogin: string
  }
  message: string
  status: string
  error: {}
  timestamp: string
}

