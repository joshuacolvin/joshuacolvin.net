---
title: 'Getting started with Hapi'
date: 2017-01-27
---

There are many choices when it comes to Node frameworks: [express](http://expressjs.com/), [koa](http://koajs.com/), and [sails](http://sailsjs.com/) just to name a few.
In this tutorial we'll take a look at [hapi](https://hapijs.com/), a Node framework built by the team at [walmart labs](http://www.walmartlabs.com/). We'll cover the basics
of hapi, creating a server and defining routes, building a simple REST API along the way.

![hapi logo](https://camo.githubusercontent.com/16f4a37b7e2086b6e44dcb0cdfaf9e41f5738278/68747470733a2f2f7261772e6769746875622e636f6d2f686170696a732f686170692f6d61737465722f696d616765732f686170692e706e67)

## What is hapi?

hapi is a highly modular server framework build on top of Node that favors configuration over code:

> hapi enables developers to focus on writing reusable application logic instead of spending time building infrastructure.

hapi is extensible and has a rich ecosystem of plugins. There is probably a plugin for anything you'll need to do in your application and if not you can write your own!
We won't be using any plugins in this tutorial but you will more than likely need to when building a real application with hapi.

## Prerequisites

You will need to have both [Node](https://nodejs.org/en/) and [NPM](https://www.npmjs.com/) installed. I've purposely avoided using most es2015 features so you should
be fine with Node version 4.3.2 and above.

## Setting up the project

We will be creating a simple CRUD application that will handle an inventory of products. Our directory structure will look like this:

_I've added the source code for each step throughout the tutorial. If you get lost, or something is not working you can clone that step and run `npm install` and you should be back on track._

```
products-api/
|
|- handlers/
|     |- products.js
|
|- index.js
|- package.json
|- routes.js
```

Create the directory structure and all files except `package.json`. We will let npm create `package.json` for us. Jump into terminal or your command line of choice:

```shell
npm init -f
```

Now we are ready to install our only dependency, hapi:

```shell
npm install --save hapi
```

## A basic hapi server

That's all the setup we need for now. Let's write some code! The entry point into our application will be `index.js` so we will begin writing code there.

First we need to require hapi and create an instance of the hapi server:

```javascript:title=index.js
var Hapi = require('hapi')
var server = new Hapi.Server()
```

Next we create a connection to localhost:8080, or a port of your choosing:

```javascript:title=index.js
server.connection({
  host: 'localhost',
  port: 8080,
})
```

Now we use the `start()` method on our server instance to start the server and log a message to the console.

```javascript:title=index.js
server.start(function() {
  console.log('Serving hapi app at:', server.info.uri)
})
```

Our server won't actually be running yet though since we haven't run the file. Open terminal (or the command line of your choice) and run this command:

```shell
node index.js
```

This tells node to execute the `index.js` file. If all goes well we should see our message `Serving hapi app at: localhost:8080` logged out to the terminal.

_I suggest using [nodemon](https://www.npmjs.com/package/nodemon) which will restart your server on file changes. You would just need to substitue `nodemon` for `node` in the command above._

[source code](https://github.com/joshuacolvin/hapi-tutorial/tree/step-1)

## Adding a route

Our server is listening but we haven't told it how to respond. We can set up routes to do this.

We add a route by calling the `.route` method on our `server` instance and passing in a route configuration object
that tells the server everything it needs to know about our route:

```javascript:title=index.js
server.route({
  method: 'GET',
  path: '/',
  handler: function(request, reply) {
    return reply('Hello world')
  },
})
```

Let's break this options object down:

- `method: 'GET'` : The HTTP request method that tells the server what action it should take. We are
  asking the server to return a resource, the string `Hello world`.
- `path: '/'` : The url path attached to this route. `path` would be anything after `localhost:8080`.
- `handler : function (request, reply) {...}` : The `handler` is how we tell the server how it should respond. We use the `[reply()](https://hapijs.com/api#replyerr-result)` interface to
  return the string `Hello world`.

Restart the server in terminal (`node index.js`) and open the browser to `localhost:8080` and you should see the message `Hello world`.

[source code](https://github.com/joshuacolvin/hapi-tutorial/tree/step-2)

## Adding multiple routes

This is awesome but most applications have more than one route they need to respond to. `server.route()` can take a route configuration object or an array of route configuration objects.
Let's add the route for an about page:

```javascript:title=index.js
server.route([
  {
    method: 'GET',
    path: '/',
    handler: function(request, reply) {
      return reply('Hello world')
    },
  },
  {
    method: 'GET',
    path: '/about',
    handler: function(request, reply) {
      return reply('About')
    },
  },
])
```

We replaced our single route configuration object with an array containing two route configuration objects.
Switching between our two routes is as simple as navigating to the corresponding url.

[source code](https://github.com/joshuacolvin/hapi-tutorial/tree/step-3)

## A mock database

A web application that just returns text isn't very exciting. Let's see how to return `JSON`. First we will need some data.
Create a new file in the root directory called `products.json` with the following contents:

_To keep things simple, we will use a `JSON` file instead of a database. One downside of this is that our data will not persist when we restart the server. You could substitute a database or localStorage for data persistence_

```json:title=products.json
[
  {
    "id": "1",
    "description": "Product 1",
    "price": 25
  },
  {
    "id": "2",
    "description": "Product 2",
    "price": 9.99
  },
  {
    "id": "3",
    "description": "Product 3",
    "price": 14
  },
  {
    "id": "4",
    "description": "Product 4",
    "price": 45.5
  },
  {
    "id": "5",
    "description": "Product 5",
    "price": 220
  },
  {
    "id": "6",
    "description": "Product 6",
    "price": 100
  }
]
```

To keep things simple, `products.json` will be a stand in for our database. To use it, we need to require it in `index.js`:

```javascript:title=index.js
const products = require('./products.json')
```

## Adding a route that returns `JSON`

Now let's add a new route, `/products` that will return the products data:

_You can remove our previous two routes, we won't be needing them any more_

```javascript:title=index.js
server.route([
  {
    method: 'GET',
    path: '/products',
    handler: function(request, reply) {
      return reply(products)
    },
  },
])
```

Navigating to `localhost:8080/products`, you can see that our `JSON` data was returned!

You may have noticed that we didn't have to make any changes to our call to `reply()`. We just passed the json the same way we passed a string earlier. hapi is smart enough to figure this out for us so we don't have to specify the type of data we are returning!

[source code](https://github.com/joshuacolvin/hapi-tutorial/tree/step-4)

## Using route parameters

In order to fetch an individual product we have to introduce a new concept, _route parameters_, which allow you to declare dynamic segments of a path.
To indicate a dynamic segment you use `{variablename}`:

```javascript:title=index.js
server.route([
  {
    // ...
  },
  {
    method: 'GET',
    path: '/products/{id}',
    handler: function(request, reply) {
      return reply(products[request.params.id - 1])
    },
  },
])
```

This is our most complicated route so far since we are after a product with a particular id. The important thing to notice is the value we asign to `path` property: `'/products/{id}'`.
Anything we place inside of the curly braces `{}` will be available in the handler function as `req.params.paramname` where `paramname` is the value you placed between the `{}`.
We use this parameter to get the desired product from our array of products:

```javascript:title=index.js
return reply(products[request.params.id - 1])
```

If a product is found that matches the `id` parameter we send back that product: `reply(products[request.params.id - 1])`.
We could easily create a database query to find products whose id matches `request.params.id` if we were using a real database.

## Using multiple route parameters

You can define multiple parameters in your path as long as they are seperated by a valid character so hapi knows where to do the split:

```javascript:title=index.js
path: '/products/{category}/{id}'
```

If you defined the path above, you would have access to two parameters in your handler function: `req.params.category` and `req.params.id`.

[source code](https://github.com/joshuacolvin/hapi-tutorial/tree/step-5)

## Refactoring

We're making progress but things are getting a little hard to follow in `index.js`. One thing we can do is extract out our routing into a seperate file.
We accomplish this by removing the route configuration objects array from `server.route()` and putting it into `routes.js`:

```javascript:title=routes.js
module.exports = [
  {
    method: 'GET',
    path: '/',
    handler: function(request, reply) {
      return reply('Hello world')
    },
  },
  {
    method: 'GET',
    path: '/about',
    handler: function(request, reply) {
      return reply('About')
    },
  },
  {
    method: 'GET',
    path: '/products',
    handler: function(request, reply) {
      return reply(products)
    },
  },
  {
    method: 'GET',
    path: '/products/{id}',
    handler: function(request, reply) {
      return reply(products[request.params.id - 1])
    },
  },
]
```

That's a good start but we can do better. Our handlers are relatively short right now but that would change were we using a real database.
Let's extract out the route handlers for our products routes into `handlers/products.js`:

_Dont forget to require `products.json` since we are now accessing that data in `handlers/products.js`_

```javascript:title=handlers/products.js
const products = require('../products.json')

exports.find = function(request, reply) {
  return reply(products)
}

exports.findOne = function(request, reply) {
  return reply(products[request.params.id - 1])
}
```

Now we need to reference the handler functions in `routes.js`:

_Don't forget to require `./handlers/products`_

```javascript:title="routes.js"
const Products = require('./handlers/products')

module.exports[
  ({
    // ... other routes
  },
  {
    method: 'GET',
    path: '/products',
    handler: Products.find,
  },
  {
    method: 'GET',
    path: '/products/{id}',
    handler: Products.findOne,
  })
]
```

Lastly we have to tell `server.route()` in `index.js` that we moved the routes:

```javascript:title=index.js
server.route(require('./routes'))
```

[source code](https://github.com/joshuacolvin/hapi-tutorial/tree/step-6)

## Creating a product

We've created routes to return all products and return a single products. Let's define a route that will let us add an item.
Let's start with our handler, which we'll call `create`:

```javascript:title=handler/products.js
exports.create = function(request, reply) {
  if (request.payload) {
    products.push(request.payload)
  }
  reply(request.payload)
}
```

This will take whatever is in `request.payload`, our product data, and push it into the products array. Again, this could be replaced by an `insert` into a real database.

Now let's define the route to create a product back in `route.js`:

```javascript:title=routes.js
module.exports = [{
    ...
{
    method: 'POST',
    path: '/products',
    handler: Products.create
}];
```

Since our application has no UI that allows you to add access this route we will need to use another means of transfering data to our server. Here I will use [cURL](https://curl.haxx.se/)
but you could use something like [Postman](https://www.getpostman.com/) instead.

While the server is running, open another terminal and run this command:

```
 $ curl --data "id=7&description=item 7&price=45.99" localhost:8080/products
```

Open the browser to localhost:8080/products we should now see our newly created product in the list!

[source code](https://github.com/joshuacolvin/hapi-tutorial/tree/step-7)

## Updating a product

Let's add the ability to update a product. Back in `routes.js` create the route for our update using `PUT` as the `method`:

```javascript:title=routes.js
module.exports = [{
 ...
}, {
    method: 'PUT',
    path: '/products/{id}',
    handler: Products.update
}];
```

Next, let's create the update handler we referenced in our new route:

```javascript:title=handler/products.js
exports.update = function(request, reply) {
  let product = products[request.params.id - 1]
  if (request.payload) {
    product = Object.assign(product, request.payload)
  }
  reply(product)
}
```

Here we get the product to be updated using `request.params.id` again. Then we use `Object.assign()` to combine the product object with our updates (`request.payload`). Any duplicate properties
will use the value from the last passed object, `request.payload` in this instance.

Let's hop back over to terminal and test the update route using cURL before we move on:

```shell
curl -X PUT --data "description=Macbook Air" localhost:8080/products/4
```

We are sending a `PUT` request to `localhost:8080/products/4` and passing the data `description=Macbook Air` which will be available in our handler via `request.payload`.
Open `localhost:8080/products` in the browser and you should see the updated description for the product with the id of 4.

[source code](https://github.com/joshuacolvin/hapi-tutorial/tree/step-8)

## Deleting a product

Let's wrap up by implementing the `delete` route which will allow us to... delete an item:

```javascript:title=routes.js
module.exports = [{
    ...
}, {
    method: 'DELETE',
    path: '/products/{id}',
    handler: Products.delete
}];
```

Once again we will need to define that `handler` for this route:

```javascript:title=handler/products.js
exports.delete = function(request, reply) {
  if (products[request.params.id - 1]) {
    products.splice(request.params.id - 1, 1)
  }
  reply(products)
}
```

With our server running, we can test our `delete` route using curl once again:

```shell
curl -X DELETE localhost:8080/products/2
```

Open `localhost:8080/products` in the browser and you should see that product 2 has been deleted!

[source code](https://github.com/joshuacolvin/hapi-tutorial/tree/step-9)

## Wrapping up

Hopefully you now feel comfortable creating a simple REST API with hapi. This post just scratched the surface as there is alot more that you can do with hapi.
A good next step would be to try integrating [plugins](https://hapijs.com/plugins) or swapping out `products.json` for a real backend like [MongoDB](https://www.mongodb.com).
