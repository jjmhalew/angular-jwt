import { EnvironmentProviders, makeEnvironmentProviders, Provider } from "@angular/core";
import { JWT_OPTIONS } from "./jwtoptions.token";
import { HTTP_INTERCEPTORS, HttpRequest } from "@angular/common/http";
import { JwtHelperService } from "./jwthelper.service";
import { JwtInterceptor } from "./jwt.interceptor";

export interface JwtConfig {
  tokenGetter?: (
    request?: HttpRequest<any>
  ) => string | null | Promise<string | null>;
  headerName?: string;
  authScheme?: string | ((request?: HttpRequest<any>) => string);
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