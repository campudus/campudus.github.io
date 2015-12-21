---
title: Signing with Pixi
description: 
date: 2015-10-02 10:30:00
tags:
- fun friday
- graphics
- html5
- pixijs
- signaturepad
---
For a customer project, we have to let people sign a contract digitally. 

Think about the annoying experience when you sign for a package delivered by some postal service. While you move the pen on their small screen, it recognizes only a few dots and the end result doesn't look like your regular signature at all. This is something we really don't like and want to change. We know that in a native app, we can draw pretty smooth, but what about solutions for webpages?

## Using touch events to draw

A naive implementation would be to just track mouse or touch moves and draw them on a canvas. This would look something like this:

![Showing touch points only]({{ site.url }}/assets/blog/signing-with-pixi-circles.png)

As you can see, the touch points the browser detects are not always right next to each other. The triggered touch events are not as responsive as you might wish.

## First attempt with linear interpolation

To fill the gaps between the recognized touch points, we can simply connect them through a line:

![Linear interpolation]({{ site.url }}/assets/blog/signing-with-pixi-lines.png)

It's obvious that this linear interpolation still doesn't really look like a signature. The lines need to be smooth and look more like curves. To get there, we can use [spline interpolation](https://en.wikipedia.org/wiki/Spline_interpolation), which uses a lot of calculations to draw a curve through the lines - you "just" need to draw them pixel by pixel. 

## Signature pad for spline interpolation

Szymon Nowak already made something like that with [Signature Pad](https://github.com/szimek/signature_pad). It also contains logic to differentiate a fast movement from a slow movement by calculating the distance and time of the touch points, which makes the signature a lot smoother. While Signature Pad looks great on a desktop, it has problems on mobile devices that have less performance. The problem is, that it calculates everything while drawing. In JavaScript, where you only have a single thread, this may block touch events and results in more missed points.

## Putting it all together

Luckily, the Signature Pad project is open-source, so we could have a look into it and use the code for the spline interpolation and line weights. To get more performance out of it, we made two major changes to it:

1. We changed the renderer to use [PIXI.js](http://www.pixijs.com/), a high-performance graphics framework used in HTML5 games that defaults to WebGL and falls back to Canvas drawing.
2. Our app doesn't do the heavy calculations needed for the spline interpolation while drawing. As long as a mouse or touch move is detected, we use simple linear interpolation (drawing lines between touch points) and save them into an array. As soon as the touch or mouse movement is over, we calculate and draw the curves over the saved points during `requestAnimationFrame()`. If another touch or mouse movement is detected, it waits with the next calculations until it's over again.

We also need to use the "animated" way of drawing to be able to stop the necessary calculations if a movement occurs. Otherwise, it wouldn't recognize the next points again as we've seen during our experiments.

To highlight the two-step signing, we have different default colors for drawing the linear and the spline interpolation in our [signing demo](http://campudus.github.io/ff-pixi-signing/), to show the two involved steps. You can also [check out the source code for this project](https://github.com/campudus/ff-pixi-signing).
