---
title: Node.js Workshop
description: Just a little reminder about what we did during our last fun friday learning Node.js basics
date: 2015-03-30 06:00:00
tags:
- fun friday
- node.js
- workshop
---
We are using fun fridays to learn new things. As not all of our team members were aware about the possibilities of Node.js yet and most of our ideas were about "doing something with Node.js", we decided to start the day with a workshop.

## The code

Like always, we set up a Git repository to be able to browse the code later. We tried to commit often to see each step later, but there have been a couple of questions which didn't make it into their own commit. Let's try to remember what we did and how we got to the final version of our repository.

* [`7e9b711 Add gitignore` **Initial layout**](https://github.com/campudus/ff-node-workshop/tree/7e9b711ae36dff9c59b2a1bcaa8b2bfe8c947d73)

    The first few commits were just adding a basic layout for the git repository and do not really have anything to do with the workshop itself, yet. Like always, we need some files added to `.gitignore`: For Node, we add `node_modules` as third party modules will be installed into this directory and we don't really want to clutter our repo with other plugins that we will download somewhere else anyways. More on Node modules later when we start using third-party plugins.

* [`dcee3ca Basic hello world + concat` **Basics**](https://github.com/campudus/ff-node-workshop/tree/dcee3ca6dd6c595224731f52050704b9cb2f6200)

    This commit shows how to write and start code with Node.js. It's easy to see that this really is some basic stuff, but also the problems that we may face when using dynamically typed languages. If we have a string and two numbers `a` and `b`, the code `'some string' + a + b` will result in string concatenation and not add `a + b`. We need to be aware of these pitfalls. To run the code, we just used `node helloWorld.js`.

* [`56dd7f9 Sync operation`  **Synchronous commands**](https://github.com/campudus/ff-node-workshop/tree/56dd7f95c3563a7afeb8d3c8be253ea80d92e3a7)

    We showed how to do basic scripting with synchronous commands. We had some interaction doing this which we obviously didn't commit, namely how we used `writeFileSync` and `readFileSync`. As we had files in the end of the commit and wanted to add new data to them, we used `appendFileSync`. All of these methods are pretty straight forward to use and are documented well at [the official Node.js File System documentation](https://nodejs.org/api/fs.html).

* [`7faef0d Callbacks` **Asynchronous / event-driven**](https://github.com/campudus/ff-node-workshop/tree/7faef0d72920692e14c444afce866b6aaaa0de5a)

    To be able to use non-blocking functions, we need to register callbacks. This differs a bit from regular imperative programming and you need to "look around" for your code or start having a "callback hell". Running the code shows that these callbacks are called after the main code was done (logging `fertig mit aktionen` before the output of the callbacks). It's also good to note that the order of the functions in the code doesn't matter here. You can put the `wrote` function before `read` and even declare them before doing anything in the main program. It doesn't matter where it is, the output would be in the same order as it is now.

* [`0b75ffb Simple 'module'` **Basic modules**](https://github.com/campudus/ff-node-workshop/tree/0b75ffb360899a792f07bf2dc72364522358eef6)

    The biggest plus in Node is the very easy to use module system. You can easily structure your code by using `require()`. We had a look at how to write our own little module in `calculator.js` and how to use it in `helloWorld.js`. To export functions from a module, we need to set `module.exports`. We can set it to whatever we want: It could be a constructor function, a value or an object that exposes multiple functions. We can export anything we want. In the commit, we set `module.exports` to a simple object that contains the addition and multiplication functions of our calculator module. To use that code, we `require('./calculator.js')` to get our local module. If we wouldn't use the `./` part, Node would search for an installed module and use that instead of the local file in our repository.

* [`024515d Start of express` **A basic Webserver example**](https://github.com/campudus/ff-node-workshop/tree/024515dd8ab32ecbac0ee7abc4d94d2061a65390)

    The next step after using a local module is to use a real third-party module. In the new file `server.js`, we have seen how to use the very simple API of [Express](http://expressjs.com/). We had to register a middleware to process a request and put a small static server for all other files in place. Then we started the server on port `8080` by using `listen(8080)` and tried out the routes we set up: `/` (or `/index.html`) and `/hello`. It's nice to see how easy to integrate third-party modules, just by using `require()`.

* [`9806869 Show off middleware` **More Express**](https://github.com/campudus/ff-node-workshop/tree/9806869f7c313fe8c3670eb7472f334ee8fe8926)

    There are actually two examples in this commit. First, we set up a router (namely `helloRouter`) that routes anything below `/hello`. All paths we set up in this router will have a `/hello` prefix now. After setting this up, we had a look at multiple routes that match a specific path (`/hello/olli`). We figured out that the order of the registration of the routes is critical: The first one that matches wins, so set up the more specific routes before "catching" routes.

* [`0b0ceb0 Add handlebars and show problems with sync` **Using handlebars templates**](https://github.com/campudus/ff-node-workshop/tree/0b0ceb0d2c8a231d5d7bfd22a5c4940ed0bd27b3)

    After seeing how express works, we wanted to see if we could do templating with Node.js as well. To show this, we used handlebars, which contains `{{variable}}` instructions inside simple strings. Handlebars replaces these strings with the contents of the specified `variable`. Using `Handlebars.compile()`, we receive a function where we pass the contents of the variables. As the compilation may take some time, we had a look at how we could cache the compiled templates. Using `setTimeout`, we mocked a long running asynchronous operation to get the template and had a look what happened if this produced an error. As you can see, we can take regular files and inject our variables into them.

* [`f96ae32 Use server.js as main` **Error handling and using npm to start our server**](https://github.com/campudus/ff-node-workshop/tree/f96ae3206d5e90d554e5948d2bd108602c280c28)

    A four parameter function as middleware handles errors in express. We had a look at when we had to register them and what the `next(err)` method means while doing error handling. After the workshop, we put `server.js` in `package.json` which basically means we can run the server we wrote by writing `npm start` now.

## Retrospective

We went through the whole workshop within two and a half hours, including a lot of interactivity/discussion and a couple of minutes talking about event-driven programming, how to deal with the callbacks, etc. When you think about it, this is pretty fast to get basic knowledge of a new technology. We talked a bit about the outlook of what else is out there and where we could go next. To get started, this little overview should suffice for now and help everyone to understand the scripts and Node.js applications that we already had. The remaining day, we went on to talk about Node.js and look at the different apps we've already written.

Too bad we couldn't make it writing a small app with Node this day, but getting more knowledge about it was fun, anyways. Let's see what we can do during our next fun friday!
