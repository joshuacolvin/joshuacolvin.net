---
title: Building a Pagination Component in Angular
date: '2021-08-30'
---

A pagination component can be used to paginate a list of items. In this article, we will code a pagination component in Angular.

## Requirements

When building any component it's good to have a set requirements. Requirements tell us what functionality a component needs to have and what, if any, constraints we are working with.

For our pagination component the requirements will be:

- Show seven "page" buttons and next/previous buttons
- Show all page buttons if there are seven or less total pages
- Show ... to indicate "more" when all page buttons won't fit
- Show the first five page buttons or last five page buttons when possible
  - 1, 2, 3, 4, 5, ..., 18
  - 1, ..., 14, 15, 16, 17, 18
- Show the current page button plus the previous and next page buttons
  - 1, ..., 5, [6], 7, ..., 18
- State updates should be handled outside of the pagination component
- Allow the user to go to the next page
- Allow the user to go to the previous page
- Allow the user to go to a specific page

## Prerequisites

We will need to have [Node](https://nodejs.org/en/), [npm](https://www.npmjs.com/), and the [Angular CLI](https://angular.io/cli) installed. Follow the installation instructions at the provided links if you need to install any of these.

## Source Code

The completed source code for this tutorial can be found [here](https://github.com/joshuacolvin/angular-pagination).

## Project Setup

We will use the Angular CLI to create our project. From a terminal run the following command:

```shell
ng new angular-pagination
```

This will create a new directory named `angular-pagination` which we need to navigate into:

```shell
cd angular-pagination
```

The Angular CLI can also be used to generate modules and components.

First, we will generate a module for our pagination component:

```shell
ng generate module pagination
```

This command will create a pagination module at `src/app/pagination/pagination.module.ts`.

Now we can generate our pagination component:

```shell
ng generate component pagination
```

This command will create a pagination component at `src/app/pagination/pagination.component.ts`.

We declare and export the `PaginationComponent` from the `PaginationModule`.

```typescript:title=src/app/pagination/pagination.module.ts
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
/* highlight-start */
import { PaginationComponent } from './pagination.component'
/* highlight-end */

@NgModule({
  /* highlight-start */
  declarations: [PaginationComponent],
  exports: [PaginationComponent],
  /* highlight-end */
  imports: [CommonModule],
})
export class PaginationModule {}
```

## Building the Pagination Component

Now that we have our project and component files generated it's time to build the pagination component.

Looking at our list of requirements again there are two things that stand out:

- State updates should be handled **_outside_** of the pagination component
- Show all page buttons if there are seven or less **_total pages_**

These two requirements tell me that we will need to pass data into our pagination component and emit events out.

We will need two pieces of data: the total number of pages, and the current page.

Let's add `Input`s to our component for `current` and `total` and initialize both to `0`.

```typescript:title=src/app/pagination/pagination.component.ts
export class PaginationComponent {
  /* highlight-start */
  @Input() current: number = 0
  @Input() total: number = 0
  /* highlight-end */
}
```

Now we will need to handle any events that are triggered by our pagination component using `Output`s but first we need to determine what events we need to handle.

Looking at our requirements again, the last three stand out:

- Allow the user to go to the next page
- Allow the user to go to the previous page
- Allow the user to go to a specific page

Let's add `Output`s for these events that emit the current page number.

```typescript:title=src/app/pagination/pagination.component.ts
export class PaginationComponent {
  @Input() current: number = 0
  @Input() total: number = 0

  /* highlight-start */
  @Output() goTo: EventEmitter<number> = new EventEmitter<number>()
  @Output() next: EventEmitter<number> = new EventEmitter<number>()
  @Output() previous: EventEmitter<number> = new EventEmitter<number>()
  /* highlight-end */
}
```

We will also need methods that tell our event emitters to emit. These methods will be called when the user interacts with the pagination component. Add a method for each event emitter:

```typescript:title=src/app/pagination/pagination.component.ts
export class PaginationComponent {
  // ...

  @Output() goTo: EventEmitter<number> = new EventEmitter<number>()
  @Output() next: EventEmitter<number> = new EventEmitter<number>()
  @Output() previous: EventEmitter<number> = new EventEmitter<number>()

  /* highlight-start */
  public onGoTo(page: number): void {
    this.goTo.emit(page)
  }

  public onNext(): void {
    this.next.emit(this.current)
  }

  public onPrevious(): void {
    this.previous.next(this.current)
  }
  /* highlight-end */
}
```

We will also need a property that knows what pages should be displayed. We can use an array of page numbers for this.

```typescript:title=src/app/pagination/pagination.component.ts
export class PaginationComponent {
  // ...

  @Output() previous: EventEmitter<number> = new EventEmitter<number>()

  /* highlight-start */
  public pages: number[] = []
  /* highlight-end */

  public onGoTo(page: number): void {
    this.goTo.emit(page)
  }

  // ...
}
```

Now that we have a property to hold our pages we need a method that will determine which pages should be shown. We will use this method to set the value for our `pages` array. This method will take the `current` page and `total` pages as arguments.

Since we haven't written any logic to determine what pages to show yet let's return an array of the numbers 1 - 7 for now.

```typescript:title=src/app/pagination/pagination.component.ts
export class PaginationComponent {
  // ...

  public pages: number[] = []

  // ...

  /* highlight-start */
  private getPages(current: number, total: number): number[] {
    return [...Array(7).keys()].map(x => ++x)
  }
  /* highlight-end */
}
```

Inside of `getPages` we create a new Array with a length of 7 and call the [`keys`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/keys) method which gives us an iterator containing the key for each index in the array (0, 1, 2, etc.). Since `keys` returns an iterator we have to [`spread`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) the value to get the value of the keys. Lastly, we map over the array and add 1 to each value since our pages need to start at 1 and not 0.

Finally we need to call the `getPages` method any time the `current` page or `total` pages values change. We can use `ngOnChanges` for this.

```typescript:title=src/app/pagination/pagination.component.ts
import {
  Component,
  EventEmitter,
  Input,
  /* highlight-start */
  OnChanges,
  /* highlight-end */
  Output,
  SimpleChanges,
} from '@angular/core'

// ...

/* highlight-start */
export class PaginationComponent implements OnChanges {
  /* highlight-end */

  // ...

  public pages: number[] = []

  /* highlight-start */
  ngOnChanges(changes: SimpleChanges): void {
    if (
      (changes.current && changes.current.currentValue) ||
      (changes.total && changes.total.currentValue)
    ) {
      this.pages = this.getPages(this.current, this.total)
    }
  }
  /* highlight-end*/

  // ...

  private getPages(current: number, total: number): number[] {
    return [...Array(7).keys()].map(x => ++x)
  }
}
```

## Pagination Component Markup

Let's write the HTML and CSS before finishing the `getPages` logic.

For the HTML we will start with a `nav` element with the `aria-label` "pagination" and a empty `ul`.

```html:title=src/app/pagination/pagination.component.html
<nav aria-label="pagination">
  <ul></ul>
</nav>
```

Next we'll add the "Previous" and "Next" buttons.

The "Previous" button should be disabled when the `current` page is 1 and should call the `onPrevious` method when clicked if not disabled. We will also add an `aria-label` of "Go To Previous Page".

```html:title=src/app/pagination/pagination.component.html
<nav aria-label="pagination">
  <ul>
    <!-- highlight-start -->
    <li>
      <button
        aria-label="Go To Previous Page"
        [attr.aria-disabled]="current === 1"
        [disabled]="current === 1"
        (click)="onPrevious()"
      >
        Previous
      </button>
    </li>
    <!-- highlight-end -->
  </ul>
</nav>
```

The "Next" button should be disabled when the `current` pages is equal to the `total` number of pages and should call the `onNext` method when clicked if not disabled. We will also add an `aria-label` of "Go To Next Page".

```html:title=src/app/pagination/pagination.component.html
<nav aria-label="pagination">
  <ul>
    <li>
      <button
        aria-label="Go To Previous Page"
        [attr.aria-disabled]="current === 1"
        [disabled]="current === 1"
        (click)="onPrevious()"
      >
        Previous
      </button>
    </li>
    <!-- highlight-start -->
    <li>
      <button
        aria-label="Go To Next Page"
        [attr.aria-disabled]="current === total"
        [disabled]="current === total"
        (click)="onNext()"
      >
        Next
      </button>
    </li>
    <!-- highlight-end -->
  </ul>
</nav>
```

Now that we have our buttons, the last thing we need to do in our HTML is add the page buttons. We can do this by looping over our `pages` array using an `ngFor`. When a page button is clicked, we should call the `onGoTo` method, passing the `page` value.

We should add a few things to our page buttons to make them more accessible. First, we should add the `aria-current` attribute if the page is the `current` page and add a descriptive `aria-label`. Next, we should add a `tabindex` so the page buttons are accessible via keyboard. Last, we should call the `onGoTo` method when the "Enter" key is pressed.

```html:title=src/app/pagination/pagination.component.html
<nav aria-label="pagination">
  <ul>
    <li>
      <button
        aria-label="Go To Previous Page"
        [attr.aria-disabled]="current === 1"
        [disabled]="current === 1"
        (click)="onPrevious()"
      >
        Previous
      </button>
    </li>
    <!-- highlight-start -->
    <li *ngFor="let page of pages;">
      <a
        [attr.aria-current]="page === current ? 'page' : null"
        [attr.aria-label]="
          page === current ? 'Current Page, Page ' + page : 'Go to Page ' + page
        "
        [class.current]="page === current"
        tabindex="0"
        (click)="onGoTo(page)"
        (keyup.enter)="onGoTo(page)"
        >{{ page }}</a
      >
    </li>
    <!-- highlight-end -->
    <li>
      <button
        aria-label="Go To Next Page"
        [attr.aria-disabled]="current === total"
        [disabled]="current === total"
        (click)="onNext()"
      >
        Next
      </button>
    </li>
  </ul>
</nav>
```

## Styling the Pagination Component

Our pagination component needs some styles. We won't go over any of the code but here is some CSS that can be applied.

```css:title=src/app/pagination/pagination.component.css
nav {
  display: flex;
  align-items: center;
}

ul {
  display: flex;
  justify-content: flex-end;
  list-style: none;
  margin: 0;
  padding: 0;
}

li {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  user-select: none;
  margin: 0 4px;
}

a {
  display: grid;
  justify-items: center;
  align-items: center;
  width: 100%;
  cursor: pointer;
  width: 38px;
  line-height: 38px;
  border-radius: 4px;
  text-align: center;
  font-size: 18px;
}

a.current,
a:not(.more):hover {
  background-color: #007acc;
  color: #fff;
  font-weight: 700;
}

a.more:hover,
a.current {
  cursor: default;
  text-decoration: none;
}

button {
  background-color: #e9ecef;
  border: none;
  cursor: pointer;
  display: grid;
  place-items: center;
  font-size: 18px;
  border-radius: 4px;
  color: #007acc;
  padding: 8px 16px;
}

button[disabled] {
  cursor: default;
  color: #212529;
}

button:not([disabled]):hover {
  background-color: #007acc;
  color: #fff;
  cursor: pointer;
  outline: none;
}
```

## Finishing the `getPages` Logic

Right now our `getPages` method returns a hardcoded `array` of pages. The last thing we need to do is write the logic that will determine which page options to show.

First, let's update the `getPages` method to only return pages 1 - 7 if total `total` pages is 7 or less. Remember, 7 is the maximum number of page buttons we will display at one time.

We will update the returned array to have a length equal to `total` instead of hard-coding the value 7.

```typescript:title=src/app/pagination/pagination.component.ts
export class PaginationComponent {
  //...

  private getPages(current: number, total: number): number[] {
    /* highlight-start */
    if (total <= 7) {
      return [...Array(total).keys()].map(x => ++x)
    }
    /* highlight-end */
  }
}
```

What if there are more than 7 `total` pages?

In this case, we should give the user the options 1 - 5, the "more" indicator (...), and the last page. We will make this our default `return` value and will use `-1` to denote the "more" indicator.

```typescript:title=src/app/pagination/pagination.component.ts
export class PaginationComponent {
  //...

  private getPages(current: number, total: number): number[] {
    if (total <= 7) {
      return [...Array(total).keys()].map(x => ++x)
    }
    /* highlight-start */
    return [1, 2, 3, 4, 5, -1, total]
    /* highlight-end */
  }
}
```

The default array returned by `getPages` will cover all scenarios where the `current` page is between 1 and 5. If the `current` page is greater than 5 we want to show the first page (1), a "more" indicator, the page before the `current` page, the `current` page, the page after the `current` page, another "more" indicator, and finally, the `total` page number.

For example, if the `current` page is 8 and the `total` number of pages is 18 the array should contain: `[1, -1, 7, 8, 9, -1, 18]`

```typescript:title=src/app/pagination/pagination.component.ts
export class PaginationComponent {
  //...

  private getPages(current: number, total: number): number[] {
    if (total <= 7) {
      return [...Array(total).keys()].map(x => ++x)
    }

    /* highlight-start */
    if (current > 5) {
      return [1, -1, current - 1, current, current + 1, -1, total]
    }
    /* highlight-end */

    return [1, 2, 3, 4, 5, -1, total]
  }
}
```

The last scenario we need to handle is when our `current` page is within 4 of our `total` pages. This means that we can show the last 5 numbers (including the `total`).

We will add another condition inside of our "is `current` greater than 5" check. This new conditional will check if the `current` page is greater than or equal to the `total` pages - 4 (We don't have to worry about the `current` page exceeding our `total` pages since the "Next" button becomes disabled when on the last page). The array we created in the previous step will move to the `else` clause of this conditional.

```typescript:title=src/app/pagination/pagination.component.ts
export class PaginationComponent {
  //...

  private getPages(current: number, total: number): number[] {
    if (total <= 7) {
      return [...Array(total).keys()].map(x => ++x)
    }

    if (current > 5) {
      /* highlight-start */
      if (current >= total - 4) {
        return [1, -1, total - 4, total - 3, total - 2, total - 1, total]
      } else {
        return [1, -1, current - 1, current, current + 1, -1, total]
      }
      /* highlight-end */
    }

    return [1, 2, 3, 4, 5, -1, total]
  }
}
```

## Using the Pagination Component

We finally have a functioning pagination component. The last step is to use it!

We will start by importing the `PaginationModule` into our `AppModule`.

```typescript:title=src/app/app.module.ts
import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { AppComponent } from './app.component'
/* highlight-start */
import { PaginationComponent } from './pagination/pagination.component'
/* highlight-end */

@NgModule({
  /* highlight-start */
  declarations: [AppComponent, PaginationComponent],
  /* highlight-end */
  imports: [BrowserModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

In our `AppComponent`, we need to add properties for `current` and `total`.

```typescript:title=src/app/app.component.ts
import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  /* highlight-start */
  public current: number = 1;
  pubic total: number = 18;
  /* highlight-end */
}
```

We also need to add a method for each `EventEmitter` in the `PaginationComponent`.

When the `goTo` `EventEmitter` emits a value the emitted value will be the number associated with a clicked page button. It should take the user to the selected page. We can accomplish this by setting `current` to the emitted value.

```typescript:title=src/app/app.component.ts
export class AppComponent {
  // ...

  /* highlight-start */
  public onGoTo(page: number): void {
    this.current = page
  }
  /* highlight-end */
}
```

When the `next` `EventEmitter` emits a value `current` should be set to the page after the emitted page number.

```typescript:title=src/app/app.component.ts
export class AppComponent {
  // ...

  /* highlight-start */
  public onNext(page: number): void {
    this.current = page + 1
  }
  /* highlight-end */
}
```

When the `previous` `EventEmitter` emits a value `current` should be set to the page before the emitted page number.

```typescript:title=src/app/app.component.ts
export class AppComponent {
  // ...

  /* highlight-start */
  public onPrevious(page: number): void {
    this.current = page - 1
  }
  /* highlight-end */
}
```

We also need to use the `PaginationComponent` in our template. We will pass in the `current` and `total` values and wire up our `onPrevious`, `onNext` and `onGoTo` methods to be called when the `previous`, `next`, or `goTo` `EventEmitter` emit a value. We can get access to these emitted values using the `$event` parameter.

```html:title=src/app/app.component.html
<app-pagination
  [current]="current"
  [total]="total"
  (goTo)="onGoTo($event)"
  (next)="onNext($event)"
  (previous)="onPrevious($event)"
></app-pagination>
```

We have a pagination component that will reflect the state determined by user interaction but we're not actually paginating any results.

Lets add an array of data that we can paginate through. We will also add a `itemsToDisplay` property that will hold our paginated data.

```typescript:title=src/app/app.component.ts
export class AppComponent {
  // ...

  /* highlight-start */
  public items = [...Array(180).keys()].map(x => `item ${++x}`)
  public itemsToDisplay: string[] = []
  /* highlight-end */

  // ...
}
```

This will create an array with a length of 180 containing the `string`s "item 1", "item 2", and so on.

Next, we need to determine how many items we want to show per page. Let's add a `perPage` property and set its value to 10. We will also need to update our `total` to be dynamic based on the number of items and the number of items we want to show per page.

```typescript:title=src/app/app.component.ts
export class AppComponent {
  // ...

  public items = [...Array(180).keys()].map(x => `item ${++x}`)
  public itemsToDisplay: string[] = []
  /* highlight-start */
  public perPage = 10
  public total = Math.ceil(this.items.length / this.perPage)
  /* highlight-end */

  // ...
}
```

Over in our `app.component.html` we can display our list of items using a `ngFor`.

```html:title=src/app/app.component.html
<ul>
  <li *ngFor="let item of items">{{ item }}</li>
</ul>
```

This will display all items for now. Let's add the logic to only display the items for the current page.

We will add a new method called `paginate` that takes the `current` page and the `perPage` amount and returns an array containing the data to display for a given page.

We will start by using the `slice` method to remove all items before the first item of our `current` page. Then we call the `slice` method again taking the first item up to our `perPage`value.

```typescript:title=src/app/app.component.ts
export class AppComponent {
  // ...

  /* highlight-start */
  public paginate(current: number, perPage: number): string[] {
    return [...this.items.slice((current - 1) * perPage).slice(0, perPage)]
  }
  /* highlight-end */
}
```

Any time our `current` value changes, we need to call the `paginate` method and populate the `itemsToDisplay` array with our paginated data.

```typescript:title=src/app/app.component.ts
export class AppComponent {
  // ...
  public itemsToDisplay: string[] = []
  public onGoTo(page: number): void {
    this.current = page
    /* highlight-start */
    this.itemsToDisplay = this.paginate(this.current, this.perPage)
    /* highlight-end */
  }

  public onNext(page: number): void {
    this.current = page + 1
    /* highlight-start */
    this.itemsToDisplay = this.paginate(this.current, this.perPage)
    /* highlight-end */
  }

  public onPrevious(page: number): void {
    this.current = page - 1
    /* highlight-start */
    this.itemsToDisplay = this.paginate(this.current, this.perPage)
    /* highlight-end */
  }

  public paginate(current: number, perPage: number): string[] {
    return [...this.items.slice((current - 1) * perPage).slice(0, perPage)]
  }
}
```

In our template, we need to display `itemsToDisplay` instead of `items`.

```html:title=src/app/app.component.html
<ul>
  <li *ngFor="let item of itemsToDisplay">{{ item }}</li>
</ul>
```

When the page loads, we are not showing any items. This is because the `itemsToDisplay` array is empty. If we click a button in the pagination component the correct items will display.

We can fix this by setting the `itemsToDisplay` array on page load using `OnInit`.

```typescript:title=src/app/app.component.ts
/* highlight-start */
import { Component, OnInit } from '@angular/core'
/* highlight-end */

// ...

/* highlight-start */
export class AppComponent implements OnInit {
  /* highlight-end */
  // ...
  public itemsToDisplay: string[] = []

  /* highlight-start */
  ngOnInit(): void {
    this.itemsToDisplay = this.paginate(this.current, this.perPage)
  }
  /* highlight-end */

  public paginate(current: number, perPage: number): string[] {
    return [...this.items.slice((current - 1) * perPage).slice(0, perPage)]
  }
}
```

Now our items display correctly on page load and when the pagination component buttons are clicked.

## Wrapping up

Now that we have a functioning pagination component I challenge you to make some improvements. Here are a few things you could try:

1. Instead of limiting the displayed page options to 7, make this number dynamic and allow the consumer of the pagination component to pass it in.

2. Write unit tests for the pagination component to make sure there are no edge cases we haven't considered.

3. Create an [Angular library](https://angular.io/guide/creating-libraries) and move the pagination component there. [Publish](https://docs.npmjs.com/cli/v7/commands/npm-publish) the package to NPM and install and use it in a project.
