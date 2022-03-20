---
title: 'Build a REST API with Hapi and MongoDB'
date: 2017-02-21
tags: ['hapi', 'mongodb']
---

In a previous [post](http://joshuacolvin.net/2017/01/27/hapi.html) we looked at getting started with [hapi](https://hapijs.com/).
If you're brand new to hapi I suggest you read that post first since it goes into more details about the hapi API. In this post, we'll cover
integrating a hapi application with a [MongoDB](https://www.mongodb.com/) database.

## Prerequisites

You will need to have both [Node](https://nodejs.org/en/) and [NPM](https://www.npmjs.com/) installed. We will be using some es2015 features like arrow functions,
so you will need to have Node version 4.3.2 or above or use a transplier like [babel](https://babeljs.io/).

## Project setup

Start by [cloning](https://help.github.com/articles/cloning-a-repository/) the [repository](https://github.com/joshuacolvin/hapi-mongo-tutorial) from github.
Once you've cloned the repo you'll need to run `npm install` to install the dependencies.

Looking at the `package.json` file you can see that we are installing hapi, and [nodemon](https://github.com/remy/nodemon) which we will use to run the application.
We are also installing the [hapi-mongodb](https://github.com/Marsup/hapi-mongodb) plugin which will help us integrate mongoDB into our application.

*There is a branch in the github repo for each step. If at any time you get lost or the code isn't working as expected you can
find the source code up to that point via the *source code* link.*

## Mongo Database setup

We have a couple options when it comes to setting up our database. We could create a local mongo database or we could use a service like [mlab](https://mlab.com/).
We'll go with mlab since it's easy to set up.

First you will need to create an account if you don't already have one. mlab offers a free tier which is what we'll be using:

<img class="full-width" src="{{ site.baseurl }}/img/mlab-create-db.png" alt="">

Give your database a name and create it:

<img class="full-width" src="{{ site.baseurl }}/img/mlab-name-db.png" alt="">

You will also need to create a new user who has read and write access to the database.

Navigate into your newly created database and look for this line: **To connect using a driver via the standard MongoDB URI (what's this?):**
Copy the link below. We will need to reference this link in our application.

## Configuring MongoDB

We need a way to tell our hapi-mongodb plugin where our database is located. hapi-mongodb can accept an options object that contains the connection information but we don't want
to store that information in our code since it contains our username and password. We can save our mlab database uri in a node environement variable that will only be available in our local environement.
We can use [dotenv](https://github.com/motdotla/dotenv) which allows us to store our environement variables in a `.env` file.

**_I've added `.env` to our `.gitignore` file in order to keep our username and password out of version control_**

Install dotenv:

```shell
npm install dotenv --save
```

Create a `.env` file and add your mlab url:

```text
// .env

mlab=yourmlaburi
```

require dotenv at the top of `index.js` and call the `config()` method:

```javascript:title=index.js
require('dotenv').config()
```

We need to set our database configuration options in `dbConfig.js`:

```javascript:title=dbConfig.js
module.exports = {
  url: process.env.mlab,
  settings: {
    db: {
      native_parser: false,
    },
  },
  decorate: true,
}
```

Notice that we can access our mlab uri with `process.env.mlab`.

Finally we need to register the hapi-mongodb plugin and our `dbConfig.js` file in `index.js` so our application knows to use them:

```javascript:title=index.js
server.register(
  {
    register: require('hapi-mongodb'),
    options: require('./dbConfig'),
  },
  err => {
    if (err) {
      console.error(err)
      throw err
    }

    server.start(() => {
      console.log('Serving on:', server.info.uri)
    })
  }
)
```

[source code](https://github.com/joshuacolvin/hapi-mongo-tutorial/tree/step-2)

## Testing our database connection

We registerd our hapi-mongodb plugin and don't see any errors but let's see if we can get data from our database.
We can add some test data through the mlab interface. First add a collection, will call it "books". Select the _books_ collection
and then _add a document_. Let's add the details of one of my favorite books _Infinite Jest_:

```json
{
  "title": "Infinite Jest",
  "author": "David Foster Wallace"
}
```

Click _Create and go back_ and you should see the data below though your `_id` will be different:

```json
{
  "_id": {
    "$oid": "588d0d6bf36d2804078ad8b5"
  },
  "title": "Infinite Jest",
  "author": "David Foster Wallace"
}
```

Let's write some code to see if we can get the book data from the database!

First, we'll add a route handler to `handler/books.js` that will find all the books in our database.
We have access to the database in our code with `request.mongo.db` which we assign to the variable `db`.
If you've ever written any jQuery, MongoDB's [api](https://docs.mongodb.com/manual/reference/method/js-collection/) should feel familiar.
We'll be chaining collection methods onto our database instance in order to find what we want.

```javascript:title=handlers/books.js
exports.find = function(request, reply) {
  const db = request.mongo.db

  db.collection('books')
    .find()
    .toArray((err, result) => {
      if (err) {
        console.error(err)
        throw err
      }
      reply(result)
    })
}
```

Let's disect the database query: `db.collection('books').find().toArray((err, result) => {})`

We call the `collection()` method, passing in _'books'_ to access the _books_ collection. Then we call
`.find()` which will find all of the documents in our collection. Lastly, we call the `toArray()` method
which returns the result as an array of documents.

Next, let's add a route to test our data. We need to require the _books_ handler which we'll reference as `Books.find`:

```javascript:title=routes.js
const Books = require('./handler/books')

module.exports = [
  {
    method: 'GET',
    path: '/api/books',
    handler: Books.find,
  },
]
```

Now we just need to pass `routes.js` to `server.route()` so hapi knows where to find our routes:

```javascript:title=index.js
server.route(require('./routes'))
```

If we open the browser to `localhost:8080/api/books` we can see that our book data is being fetched from the database and returned.

[source code](https://github.com/joshuacolvin/hapi-mongo-tutorial/tree/step-3)

## Creating a resource

Going into mlab and manually adding books isn't very efficient! Let's add a route that will allow us to create new books:

```javascript:title=routes.js
module.exports = [{
  ...
}, {
  method: 'POST',
  path: '/api/books',
  handler: Books.create
}]
```

And a handler to handle the creation:

```javascript:title=handlers/books.js
exports.create = function(request, reply) {
  const db = request.mongo.db

  db.collection('books').insertOne(request.payload, (err, result) => {
    if (err) {
      throw err
    }
    reply('OK')
  })
}
```

In our create handler we use the [`insertOne()`](https://docs.mongodb.com/manual/tutorial/insert-documents/#write-op-insertone) method,
passing in `request.payload` which contains the book data to be added.

[source code](https://github.com/joshuacolvin/hapi-mongo-tutorial/tree/step-4)

## Validation with Joi

Our API is coming along nicely so far but we have a problem. Right now, there is nothing stopping someone from adding anything they want to the database.
Since we only want people to add books, we need to put some constraints in place. We can do this by defining a [schema](https://en.wikipedia.org/wiki/Database_schema).
hapi has a great plugin called [Joi](https://github.com/hapijs/joi) that we can use just for this purpose.

We can install joi using npm:

```shell
npm install --save joi
```

Now we need to define a schema that describes what our book data should contain. First lets create a new folder called `schemas` and
inside `schemas` create a file called `book.js`.

We can define our schema as a plain JavaScript object that contains the fields we want our data to contain; _title_ and _author_.
We will then use joi to declare the data type our fields should accept and make these fields required: `Joi.string().required()`.
Our finished schema looks like this:

```javascript:title=schemas/book.js
const Joi = require('joi')

module.exports = {
  title: Joi.string().required(),
  author: Joi.string().required(),
}
```

Our route can now be configured to use the schema:

```javascript:title=routes.js
const bookSchema = require('./schemas/book')

module.exports = [{
  ...
}, {
  method: 'POST',
  path: '/api/books',
  handler: Books.create,
  config: {
    validate: {
      payload: bookSchema
    }
  }
}]
```

Here we are setting the `payload` or `request.payload` to be validated using the book schema we imported.

With this in place, our API should be ready to ward off any misformed books! We can test by trying to add a book without an author:

```shell
curl --data "title=1984" localhost:8080/api/books
```

This will throw an error telling you exactly what was wrong with the data:

```shell
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "child \"author\" fails because [\"author\" is required]",
  "validation": {
    "source": "payload",
    "keys": [
      "author"
    ]
  }
}
```

Our schema will also throw an error if we add more data than our schema allows. Try adding a rating:

```shell
curl --data "title=1984&author=George Orwell&rating=11" localhost:8080/api/books
```

```shell
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "\"rating\" is not allowed",
  "validation": {
    "source": "payload",
    "keys": [
      "rating"
    ]
  }
}
```

[source code](https://github.com/joshuacolvin/hapi-mongo-tutorial/tree/step-5)

## Retrieving a single resource

The books API should be able to send back data for a single book. We can create a route with a
dynamic segment for the id of the book we wish to fetch.

```javascript:title=routes.js
module.exports = [{
  ...
}, {
  method: 'GET',
  path: '/api/books/{id}',
  handler: Books.findOne
}]
```

The `path` contains our dynamic segment: `{id}`. We can use this dynamic segment to query our database for a book
that matches that id. We gain access to the id in our handler via `request.params.id`.

You may have noticed that an id was automatically added to our books: `_id: "5892a8bad4e24956c119ea4f"`.
Since each document must have a unique id in mongo, an id will be created for us if we don't provide our own.
In order to compare `request.params.id` to the books `_id` we must use mongo's [`ObjectId`](https://docs.mongodb.com/manual/reference/method/ObjectId/) constructor
which we can access via `request.mongo.ObjectID`.

Using mongo's [`findOne()`](https://docs.mongodb.com/manual/reference/method/db.collection.findOne/) method, we can pass in a query
that finds a book with a matching id:

```javascript:title=handlers/books.js
exports.findOne = function(request, reply) {
  const db = request.mongo.db
  const ObjectID = request.mongo.ObjectID

  db.collection('books').findOne(
    { _id: new ObjectID(request.params.id) },
    (err, result) => {
      if (err) {
        throw err
      }

      reply(result)
    }
  )
}
```

Navigate to `localhost:8080/api/books` and copy the id of a book and test our new route, `localhost:8080/api/books/5892a8bad4e24956c119ea4f`. We should get the data for
the book whose id matches the id we copied.

[source code](https://github.com/joshuacolvin/hapi-mongo-tutorial/tree/step-6)

## Updating a resource

Let's add a route for updating a resource. Notice the route definition is similar to the route definition
for getting a single resource except we use the `PUT` method and call a different handler.

```javascript:title=routes.js
module.exports = [{
  ...
}, {
  method: 'PUT',
  path: '/api/books/{id}',
  handler: Books.update
}]
```

Now, we will define the update method. We will use the [`findOneAndReplace()`](https://docs.mongodb.com/manual/reference/method/db.collection.findOneAndReplace/) method,
passing in a query to find the book by id, `request.payload` which contains our updated book, and a callback function to
run when the database operation has finished.

```javascript:title=handlers/books.js
exports.update = function(request, reply) {
  const db = request.mongo.db
  const ObjectID = request.mongo.ObjectID

  db.collection('books').findOneAndReplace(
    { _id: new ObjectID(request.params.id) },
    request.payload,
    (err, result) => {
      if (err) {
        throw err
      }
      reply('OK')
    }
  )
}
```

We can test this using curl once again:

```shell
curl -X PUT --data "title=The Pale King&author=David Foster Wallace" localhost:/8080/api/books/5892a8bad4e24956c119ea4f
```

[source code](https://github.com/joshuacolvin/hapi-mongo-tutorial/tree/step-7)

## Deleting a resource

Last, but not least, we need to be able to delete a book from our database. Create a route using the `DELETE` method:

```javascript:title=routes.js
module.exports = [{
  ...
}, {
  method: 'DELETE',
  path: '/api/books/{id}',
  handler: Books.remove
}]
```

And define our _remove_ handler:

```javascript:title=routes.js
exports.remove = function(request, reply) {
  const db = request.mongo.db
  const ObjectID = request.mongo.ObjectID

  db.collection('books').findOneAndDelete(
    { _id: new ObjectID(request.params.id) },
    (err, result) => {
      if (err) {
        throw err
      }
      reply('OK')
    }
  )
}
```

Our delete handler uses the [`findOneAndDelete()`](https://docs.mongodb.com/manual/reference/method/db.collection.findOneAndDelete/) method,
passing in a query to match the id of the book to delete, and a callback to run when the operation is complete.

Finally, we test that our delete route is working:

```shell
curl -X DELETE localhost://8080/api/books/5892a8bad4e24956c119ea4f
```

[source code](https://github.com/joshuacolvin/hapi-mongo-tutorial/tree/step-8)

## Wrapping up

Hapi plugins like [hapi-mongodb](https://github.com/Marsup/hapi-mongodb) make integrating a hapi application with mongoDB relatively painless.
Though we only scratched the surface of what MongoDB is capable of, we can see that great documentation and a familiar api make it a breeze to work with.
