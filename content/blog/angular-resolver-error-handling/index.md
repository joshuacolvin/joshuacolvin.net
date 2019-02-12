---
title: Handling Errors in Angular Resolvers
date: '2019-02-12'
---

In a [previous post](https://joshuacolvin.net/angular-resolver), we looked at creating a Resolver. The resolver will route the user if the data "resolves" but not if an error occurs and the data is not available. This is perfectly fine for some use cases but what if you want the error to be handled by the component that's associated with the route the user requested?

I recently ran into this exact scenario. The API returned a `409 Conflict` if some upstream event hadn't occurred yet. This error needed to be handled in the component so that we could display a message to the user letting them know what was wrong. Any errors that were not a `409` should be thrown and handled elsewhere.

## Passing Errors through a resolver

If we have the following resolver, we can catch any errors that occur using the RxJs [catchError](https://rxjs.dev/api/operators/catchError) operator:

```typescript:title=src/app/products/products.resolver.ts
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { ProductsService } from './products.service'

@Injectable()
export class ProductsResolver implements Resolve<Observable<any>> {
  constructor(private productsService: ProductsService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    return this.productsService.getProducts().pipe(
      map(res => res),
      /* highlight-start */
      catchError(error => {
        // do something with the error
      })
      /* highlight-end */
    )
  }
}
```

If we want to pass through any `409` errors to the component we can check the error `status`:

```typescript:title=src/app/products/products.resolver.ts
import { of } from 'rxjs'

...

catchError(error => {
  if (error.status === 409) {
    return of({ error: error })
  }
})
```

We use the RxJS function [of](https://rxjs.dev/api/index/function/of) which converts our error object to an observable.

We can now handle the error in our component but it's no longer an error, it is a property of the [ActivatedRoute](https://angular.io/api/router/ActivatedRoute) data:

```typescript:title=src/app/products/products.component.ts
...

displayError: boolean = false;
errorMessage: string;

ngOnInit() {
    this.route.data.subscribe(data => {
        /* highlight-start */
        if (data.error) {
            displayError = true;
            errorMessage = data.error.message;
            /* highlight-end */
        } else {
            this.products = data.products;
        }
    });
  }
```

If we have other types of errors that we don't want to pass to the component we can throw those errors in the resolver using the [throwError](https://rxjs.dev/api/index/function/throwError) function from RxJS:

```typescript:title=src/app/products/products.resolver.ts
import { of, throwError } from 'rxjs'

...

catchError(error => {
  if (error.status === 409) {
    return of({ error: error })
  } else {
      throwError(error) // highlight-line
  }
})

```
