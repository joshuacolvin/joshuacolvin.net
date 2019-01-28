---
title: Adding dynamic validators in Angular
date: '2018-10-29'
---

Adding dynamic validators to an Angular form control is not as straight forward as one would expect. We’ll explore some problems you may encounter and one possible solution.

## The Scenario

Let’s say we have an input that always needs to validate the max length but is conditionally required based on some other setting in our application.

## The Problem

We add the `maxLength` validator when the form is created:

```typescript
this.form = this.fb.group({
  phone: ['', Validators.maxLength(10)],
})
```

And later we add the `required` validator using the `setValidators()` method:

```typescript
this.form.get('phone').setValidators(Validators.required)
```

The `required` validation works but not `maxLength`.

Looking at the [documentation](https://angular.io/api/forms/AbstractControl#setvalidators) for the `setValidators()` method, we can see why this occurs:

> Calling this overwrites any existing sync validators.

So by calling `setValidators()` we overwrote the `maxLength` validator.

We need a way to add more validators to a form control so naturally we look at the `AbstractControl` documentation for a `addValidators()` method which sadly doesn’t exist.

## The Solution

We can solve this problem by saving a reference\* to any default validators our form control should have. Later we can pass the default validators to the `setValidators()` method along with any new validator(s) we want to add.

_\*Unfortunately there is currently not a way to get all the validators on a control (see this [issue](https://github.com/angular/angular/issues/13461)) so we will save a reference to the original validators. This is not ideal for large forms with lots of controls._

```typescript
defaultPhoneValidators = [Validators.maxLength(10)];

if (this.phoneRequired) {
    this.form.get('phone')
        .setValidators([
            …this.defaultPhoneValidators,
            Validators.required
        ]);
}
```

We’ve now added the `required` validator along with the existing `maxLength` validator.

At this point if we submit the form without the required value the form is still `VALID`. That’s because the control’s validity has not been updated. We must call the `updateValueAndValidity()` method after our call to `setValidators()` in order to recalculate the validation status of the control.

```typescript
this.form.get('phone').updateValueAndValidity()
```

Now the phone control will be `INVALID` until it has a value.

## Conclusion

As you can see, adding dynamic validators is possible with a bit of extra work. This would be simplified with the addition of either a `getValidators()` or `addValidators()` method.

You can see a working demo [here](https://stackblitz.com/edit/dynamic-validator?embed=1&file=src/app/app.component.ts)
