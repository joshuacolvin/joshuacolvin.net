---
title: "Simple Mock REST API's with JSON-Server"
date: 2017-02-28
tags: ['json-server']
---

One of the biggest pain points I've experienced as a front end developer is writing an
application that consumes a REST API before the REST API has been written. If you have a database
[schema](https://en.wikipedia.org/wiki/Database_schema) available, you can do a lot of work in parallel.
I've tried many approaches (`json` files, JavaScript arrays, localStorage, firebase, Node API's) to solving
this problem, each with their own drawbacks. [JSON Server](https://github.com/typicode/json-server) is the solution
I've been looking for!

## What is JSON-Server

_From the docs_

> Get a full fake REST API with zero coding in less that 30 seconds (seriously)

JSON-Server lets you create a fully functional backend using just JSON. It supports `GET`, `POST`, `PUT`, `PATCH`, and `DELETE`
requests and automatically saves your changes.

## Installation

One of the best things about JSON-Server is that there is no complicated setup, just install with _npm_:

```shell
npm install -g json-server
```

## Creating the database

Creating the database is a simple as creating a json file that contains your data:

```json:title=db.json
{
  "books": [
    {
      "id": 1,
      "title": "The Great Gatsby",
      "author: "F. Scott Fitzgerald"
    },
    {
      "id": 2,
      "title": "Pride and Prejudice",
      "author: "Jane Austen"
    }
  ]
}
```

You can think of each array (_books_) as a different endpoint in your API.

## Starting the server

We need to start the server in order to make requests:

```shell
json-server --watch db.json
```

This will start the server on `port 3000`. If you need to use a different port you can use the `--port` flag:

```shell
json-server --watch db.json --port 8080
```

## Making requests

To keep things simple, we can use [curl](https://curl.haxx.se/) to make requests to our API in a differnt terminal session.

Let's start with a 'GET' request for all books:

```shell
curl http://localhost:3000/books
```

We can request a single book using the book's id:

```shell
curl http://localhost:3000/books/1
```

Adding a book is as simple as sending a 'POST' request with the new book data:
_Don't worry about adding an `id`, JSON-Server will do that for you_

```shell
curl --data "title=blood meridian&author=Cormac McCarthy" http://localhost:3000/books
```

If we look at `db.json` again, we will see that the new book was saved for us!

Let's update book:

```shell
curl -X PUT -d "title=Infinite Jest" -d "author=David Foster Wallace" http://localhost:3000/books/1
```

Look at `db.json` and see that the book with the id of `1` has been updated.

Finally, we will delete the book with the `id` of `2`:

```shell
curl -X DELETE http://localhost:3000/books/2
```

Once again, look at `db.json` and see that the book with the `id` of `2` has been deleted.

## Conclusion

JSON-Server is a great way to create a mock server with data persistence. There are some more advanced features
that weren't covered here so I urge you to read the [documentation](https://github.com/typicode/json-server).
