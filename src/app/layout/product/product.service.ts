import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {  } from 'rxjs';
import { forkJoin } from 'rxjs';
import { map,delay,catchError,tap} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ProductService {



  constructor(private http: HttpClient) { }

 
}