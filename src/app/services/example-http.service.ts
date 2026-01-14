import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ExampleHttpService {
  private http = inject(HttpClient);

  public testRequest(route = "/assets/example-resource.json"): Observable<Object> {
    return this.http.get(route);
  }
}
