import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { CookieService } from "ngx-cookie-service";

import { throwError } from 'rxjs';


@Injectable()
export class ApiService {
   // public endpoint = "http://54.254.226.187/server/api";
   // public imgBasePath = "http://54.254.226.187/server/public/images/Racetracks";
    public endpoint = "http://54.169.73.89/server/api";
    public imgBasePath = "http://54.169.73.89/server/public/images/Racetracks";

    public httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    };

    constructor(private http: HttpClient, private cookieService: CookieService) { }

    private extractData(res: Response) {
        let body = res;
        return body || {};
    }

    get(url): Promise<any> {
        return this.http.get(this.endpoint + url, this.getHeaders()).toPromise()
    }
    post(url, body): Promise<any> {
        return this.http.post<any>(this.endpoint + url, body, this.getHeaders()).pipe(
            map(this.extractData),
            catchError(this.handleError)
        ).toPromise()
    }
    put(url, body): Observable<any> {
        return this.http.put(this.endpoint + url, body, this.getHeaders()).pipe(
            map(this.extractData));
    }
    handleError(error) {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
            // client-side error
            errorMessage = `Error: ${error.error.message}`;
        } else {
            // server-side error
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        return throwError(error.error);
    }
    delete(url): Observable<any> {
        return this.http.delete<any>(this.endpoint + url, this.getHeaders()).pipe(
            map(this.extractData));
    }

    getHeaders() {
        if (this.cookieService.check('login')) {
            const userData = JSON.parse(this.cookieService.get("login"))            
            this.httpOptions = {
                headers: new HttpHeaders({
                    'Authorization': userData.token_type + ' ' + userData.access_token,
                })
            };
        }
        return this.httpOptions
    }
}