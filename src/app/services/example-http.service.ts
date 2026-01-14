import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ExampleHttpService {
  private http = inject(HttpClient);

  public testRequest(route = '/assets/example-resource.json') {
    return this.http.get(route);
  }
}
