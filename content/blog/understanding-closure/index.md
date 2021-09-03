---
title: 'Understanding JavaScript: Closures'
date: 2016-09-14
tags: ['javascript']
---

Closure's in JavaScript might seem like a difficult thing to grok but when you strip away the mystery they are really rather simple:

### What is a closure?

> A closure is just an inner function that retains access to the outer (enclosing) function's variables.

I had read some variation of this definition multiple times in the past but I didn't quite understand what it meant, or better yet, what it looked like in practice.

### A closure example

```javascript
function counter() {
  var count = 0

  return function() {
    return (count += 1)
  }
}

var myCounter = counter()

myCounter() // returns 1
myCounter() // returns 2
myCounter() // returns 3
```

Because of JavaScript's [scoping](https://github.com/getify/You-Dont-Know-JS/blob/master/scope%20&%20closures/ch5.md) rules, you might expect the variable `count` to be inaccessible once `counter()` has been executed.

On line 4 we return a function that increments the `count` variable by 1 and returns the result.
This function is our _closure_, an inner function that retains access to the outer (enclosing) function's variables, in this case the `count` variable.

On line 9 we assign the `counter` function to the `myCounter` variable. This gives us access to counter's inner function, our _closure_.
Calling `myCounter()` now increments the `count` variable by 1.

Using closure's you can decide what is public and private. Our `count` variable can only be changed via the closure. Closures are widely used in JavaScript and something you've probably seen and used before without realizing it. A good example is the revealing module pattern.

### Revealing Module Pattern

I had been using closures without realizing it with the revealing module pattern.
The revealing module pattern allows you to create public and private methods by letting you choose what gets exposed.

Let's create a voting machine to vote for your favorite JavaScript book.

### Revealing Module Pattern Example

```javascript
var votingMachine = (function() {
  var goodPartsVotes = 0
  var patternsVotes = 0

  var voteForGoodParts = function() {
    goodPartsVotes += 1
    console.log('JavaScript the Good Parts has ' + goodPartsVotes + ' votes.')
  }

  var voteForPatterns = function() {
    patternsVotes += 1
    console.log('JavaScript Patterns has ' + patternsVotes + ' votes.')
  }

  return {
    voteForGoodParts: voteForGoodParts,
    voteForPatterns: voteForPatterns,
  }
})()
```

On lines 2 and 3 we create our two private variables, `goodPartsVotes` and `patternsVotes`. Then on lines 5 and 10 we create two methods, `voteForGoodParts` and `voteForPatterns`, these are our closures but they are currently inaccessible outside of the `votingMachine` function.

The return statement on line 15 lets us decide what to publicly expose. Our two private variables `goodPartsVotes` and `patternsVotes` are only accessible through the two methods we have revealed, `voteForGoodParts` and `voteForPatterns`.

### Wrapping up

Once again a closure is simply an inner function that retains access to the outer (enclosing) function's variables. Hopefully this has helped take some of the mystery away from what closures are and where you might use them. If you notice any errors in my explanation please leave a comment below.

### Additional resouces

If you want to learn more there are many great resources that dive deeper into closures than I have here.

1. [Scope and Closures](https://github.com/getify/You-Dont-Know-JS/tree/master/scope%20%26%20closures) by _Kyle Simpson_
2. [Understanding JavaScript Closures with Ease](http://javascriptissexy.com/understand-javascript-closures-with-ease/)
