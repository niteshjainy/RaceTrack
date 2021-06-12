import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private _url = "base_url";

  private data: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  currentData = this.data.asObservable();
  public autocompleteService: any;

  constructor(private http: HttpClient) {

    let headers = new HttpHeaders();
  }
  CurrrentLoggedinUser() {
    return JSON.parse(localStorage.getItem('users'));
  }
  headerCommon() {
    return {
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
    };
  }

  logincheck(data): Observable<any> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    this.headerCommon();
    return this.http.post(this._url + '/login', data, this.headerCommon()).pipe(map((response: Response) => {
      return response;
    })
    )
  }
  agentregister(data): Observable<any> {
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    this.headerCommon();
    return this.http.post(this._url + 'agent-register', data, this.headerCommon(

    )).pipe(map((response: Response) => {
      return response;
    })
    )
  }

}
