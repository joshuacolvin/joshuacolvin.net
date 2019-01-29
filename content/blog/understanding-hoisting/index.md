---
title: 'Understanding JavaScript: Hoisting'
date: 2016-09-05
---

To understand _hoisting_ you must first understand how [scope](http://joshuacolvin.net/posts/understanding-scope.html) works in JavaScript.

In JavaScript, hoisting occurs when variable or function declarations are moved to the top of a scope. It's important to make a distinction between declarations and assignments. The code `var name = "World";` could be broken up into the following:

- `var name` is the the declaration (the part that gets hoisted).
- `name = 'World'` is the assignment (which is not hoisted).

To demonstrate let's create a function that says hello.

```javascript
function sayHello() {
  console.log('Hello ', name)
}

sayHello() // Uncaught ReferenceError: name is not defined
```

This function will throw an error since we have not declared the `name` variable. Let's declare the variable _after_ we log it to see what happens.

```javascript
function sayHello() {
  console.log('Hello ', name)
  var name = 'World'
}

sayHello() // Hello undefined
```

Now we get Hello `undefined` which means our variable name exists but does not hold a value. This is because our variable declaration, `var name` has been _hoisted_ to the top of the sayHello functions scope but not the assignment, `name = "World"`.
This function is being interpreted like this:

```javascript
function sayHello() {
  var name
  console.log('Hello ', name)
  name = 'World'
}

sayHello() // Hello undefined
```

Here's another example to show how the variable declaration gets hoisted:

```javascript
function sayHello() {
  name = 'World'
  var name
  console.log('Hello ', name)
}

sayHello() // Hello World
```

This will log the desired value _Hello World_ since the `var name` was hoisted to the top of the sayHello function. This function is being interpreted like this:

```javascript
function sayHello() {
  var name
  name = 'World'
  console.log('Hello ', name)
}

sayHello() // Hello World
```

Function declarations are also hoisted.

```javascript
sayHello() // Hello World

function sayHello() {
  var name = 'World'
  console.log('Hello ', name)
}
```

We can call the function seemingly _before_ it is declared since the declaration is hoisted to the top of the scope (in this case _global_ scope). It is important to note that this only works for
function [declarations](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function) and not function [expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/function).

```javascript
sayHello() // Uncaught TypeError: sayHello is not a function

var sayHello = function() {
  var name = 'World'
  console.log('Hello ', name)
}
```

This throws a `TypeError` saying `sayHello` is not a function since `sayHello` hasn't been assigned a value when it is called, it has only been declared.

Since _hoisting_ can lead to unexpected behavior it's a best practice to declare your variables at the top of a function.
