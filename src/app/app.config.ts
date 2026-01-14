import { provideHttpClient, withFetch, withInterceptorsFromDi } from "@angular/common/http";
import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners } from "@angular/core";
import { JWT_OPTIONS, JwtModule } from "angular-jwt";

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
    importProvidersFrom([
        JwtModule.forRoot({
          jwtOptionsProvider: {
            provide: JWT_OPTIONS,
            useFactory: jwtOptionsFactory,
          },
        }),
    ])
  ],
};