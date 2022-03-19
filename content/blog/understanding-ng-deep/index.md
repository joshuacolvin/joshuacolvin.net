---
title: 'Understanding Angular ::ng-deep'
date: 2022-03-19
tags: ['angular', 'css']
---

The `::ng-deep` CSS selector is often used in an Angular Component's CSS to override the styles of a third-party component or a child component's styles. Without understanding exactly how `::ng-deep` works, it is far too easy to write overriding CSS that has unintended consequences.

## What is `::ng-deep`?

Before trying to understand `::ng-deep` it is important to understand the basics of Angular [View encapsulation](https://angular.io/guide/view-encapsulation).

View encapsulation is the Angular mechanism for defining what elements a component’s styles should apply to.

The two `ViewEncapsulation` values you will likely encounter are `Emulated` and `None`.

- `ViewEncapsulation.Emulated` means the styles defined in this component will only apply to the component's HTML. **This is the default value**.
- `ViewEncapsulation.None` means the styles will be applied globally.

_See the Angular [view encapsulation documentation](<[https://angular.io/guide/view-encapsulation](https://angular.io/guide/view-encapsulation)>) for more details_.

What is often overlooked is that when using `ViewEncapsulation.Emulated` the styles do not apply to any child components used in your component's template.

In the following example, if we want to override the styles of `my-button` from the `profile` component targeting the `my-button` element will have no effect.

```html:title=profile.component.html
<div class="container">
  <my-button></my-button>
</div>
```

```css:title=profile.component.css
my-button button {
  background: dodgerblue;
}
```

A common solution to overriding child component styles is to use `::ng-deep`:

```css:title=profile.component.css
::ng-deep my-button button {
  background: dodgerblue;
}
```

`::ng-deep` is what's called a shadow-piercing descendant combinator. It works because it is able to pierce the [shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM). Using ::ng-deep to override a child components styles will achieve the desired result but with unintended side effects.

## The problem with `::ng-deep`

To understand the unintended side effects let’s see what the docs say about `::ng-deep`

From the [Angular Documentation](https://angular.io/guide/component-styles#deprecated-deep--and-ng-deep) - emphasis mine.

> Applying the `::ng-deep` pseudo-class to any CSS rule completely **disables view-encapsulation** for that rule. **Any style with `::ng-deep` applied becomes a global style.**

**Using `::ng-deep` is the same as adding these style overrides to a global stylesheet!** If our intent is for these styles to apply globally then they belong in a global stylesheet, not in the component level CSS and we don’t need to use `::ng-deep` in a global CSS file.

## The bigger problem with `::ng-deep`

Before getting to how to responsibly use `::ng-deep` let's look at an even bigger problem that could arise when using `::ng-deep` incorrectly.

Let's say we unknowingly used `::ng-deep` as shown above and it is being treated as a global style now. This might not seem like a big deal because you can easily spot that `my-button` components outside of the `profile` component also have a `background` color of `dodgerblue` now which wasn't your intent.

The bigger problem with `::ng-deep` arises if you are using lazy-loaded modules and you override `my-button` styles in one of those lazy loaded modules.

In the example below the `my-button` component has its `background` set to `dodgerblue` internally which is what we see when the application loads the Dashboard module.

In the `profile` component, which is part of a lazy-loaded module (`ProfileModule`), we change the `my-button` `background` color to `blueviolet` using `::ng-deep`. We can see this change by clicking the "profile" link.

Now if we navigate back to the Dashboard module using the 'dashboard' link you can see that the `background` of `my-button` is now `blueviolet` and not `dodgerblue` anymore!

https://stackblitz.com/edit/angular-ivy-h9bnvh

This was a trivial example, but you can see how much confusion this could cause in a more complicated scenario.

## Solving the `::ng-deep` problem

If you absolutely must override a component's styles you can scope those style overrides to the component they are declared in using the `:host` selector:

```css:title=profile.component.css
:host ::ng-deep my-button button {
  background: blueviolet;
}
```

https://stackblitz.com/edit/angular-ivy-j1nwcv

The `:host` CSS selector refers to a component's `selector` property: `my-profile` in the example above. Using `:host` ensures that the `::ng-deep` usage will not cause those styles to become global.

## Should we use `::ng-deep` at all?

Since `::ng-deep` is [deprecated](https://angular.io/guide/component-styles#deprecated-deep--and-ng-deep) I would recommend only using it when absolutely necessary.

Ask yourself the following questions before reaching for `::ng-deep` to override component styles:

### Does my application own the component?

If you are using `::ng-deep` to override the styles of other components you have created, you can make those components more flexible using either an `Input` or by providing styling hooks using [CSS custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*).

### Is this a third-party component?

If you are using `::ng-deep` to override the styles of third-party components check the component documentation to see if they provide either an `Input` or styling hooks. If not, determine if this override should apply globally and add it to a global style sheet if so. If the overrides should only apply to a specific components usage, scope those styles using the `:host` selector.
