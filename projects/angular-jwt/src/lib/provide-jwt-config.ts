import { HTTP_INTERCEPTORS, HttpRequest } from "@angular/common/http";
import { EnvironmentProviders, makeEnvironmentProviders, Provider } from "@angular/core";
import { JwtInterceptor } from "./jwt.interceptor";
import { JwtHelperService } from "./jwthelper.service";
import { JWT_OPTIONS } from "./jwtoptions.token";

export interface JwtConfig {
  tokenGetter?: (request?: HttpRequest<unknown>) => string | null | Promise<string | null>;
  headerName?: string;
  authScheme?: string | ((request?: HttpRequest<unknown>) => string);
  allowedDomains?: Array<string | RegExp>;
  disallowedRoutes?: Array<string | RegExp>;
  throwNoTokenError?: boolean;
  skipWhenExpired?: boolean;
}

export interface JwtModuleOptions {
  jwtOptionsProvider?: Provider;
  config?: JwtConfig;
}

/**
 * Provides Jwt configuration at the root level:
 * ```ts
 * bootstrapApplication(AppComponent, {
 *   providers: [provideJwtConfig(...)]
 * });
 * ```
 */
export const provideJwtConfig = (config: JwtConfig): EnvironmentProviders =>
  makeEnvironmentProviders([
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: JWT_OPTIONS, useValue: config },
    JwtHelperService,
  ]);
