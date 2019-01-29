---
title: 'Understanding JavaScript: Scope'
date: 2016-08-29
---

Scope is an important concept to understand in JavaScript since it is the foundation that many other concepts are built upon. In this post, I'll give a quick overview of scope.

### What is scope?

> Scope is the set of rules that determines what variables are available where

In JavaScript, a variable can live in one of two scopes: _global_ or _local_. Variables declared within the global scope are accessible from any other scope throughout the entire runtime. We can create a new scope by declaring a function. Variables declared within a function are in the local scope of that function and can only be accessed within that function (unless using a _closure_).

Let's create some variables and a function to demonstrate:

```javascript
var foo = 'foo' // global scope

function bar() {
  var baz = 'baz' // bar's local scope

  console.log(baz) // local scope accessible here
  console.log(foo) // global scope accessible here
}

bar()

console.log(baz) // bar's local scope NOT accessible here
console.log(foo) // global scope accessible here
```

In the example above the `foo` variable is in the global scope and can be accessed from any scope. We prove this by logging foo from inside the `bar` function on line 7.

Inside of the function `bar` we create a new variable `baz` on line 4. `baz` is in the local scope of the `bar` function and can only be accessed from within the function. When we try to access `baz` from the global scope on line 12 we get the error: `ReferenceError: baz is not defined`.

### The Scope Chain

JavaScript uses what's called a _scope chain_ to determine which variable is available in which scope. The scope chain starts at the inner most function and works its way up until it reaches the global scope. When it finds the variable you requested it stops moving up the chain.

Consider this example which will show the scope chain in action:

```javascript
var foo = 'foo'

function bar() {
  var foo = 'inner foo'

  function baz() {
    console.log(foo) // inner foo
  }

  baz()
}

bar()
```

We first declare a global variable `foo` and a function `bar`. Inside of our `bar` function we create another `foo` variable, this time with the value `inner foo`. Lastly, we create a function, `baz`, inside of our `bar` function that logs out the value of `foo`.

Our `baz` function is the inner most function and the start of the scope chain. Since it is nested inside the `bar` function it has access to all of it's scope. The scope chain first looks in the `baz` function for a variable named `foo`. When it fails to find a reference, it moves up the scope chain into the `bar` functions scope where it finds a variable `foo` with the value `inner foo`. It uses this value since it is the first instance it finds. Our inner `foo` is not overwriting the global `foo` but merely _shadowing_ it.

### Block Scope with `let`

Lastly, ES6 has introduced the `let` keyword that creates a _block scope_. Unlike`var` which is in the _local_ scope of the entire function body in which it is declared, `let` creates a new scope local to a block of code such as an `if` statement:

```javascript
function foo() {
  var bar = 'bar'

  if (true) {
    let bar = 'let bar'
    console.log(bar) // let bar
  }
  console.log(bar) // bar
}

foo()
```

By using the `let` keyword inside the `if` statement we create a `bar` variable that is local to that block of code. If we access `bar` outside of the `if` statement we get the `bar` from line 2.

### Wrapping up

Scope is a powerful concept and one you must understand if you're going to be writing JavaScript. Understanding closures relies heavily on one understanding scope first. Hopefully this post helped you gain a better understanding.
