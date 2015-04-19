---
title: UX Concepts
description: A small project to try out smaller UX components
date: 2015-04-16 21:00:00
tags:
- fun friday
- ui
- ux
- jquery
- development
---
During our latest fun friday, we looked for cool UX components and tried out how to implement them ourselves. As we had a lot less time than expected this time, we didn't really manage to get something super cool to show off. But since fun friday is more about learning and thinking, let's see what we thought about and what we could achieve.

We had two ideas for nice components: One about a whole page design for portfolio items or project pages and another one for loading images into an overlay.

## The setup

First of all, we started a new project that builds SCSS and browserifies our JavaScript on the fly. As it's more or less a copy and paste of one of our other project, it is also set up to contain tests. We didn't include any during our fun friday as we're trying out different effects, how they look before settling on something.

## Seamless image loading

There are a lot of occasions where you need to load a full-size image in a lightbox. Most of the time, you click on a thumbnail, a progress spinner appears and when the image is loaded, the lightbox appears. Yes, that's nice asynchronous loading and it will only fetch the needed data if the user asks for it. But still, this doesn't really feel user friendly: No progress bar and even if there are animations, the user won't be able to see anything else than a progress bar.

We managed to get a small proof-of-concept working for the seamless image loading. To check out the source, clone the [Gorilla Grid repository](https://github.com/campudus/ff-gorilla-grid) and, after installing the various packages needed to build everything (SCSS, etc.) with `npm install`, you can run it by typing `npm run dev`. Browser-Sync will open a browser window on a locally set up server. When looking at the image loader page on that server, you can see an example of the seamless image loading. The file `image-loader/scss/_progressiveZoom.scss` sets all the styling and CSS3 transitions to let the image load look smooth.

Right now, the animation while scaling the image is still a bit laggy. There are a few hacks to get this more smooth but we didn't have a deeper look into this issue yet. Maybe we can find some time where we can try out various hacks.

To get the progress bar done, we had to load the image via XmlHttpRequest and inject the resulting image data into the image `src` property directly. Otherwise we won't have the possibility to check how much we have loaded yet. The progress bar is just a single, absolute positioned div with the width of the progress.

## Grid layout

It's nice to work with tiles on responsive sites and many pages use them to display their portfolio or product pages. If you want to put some more content into a tile, they may not always have the same height and thus look pretty chaotic.

To compensate this, we can set the same height to the tiles and, when scrolling down, the tiles could scroll automatically. When all tiles are done scrolling, we can scroll to the next "page" with other tiles. Bullets on the side could be used for faster navigation.

We didn't manage to finish something to show yet but the real challenge lies in a good CSS fallback and the synchronized scrolling when you can see multiple tiles.

Let's see if we are able to add some more to this repository in the future.
