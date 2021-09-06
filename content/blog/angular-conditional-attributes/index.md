---
title: Conditionally adding attributes in Angular
date: '2021-09-06'
---

There are often times in Angular when you want to add an HTML attribute to an element but only if some condition is `true`.

## Anti-pattern approach

One common implementation I often see is this:

```html
<li *ngFor="let page of pages;">
  <a [attr.aria-current]="page === current">{{page}}</a>
</li>
```

`current` in this case is a public property: `public current: number = 1;`.

The problem with this approach is that the `aria-current` attribute will always be added to the element with the value of `page === current`, either `true` or `false`.

Another common implementation is to use a ternary with the default case being an empty string `''`.

```html
<li *ngFor="let page of pages;">
  <a [attr.aria-current]="page === current ? 'page' : ''">{{page}}</a>
</li>
```

When `page === current` is `true` it correctly adds `aria-current="page"`. However, when `page === current` is false, it still adds the `aria-current` attribute just without a value.

## Solution

What we really want is for the attribute to be added if our condition is true. Otherwise, don't add it at all.

We can accomplish this use `null` for our `false` case instead of an empty string. `null` tells Angular to remove the attribute completely.

```html
<li *ngFor="let page of pages;">
  <a [attr.aria-current]="page === current ? 'page' : null">{{page}}</a>
</li>
```
