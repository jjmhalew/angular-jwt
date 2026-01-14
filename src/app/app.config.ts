import { provideHttpClient, withFetch, withInterceptorsFromDi } from "@angular/common/http";
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from "@angular/core";
import { provideJwtConfig } from "angular-jwt";

export function tokenGetter(): string {
  return 'SOME_TOKEN';
}

export function getAuthScheme(request: any): string {
  return 'Bearer ';
}

export function jwtOptionsFactory() {
  return {
    tokenGetter,
    authScheme: getAuthScheme,
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
    provideJwtConfig({
      tokenGetter,
      authScheme: getAuthScheme,
    }),
  ],
};