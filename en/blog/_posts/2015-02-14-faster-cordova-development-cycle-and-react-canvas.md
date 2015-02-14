---
title: Faster Cordova development cycle and React-Canvas
description: We wanted to try something out and ended up with a more productive development environment.
date: 2015-02-14 19:15:00
tags:
- fun friday
- react
- canvas
- programming
- development
- cordova
- gulp
- build tools
---
The last few weeks, many newsletters were full of Facebook's [React.js](http://facebook.github.io/react/). There were some cool talks about [React Native](https://www.youtube.com/watch?v=KVZ-P-ZI6W4) at [React.JS conference](http://conf.reactjs.com/). React is something we had on our list for quite some time and really wanted to check it out. As React Native is not open source / available for us yet (as of 14th February 2015), we went with [React Canvas](https://github.com/Flipboard/react-canvas), which was unveiled this week by Flipboard with an [introductory blogpost](http://engineering.flipboard.com/2015/02/mobile-web/).

## Trying React with an old web app

Our initial goal was to see how React-Canvas works out with something "simple" like a pager in a web application. One of our projects was a Cordova app with a side-scrolling and snapping view. This view was never 100% smooth and we need to fix some other things in it in the near future anyways, so we decided to have a look at it.

A little background about the project itself: We never really used a build tool for it. We built it in a basic web view, hit refresh when we changed something and when we were almost done, we started using real devices without any fancy live reloading or similar. It worked, but it was a pain to fix bugs later on and have such a long turnaround time for development, when looking at the native parts.

When you start using React, you can either write all of your templates in pure JavaScript or you have a mix of JavaScript and XML (with file extension`.jsx`), which needs an extra build step in your setup. As almost all examples feature `.jsx` and they look way better than using the plain JavaScript solution, we wanted to take the `.jsx` route.

As the code of our project was still missing a build tool, we decided to put one around it. No [Browserify](http://browserify.org/), [SCSS](http://sass-lang.com/guide) and not precompiling the `.jsx` files would be a real pain to work with. So the first task was to update everything and use [Gulp](http://gulpjs.com/) as a build tool, to simplify and accelerate development. The second task is to integrate React-Canvas and try to replicate the view that we had with it.

Due to time constraints and an open issue, we didn't really work on React-Canvas yet and just set everything up to be able to work with it. Hopefully we get around to dive deeper into React Canvas at another fun friday to blog about it.

## Setting up a live reloading web-app

Searching for `gulp cordova livereload` yields a few good blog posts how to achieve this - trouble is that the ones I looked at had a lot of boiler-plate code in their builds for things we never use or need. Or they used [ionic](http://ionicframework.com/), [PhoneGap](http://phonegap.com/) or similar frameworks/tools that support livereloading out of the box.

### Basic concept of live reload

The basic idea is to make changes in your source folders and get the `www` directory updated automatically. When any of these files in `www` changes, the Cordova app should automatically reload.

In web development, you use a solution like [livereload](http://livereload.com/). It injects a script into the `<head>` tags with a `src="http://localhost:35729/livereload.js"`. This will create a connection with the client that informs it whenever something changed. When the client receives such a command, it reloads the current website.

### What about Cordova?

In Cordova, we don't have a live reload / refresh. You can use the command `cordova serve` to create a static server that serves the files present in the `platforms/ios/www` (or `platforms/android/www` etc.). In order to get the files from your development `www/` directory, you refresh the files in the `platforms/<platform>/www` folder. This can be done manually by doing executing `cordova prepare`.

You could now put a basic "reload" button in your app to reload the page and it would show you the new version of the page as long as `cordova serve` is running in the background.

To make the app refresh automatically, it needs to reload itself on changes like described in the basic concept of live reload.

Thankfully there are plugins for Cordova to handle this as well as Gulp and [Node.js](http://nodejs.org/) modules that help us to simplify these steps.

### Server side

First of all, we need to set up the auto refresh on the server side: Whenever something changes (which in turn changes `www/`), we need to run `cordova prepare` to get the changes on the various platforms we target. When this is done, we need to tell the live reload server that something changed and this will tell the client. `cordova serve` can run in the background in another terminal.

To get a livereload server at all, we added the [gulp-livereload](https://github.com/vohof/gulp-livereload) plugin to our build file and added a new task. The new task called `liveReloadServer` starts the server for `livereload.js` and watches for changes in our sources. Whenever it sees a change, we need to build the new `www/` folder and run `cordova prepare` again. For simplicity, we just depend on a task that depends on our default task.

We encountered a problem when watching for file changes and executing tasks: It seems like the dependencies of tasks are run in parallel which led to bugs in our auto refresh: The version right before the newest change was presented to us most of the time, thus we built the dependent tasks on top of each other (see the definitions below for the `prepareAndReload` and `prepare` tasks).

```
// Run the default task initially and start the live reload server
gulp.task('dev', ['default'], liveReloadServer);

// reloader just pings the liveReload server and depends on the cordova prepare call
gulp.task('prepareAndReload', ['prepare'], reloader);

// runs 'cordova prepare' after rebuilding the whole 'www/' folder
gulp.task('prepare', ['default'], cordovaPrepare);

var liveReload = require('gulp-livereload');

function liveReloadServer() {
  liveReload.listen();

  gulp.watch('src/static/**', ['prepareAndReload']);
  gulp.watch('src/js/**', ['prepareAndReload']);
  gulp.watch('src/scss/**/*.scss', ['prepareAndReload']);
}

function cordovaPrepare() {
  return gulp.src('')
    .pipe(shell(['cordova prepare']));
}

function reloader() {
  return gulp.src('')
    .pipe(liveReload());
}
```

### Client side

To get live reload on the client (the device or emulator), we used a Cordova plugin called [gapreload](https://github.com/fingerproof/cordova-plugin-gapreload). Itneeds to know the ip and port of our static file and livereload server. The livereload server is usually set up on port 35729 and if you use `cordova serve`, the static server port should be 8000. When starting up the app, it will ask for the host and port of the static server and use the same host for the livereload. It won't ask again until you close and restart the app, so try to leave the livereload server running. If it would try to use `localhost` and not the ip of your development machine, it would try to access not existing servers on the device or emulator itself.

As the plugin really does everything for us on the client side, there is no extra code than adding the plugin itself by executing:

```
cordova plugin add pro.fing.cordova.gapreload
```

## Retrospective

To recap a full day of back and forth (especially because of that subtle concurrency issue in Gulp) of working with build tools: We now have a working live reload and pretty fast development cycle for cordova apps in place.

We didn't really want to work on that during a fun friday, but in retrospective, this wasn't really so bad at all: Understanding more about the internals of live reload and gulp helps us for every new project. It was good to see that most of the other things we set up with Gulp worked really well. Compiling `.jsx` files in conjunction with Browserify (using [reactify](https://github.com/andreypopp/reactify)), copying assets and creating CSS from SCSS was very easy to do.

We have a `src/assets` folder for all our "real" files, `src/scss` for SCSS and `src/js` for both our application files and the React templates. The `www/` folder is our output directory for Cordova and won't be changed by us manually.

Here is a gist of the full build file for the stack "Cordova + SCSS + ReactJS + Browserify": https://gist.github.com/Narigo/1eaaab5c4a911dec7846

Even though Gulp took most of our time, we could check out React Canvas locally a bit. We ran into some really weird performance issues, when not doing exactly the same thing as done in their example. In the end of the day, Max' [filed an issue](https://github.com/Flipboard/react-canvas/issues/25) about this weird behavior and it already got fixed. We didn't get around trying it with the fix applied yet, but we're pretty sure we will be able to see improvements when we try it out again.