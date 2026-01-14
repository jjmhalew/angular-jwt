import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { ExampleHttpService } from './example-http.service';
import { provideJwtConfig } from 'angular-jwt';

export function tokenGetter() {
  return 'TEST_TOKEN';
}

export function tokenGetterWithRequest(request: any) {
  if (request.url.includes('1')) return 'TEST_TOKEN_1';
  if (request.url.includes('2')) return 'TEST_TOKEN_2';
  return 'TEST_TOKEN';
}

export function tokenGetterWithPromise() {
  return Promise.resolve('TEST_TOKEN');
}

describe('Example HttpService: with promise based tokken getter', () => {
  let service: ExampleHttpService;
  let httpMock: HttpTestingController;

  const validRoutes = [
    `/assets/example-resource.json`,
    `http://allowed.com/api/`,
    `http://allowed.com/api/test`,
    `http://allowed.com:443/api/test`,
    `http://allowed-regex.com/api/`,
    `https://allowed-regex.com/api/`,
    `http://localhost:3000`,
    `http://localhost:3000/api`,
  ];

  const invalidRoutes = [
    `http://allowed.com/api/disallowed`,
    `http://allowed.com/api/disallowed-protocol`,
    `http://allowed.com:80/api/disallowed-protocol`,
    `http://allowed.com/api/disallowed-regex`,
    `http://allowed-regex.com/api/disallowed-regex`,
    `http://foo.com/bar`,
    'http://localhost/api',
    'http://localhost:4000/api',
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClientTesting(),
        provideJwtConfig({
          tokenGetter: tokenGetterWithPromise,
          allowedDomains: ['allowed.com', /allowed-regex*/, 'localhost:3000'],
          disallowedRoutes: [
            'http://allowed.com/api/disallowed-protocol',
            '//allowed.com/api/disallowed',
            /disallowed-regex*/,
          ],
        }),
        ExampleHttpService,
      ],
    });

    service = TestBed.inject(ExampleHttpService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should add Authorisation header (service should be created)', () => {
    expect(service).toBeTruthy();
  });

  validRoutes.forEach((route) =>
    it(`should set the correct auth token for an allowed domain: ${route}`, async () => {
      service.testRequest(route).subscribe((response) => {
        expect(response).toBeTruthy();
      });

      const req = httpMock.expectOne(route);

      expect(req.request.headers.has('Authorization')).toBe(true);
      expect(req.request.headers.get('Authorization')).toBe(`Bearer TEST_TOKEN`);

      req.flush({ ok: true });
    })
  );

  invalidRoutes.forEach((route) =>
    it(`should not set the auth token for a disallowed route: ${route}`, async () => {
      service.testRequest(route).subscribe((response) => {
        expect(response).toBeTruthy();
      });

      const req = httpMock.expectOne(route);

      expect(req.request.headers.has('Authorization')).toBe(false);

      req.flush({ ok: true });
    })
  );
});

