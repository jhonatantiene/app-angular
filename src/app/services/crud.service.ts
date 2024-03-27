import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class CrudService {
  constructor(private http: HttpClient) {}
  private url = 'http://localhost:3000/';

  processFileCsv(file: FormData) {
    return this.http.post<Array<{year: string, monthlyMetrics: any[]}>>(this.url + 'fileCSV', file);
  }
}


