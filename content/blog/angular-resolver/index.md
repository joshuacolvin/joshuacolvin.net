---
title: Creating a Route Resolver in Angular
date: '2019-01-29'
tags: ['angular']
---

Angular Resolvers allow us to get data before the user is navigated to a route. If we have a `products` route that displays a list of products there is no point in navigating the user to that page until the product data is available. By using a Resolver we can pre-fetch the data so it is availbe when the user hits the page.

## Creating a resolver

We create a resolver by creating a class that implements the `Resolve` interface which looks like this:

```typescript:title=Resolve Interface
interface Resolve<T> {
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<T> | Promise<T> | T
}
```

In order to correctly implement the `Resolve` interface our class must have a `resolve` method that returns either an `Observable` or a `Promise` of some type. Here we will us the `any` type for simplicity.

```typescript:title=src/app/products/products.resolver.ts
import { Injectable } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router'
import { Observable } from 'rxjs'

export class ProductsResolver implements Resolve<Observable<any>> {
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {}
}
```

The `resolve` method has two parameters: `route`, of type [ActivatedRouteSnapshot](https://angular.io/api/router/ActivatedRouteSnapshot), which gives you access to information about the route such as the `url` or any `params` or `queryParams` associated with the route and `state`, of type [RouterStateSnapshot](https://angular.io/api/router/RouterStateSnapshot), which represents the state of the router.

We can create a service that will fetch an array of products from an API:

```typescript:title=src/app/products/products.service.ts
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(private http: HttpClient) {}

  public getProducts(): Observable<any> {
    return this.http.get('/api/products')
  }
}
```

And use that service in our Resolver:

```typescript:title=src/app/products/products.resolver.ts
import { ProductsService } from './products.service'

@Injectable()
export class ProductsResolver implements Resolve<Observable<any>> {
  constructor(private productsService: ProductsService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    return this.productsService.getProducts() // highlight-line
  }
}
```

## Using a Resolver

In order to use a resolver we must provide it in the module it will be used in:

```typescript:title=src/app/app.module.ts
import { ProductsResolver } from './products/products.resolver';

@NgModule({
  declarations: [AppComponent, ProductsComponent, HomeComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule],
  providers: [ProductsService, ProductsResolver], // highlight-line
  bootstrap: [AppComponent]
})
```

Now we need to tell the route that we want to resolve the data for the `products` route using our `ProductsResolver`:

```typescript:title=src/app/app-routing.module.ts
const routes: Routes = [
  {
    path: 'products',
    component: ProductsComponent,
    /* highlight-start */
    resolve: {
      products: ProductsResolver,
    },
    /* highlight-end */
  },
]
```

We do this by adding a `resolve` property to our route declaration. `resolve` takes a key/value pair where the key is the variable the data should be saved to, in this case `products`, and the value is our `ProductsResolver`.

The last thing we need to do is use our resolved data in our component. We can access the data by subscribing to the [ActivatedRoute](https://angular.io/api/router/ActivatedRoute) `data` observable:

```typescript:title=src/app/products/products.component.ts
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}

  products: any

  ngOnInit() {
    /* highlight-start */
    this.route.data.subscribe(data => {
      this.products = data.products
    })
    /* highlight-end */
  }
}
```

And finally, render the list of products:

```html:title=src/app/products/products.component.html
<div *ngFor="let product of products" class="card">
  <div class="card-body">
    <h5 class="card-title">
      {{ product.name }}
      <span class="text-muted">{{ product.price | currency }}</span>
    </h5>
    <p class="card-text">{{ product.description }}</p>
    <button class="btn btn-primary">Add to Cart</button>
  </div>
</div>
```

You can find a working example of this resolver [here](https://github.com/joshuacolvin/angular-resolver-example).