describe('Example HttpService: with simple tokken getter', () => {
  let service: ExampleHttpService;
  let httpMock: HttpTestingController;

  const validRoutes = [
    `/assets/example-resource.json`,
    `http://allowed.com/api/`,
    `http://allowed.com/api/test`,
    `http://allowed.com:443/api/test`,
    `http://allowed-regex.com/api/`,
    `https://allowed-regex.com/api/`,
    `http://localhost:3000`,
    `http://localhost:3000/api`,
  ];

  const invalidRoutes = [
    `http://allowed.com/api/disallowed`,
    `http://allowed.com/api/disallowed-protocol`,
    `http://allowed.com:80/api/disallowed-protocol`,
    `http://allowed.com/api/disallowed-regex`,
    `http://allowed-regex.com/api/disallowed-regex`,
    `http://foo.com/bar`,
    'http://localhost/api',
    'http://localhost:4000/api',
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClientTesting(),
        provideJwtConfig({
          tokenGetter,
          allowedDomains: ['allowed.com', /allowed-regex*/, 'localhost:3000'],
          disallowedRoutes: [
            'http://allowed.com/api/disallowed-protocol',
            '//allowed.com/api/disallowed',
            /disallowed-regex*/,
          ],
        }),
        ExampleHttpService,
      ],
    });

    service = TestBed.inject(ExampleHttpService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should add Authorisation header (service should be created)', () => {
    expect(service).toBeTruthy();
  });

  validRoutes.forEach((route) =>
    it(`should set the correct auth token for an allowed domain: ${route}`, () => {
      service.testRequest(route).subscribe((response) => {
        expect(response).toBeTruthy();
      });

      const req = httpMock.expectOne(route);

      expect(req.request.headers.has('Authorization')).toBe(true);
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${tokenGetter()}`);

      req.flush({ ok: true });
    })
  );

  invalidRoutes.forEach((route) =>
    it(`should not set the auth token for a disallowed route: ${route}`, () => {
      service.testRequest(route).subscribe((response) => {
        expect(response).toBeTruthy();
      });

      const req = httpMock.expectOne(route);

      expect(req.request.headers.has('Authorization')).toBe(false);

      req.flush({ ok: true });
    })
  );
});

describe('Example HttpService: with request based tokken getter', () => {
  let service: ExampleHttpService;
  let httpMock: HttpTestingController;

  const routes = [
    `http://example-1.com/api/`,
    `http://example-2.com/api/`,
    `http://example-3.com/api/`,
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClientTesting(),
        provideJwtConfig({
          tokenGetter: tokenGetterWithRequest,
          allowedDomains: ['example-1.com', 'example-2.com', 'example-3.com'],
        }),
        ExampleHttpService,
      ],
    });

    service = TestBed.inject(ExampleHttpService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should add Authorisation header (service should be created)', () => {
    expect(service).toBeTruthy();
  });

  routes.forEach((route) =>
    it(`should set the correct auth token for a domain: ${route}`, () => {
      service.testRequest(route).subscribe((response) => {
        expect(response).toBeTruthy();
      });

      const req = httpMock.expectOne(route);

      expect(req.request.headers.has('Authorization')).toBe(true);
      expect(req.request.headers.get('Authorization')).toBe(
        `Bearer ${tokenGetterWithRequest({ url: route })}`
      );

      req.flush({ ok: true });
    })
  );
});

const authSchemes: Array<[undefined | string | (() => string), string]> = [
  [undefined, 'Bearer '],
  ['Basic ', 'Basic '],
  [() => 'Basic ', 'Basic '],
];

authSchemes.forEach(([schemeInput, expectedPrefix]) => {
  describe(
    `Example HttpService: with ${
      typeof schemeInput === 'function'
        ? 'an authscheme getter function'
        : 'a simple authscheme getter'
    }`,
    () => {
      let service: ExampleHttpService;
      let httpMock: HttpTestingController;

      beforeEach(() => {
        TestBed.configureTestingModule({
          providers: [
            provideHttpClientTesting(),
            provideJwtConfig({
              tokenGetter,
              authScheme: schemeInput as any,
              allowedDomains: ['allowed.com'],
            }),
            ExampleHttpService,
          ],
        });

        service = TestBed.inject(ExampleHttpService);
        httpMock = TestBed.inject(HttpTestingController);
      });

      afterEach(() => {
        httpMock.verify();
      });

      it(`should set the correct auth scheme on a request (${expectedPrefix})`, () => {
        service.testRequest('http://allowed.com').subscribe((response) => {
          expect(response).toBeTruthy();
        });

        const req = httpMock.expectOne('http://allowed.com');

        expect(req.request.headers.has('Authorization')).toBe(true);
        expect(req.request.headers.get('Authorization')).toBe(
          `${expectedPrefix}${tokenGetter()}`
        );

        req.flush({ ok: true });
      });
    }
  );
});
