import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class CrudService {
  constructor(private http: HttpClient) {}
  private url = 'http://localhost:3000/';

  processFileCsv(file: any): Observable<object> {
    return this.http.post(this.url + 'fileCSV', file);
  }
}
