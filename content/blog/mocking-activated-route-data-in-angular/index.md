---
title: Mocking Route params in Angular unit tests
date: '2019-09-29'
---

## Mocking activated route snapshot params

It's common, in Angular, to access route parameters when the component is initialized. This can be done using the `ActivatedRouteSnaphot`:

```typescript:title=book.component.ts
ngOnInit() {
  this.bookId = +this.activatedRoute.snapshot.paramMap.get('bookId'); // highlight-line

  this.getBook(this.bookId);
}
```

Since the `activatedRoute` is accessed inside of `ngOnInit`, we will need to mock the `activatedRoute` in our unit tests. We can provide the `ActivatedRoute` in the testing module but use a different value that we have full control over in its place:

```typescript:title=book.component.spec.ts
beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [
      {
        /* highlight-start */
        provide: ActivatedRoute,
        useValue: {
          snapshot: {
            paramMap: {
              get: () => 1, // represents the bookId
            },
          },
        },
        /* highlight-end */
      },
    ],
    declarations: [BookComponent],
  }).overrideComponent(BookComponent, {
    set: {
      template: '',
    },
  })
})
```

If we only care about one paramater contained in `paramMap`, like in the example above, we can return this parameter directly from the `get` method: `get: () => 1`. If there are multiple parameters we care about we can use a `switch` statement instead:

```typescript
{
  provide: ActivatedRoute,
  useValue: {
    snapshot: {
      paramMap: {
        get: (key: string) => {
          switch (key) {
            case 'bookId':
              return 2;
            case 'genre':
              return 'fiction'
          }
        }
      },
    },
  },
}
```

## With activated route param observables

We might subscribe to the `ActivatedRoute` params instead:

```typescript
ngOnInit() {
  this.activatedRoute.params.subscribe(params => {
    this.bookId = parseInt(params.bookId, 10)

    this.getBookById(this.bookId)
  })
}
```

We are still able to mock the router params but `params` will need to return an observable to allow our `subscription` to work. We can do this by using the RxJs `of` operator:

```typescript
import { of } from 'rxjs';

...
{
  provide: ActivatedRoute,
  useValue: {
    params: of({
      bookId: 2,
    }),
  },
},
```
