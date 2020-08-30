---
title: Subscribing to route params and route data in Angular
date: '2020-08-30'
---

There are times when you need to subscribe to both `ActivatedRoute` params and data in a component. In this article, I will show you how I accomplished this and how this helps avoid an Angular/RxJS anti-pattern.

Let's say you have this route and you need the books `id` which is a route param and the authenticated users `id` which we get using a resolver.

```typescript:title=book-routing.module.ts
{
    path: 'book/:id',
    component: BookDetailComponent,
    resolve: { uid: AuthResolver },
},
```

In the BookDetailComponent we need both of these values in order to get details about a book.

## Anti-Pattern to Avoid

One anti-pattern that I see often is to have nested subscribes, subscribing to one observable inside of another.

```typescript:title=book-detail.component.ts
export class BookDetailComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.route.data.subscribe(data => {
        this.getBook(params.id, data.uid)
      })
    })
  }
}
```

This may seem like a fine solution but it makes the code harder to reason about and maintain. What we really want to do is combine the two observables and have only one subscription.

## Combining multiple observables with CombineLatest

We can use the [combineLatest](https://rxjs-dev.firebaseapp.com/api/index/function/combineLatest) operator from RxJS to combine multiple observables.

> Combines multiple Observables to create an Observable whose values are calculated from the latest values of each of its input Observables.

```typescript:title=book-detail.component.ts
import { combineLatest } from 'rxjs';

export class BookDetailComponent implements OnInit {
  constructor(
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    combineLatest(
      this.route.params,
      this.route.data,
      (params: Params, data: Data) => ({
        params,
        data,
      })
    ).subscribe((res: { params: Params; data: Data }) => {
      const { params, data} = res;

      this.getBook(params.id, data.uid);
    });
  }
```

`combineLatest` will return an array containing the value of each observable. We can pass an optional projection function to change the shape of the data returned. In this case we want an object instead of an array.

## Conclusion

RxJS provides many other [combination operators](https://www.learnrxjs.io/learn-rxjs/operators/combination) besides `CombineLatest`. Depending on your use case you might want to use one of these other operators.
