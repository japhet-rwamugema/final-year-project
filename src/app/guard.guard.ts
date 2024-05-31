import { inject, Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

export const AuthGuard = () => {
    const token = localStorage.getItem('token');

   return token ? true : inject(Router).navigate(['/']);
}