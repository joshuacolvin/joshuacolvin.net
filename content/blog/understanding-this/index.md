---
title: 'Understanding JavaScript: this'
date: 2016-02-28
tags: ['javascript']
---

One of my goals for 2016 is to really understand the JavaScript language and understanding the `this` keyword was the first step. I chose `this` because it seems like it trips a lot of developers up, myself included. This is by no means meant to be an exhaustive examination of the this keyword but rather an attempt to solidify my understanding. If you see any errors or something is unclear please leave a comment.

### Where does _this_ get its value

The value of `this` is determined by the execution context of the containing function. To explain this we'll start with a simple greet function.

```javascript
function greet() {
  console.log(
    this.sound + '! My name is ' + this.name + ' and I am a ' + this.species
  )
}

var sound = 'Woof'
var name = 'Fido'
var species = 'dog'

greet() // "Woof! My name is Fido and I am a dog"
```

In this instance we are calling the `greet` function in the global scope so the containing object is the global object. Referencing `this.name` is the same as referencing `window.name` which returns "Fido".

Let's build on this example by calling the `greet` function as a method of an object:

```javascript
function greet() {
  console.log(
    this.sound + '! My name is ' + this.name + ' and I am a ' + this.species
  )
}

var sound = 'Woof'
var name = 'Fido'
var species = 'dog'

var horse = {
  sound: 'Neigh',
  name: 'Seabiscuit',
  species: 'horse',
  greet: greet,
}

greet() // "Woof! My name is Fido and I am a dog"
horse.greet() // "Neigh! My name is Seabicuit and I am a horse"
```

Now the `greet` function is executed as a method of the `horse` object, making the `horse` object the containing object. Referencing `this.name` is now the same as saying `horse.name` which returns Seabiscuit.

We can also explicitly define what object the `this` keyword should be bound to by using `call` or `apply`. The first argument passed to `call` and `apply` is the object the `this` keyword should be bound to:

```javascript
function greet() {
  console.log(
    this.sound + '! My name is ' + this.name + ' and I am a ' + this.species
  )
}

var sound = 'Woof'
var name = 'Fido'
var species = 'dog'

var horse = {
  sound: 'Neigh',
  name: 'Seabiscuit',
  species: 'horse',
  greet: greet,
}

greet() // "Woof! My name is Fido and I am a dog"
greet.call(horse) // "Neigh! My name is Seabiscuit and I am a horse"
```

Calling `greet.call()` and passing `horse` as the first parameter binds the `this` keyword to the `horse` object. The same thing can be accomplished using `bind` though the execution is a bit different:

```javascript
function greet() {
  console.log(
    this.sound + '! My name is ' + this.name + ' and I am a ' + this.species
  )
}

var sound = 'Woof'
var name = 'Fido'
var species = 'dog'

var horse = {
  sound: 'Neigh',
  name: 'Seabiscuit',
  species: 'horse',
  greet: greet,
}

greet() // "Woof! My name is Fido and I am a dog"

var seabiscuit = greet.bind(horse)
seabiscuit() // "Neigh! My name is Seabiscuit and I am a horse"
```

`this` can also be set by using the `new` keyword:

```javascript
function Animal() {
  this.greet = function() {
    console.log(
      this.sound + '! My name is ' + this.name + ' and I am a ' + this.species
    )
  }
}

var cat = new Animal()
cat.sound = 'Meow'
cat.name = 'Whiskers'
cat.species = 'cat'

cat.greet() // "Meow! My name is Whiskers and I am a cat"
```

What the `new` keyword does is it creates a new object and binds the `this` keyword to that new object. If the constructor function does not return its own object, the newly created object will be returned. By logging cat to the console we can see that it holds the value of the newly created object. Calling `cat.greet()` proves that the `this` keyword is bound to our `cat` object.

Again this is not an exhaustive examination of the `this` keyword. Here are a couple resources that delve deeper and have helped me gain a better understanding:

[this & Object Prototypes](https://github.com/getify/You-Dont-Know-JS/blob/master/this%20&%20object%20prototypes/README.md#you-dont-know-js-this--object-prototypes) by _Kyle Simpson_

[Understand JavaScript's "this" With Clarity, and Master it](http://javascriptissexy.com/understand-javascripts-this-with-clarity-and-master-it/)
