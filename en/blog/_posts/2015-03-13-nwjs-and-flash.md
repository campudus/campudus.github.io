---
title: NW.js and Flash
description: Trying out web technologies in conjunction with Flash for a new POS.
date: 2015-03-15 00:15:00
tags:
- fun friday
- node-webkit
- io.js
- programming
- development
- setup
---


During the first fun friday in our new office, we tried out [NW.js](http://nwjs.io/) (formerly known as node-webkit). We wanted to see whether we could use it to develop the next generation of the [DealerCenter e-Retail system](http://www.dealercenter.de).

## What is NW.js good for?

NW.js wraps a whole web-app into a desktop application and allows us to interact with the [Node.JS](https://nodejs.org/) or since a few days [io.js](https://iojs.org/en/index.html) API. This enables us to read and write files, use NPM modules and still have our web views as a GUI.

So pretty much a solid base for a company like us that specialized in web-technologies: Nice GUIs are possible as we already have on web-pages and sandbox restrictions can be circumvented by using native APIs and modules.

But before being able to start hacking, we need to install NW.js on our machine.

## Installation

On all operating systems, the installation should be pretty much straight forward. Download and install NW.js, then add it to your `PATH` variable.

Note for Mac OS X: If you installed it into the `/Applications` folder, you will find the real binaries in `/Applications/nwjs.app/Contents/MacOS/`. To add it to `$PATH`, run the following command:

```sh
echo 'PATH="$PATH:/Applications/nwjs.app/Contents/MacOS/"' >> ~/.bash_profile
```

After starting a new terminal window, you should be able to access `nwjs` from the command line.

## Basic usage

Just like shown in [NW.js Readme](https://github.com/nwjs/nw.js/blob/master/README.md#quick-start), you simply need to provide an HTML file that may use the Node.js API inside of `script` tags and put a `"main": "your-file.html"` key/value pair into your `package.json` file. If you start NW by calling `nwjs .` inside the directory where you have the HTML and the manifest file, it will use the information from the `package.json`-manifest and wrap all of your content into a desktop app.

No need for anything extra fancy to set up, just let it settle: You now have a website with the complete power of Node.js APIs. Use I/O directly, circumvent sandbox, do other cool stuff with the full power of your computer.

## Trying to talk with flash

There is one other thing that we need to be able to use NW.js for future development: We rely heavily on [Adobe Flash](https://www.adobe.com/de/products/flash.html) as one of our designers is extremely productive with this tool. As long as we have the power of a real computer backing it, it makes more sense for us than using HTML everywhere: If someone can build stuff faster with Flash and the end-user won't notice the difference, we can at least use it for a subset and then try to back it with the possibilities that NW.js gives us.

Our current approach with [SWF Studio](http://www.northcode.com/swfstudio.php) enables us to download and process files inside of Flash. This works well for our Windows machines but it's not possible to use on any other OS. As we have mixed OSes on our development machines, it would be better to have something more portable. It should also help us, if we ever find the need to switch from Windows machines to something else.

### Setup trust for local files

In order to exchange data (or call functions) between Flash and browser, we first need to tell the Flash plugin, that it doesn't need a sandbox for our local files. We can do that by either writing the path of our Flash files into a special file that is read by Flash, or we can use a NPM module to do that for us. With the [nw-flash-trust](https://github.com/szwacz/nw-flash-trust) module (install via `npm install --save nw-flash-trust`), this is pretty straight forward. You can see its usage in [lines 6-23 of our Flash test-page](https://github.com/campudus/ff-nw-flash/blob/cb4e7adf5c1f31e42bf2096bd8ac72919541baab/page3.html#L6-L23).

The second step to exchange data is to be able to tell when the flash file itself is loaded. Basically there are a couple of options how to check if a flash object is fully loaded. You could use a `setTimeout()` to check if a function inside of Flash is available - if not, just re-schedule the timer. Another way is to poll for the percentage loaded by Flash. Both of these options have to poll and as there is a way without resorting to polling, we went that route:

### Exchanging data through `ExternalInterface`

Create a global function that acts as a callback to Flash and will be called from inside Flash as soon as the Flash object is completely loaded. We've called that function [`onFlashLoaded`](https://github.com/campudus/ff-nw-flash/blob/cb4e7adf5c1f31e42bf2096bd8ac72919541baab/page3.html#L65-L68) and we just tell it to start some easy script that increments a counter and provides it value to Flash via a special function that we called `callFlashFunction` and registered in our Flash file.

The Flash file consists of a single movie clip with text field inside of it. The movie clip is called `someTextClip` and the text field `textInput`. The relevant code for the bidirectional communication is as follows:

```
import flash.external.ExternalInterface;

someTextClip.textInput.text = 'test4';

ExternalInterface.addCallback('callFlashFunction', null, yourFlashFunction);
ExternalInterface.call('onFlashLoaded', true);

function yourFlashFunction (arg1) {
  someTextClip.textInput.text = arg1;
}
```

As you can see, it will call the global function `onFlashLoaded` as soon as the ActionScript code runs. It also registers a callback that can be called with data from our JavaScript.

## Clone for easy messing around

And that's it already. With this simple approach, we are able exchange data between Flash and your NW.js application. The next steps will be to use a build script and see whether SCSS compilation, browserify and testing will be easy to use and see if live reloading would be possible in NW.js, too. Check out the [newest master](https://github.com/campudus/ff-nw-flash) of the repository for a template with a build script or see the very basic example in this [commit](https://github.com/campudus/ff-nw-flash/tree/cb4e7adf5c1f31e42bf2096bd8ac72919541baab).
