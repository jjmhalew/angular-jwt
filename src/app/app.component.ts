import { AsyncPipe, JsonPipe } from "@angular/common";
import { Component, inject } from "@angular/core";
import { ExampleHttpService } from "./services/example-http.service";

@Component({
  selector: "app-root",
  template: `<pre> {{ res$ | async | json }} </pre>`,
  imports: [AsyncPipe, JsonPipe],
})
export class AppComponent {
  private exampleHttpService = inject(ExampleHttpService);
  protected res$ = this.exampleHttpService.testRequest();
}
