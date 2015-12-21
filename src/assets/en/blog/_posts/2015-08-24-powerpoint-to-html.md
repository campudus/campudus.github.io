---
title: Converting Powerpoint to HTML
description: 
date: 2015-08-24 10:30:00
tags:
- fun friday
- showroom
- powerpoint
- html5
- ispring
---
We always try to give our customers the best user experience and provide easy ways to create new contents for their [Showrooms](http://www.your-showroom.com).

On one of our latest fun fridays, we evaluated solutions to convert Powerpoint files to HTML. Powerpoint matured to a great tool to create interactive presentations. If customers are able to create such content themselves and don't need a contractor to implement it in HTML, they save a lot of time and money. Such opportunities are a good reason for us to search a nice solution for them.

After evaluating various tools and SDKs that promise to convert Powerpoint to HTML, we found [iSpring Solutions](http://www.ispringsolutions.com/ppt-to-html) who have a pretty good plugin for Powerpoint available. Their plugin even converts most animations to usable HTML code.

## Flashes on slide change

One problem we found on tablets were flashes when switching slides for the first time. Our customers expect something better from us, so we searched for a fix for these flashes. Luckily, we found a way to prevent this flickering from happening.

While debugging the flashes, we saw that the flickering occurs due to dynamical loading CSS on slide changes. On tablets, asynchronous loading of CSS files takes a bit longer and leads to the flashes. The easiest fix is to preload the CSS and have it available without reloads.

## Fixing the flash through a script

To mitigate this problem, we implemented a small script: In short, we take the resulting `index.html` file from iSpring and inject all CSS files from the various slides as stylesheets directly into it.

So right now, our customers can convert their Powerpoint slides through the plugin and we run our script to fix the flashing.

In the end, they create their presentations with the tool they are used to and can use it in their Showroom.

As always, we like to give other developers the code we used to fix the problem. If anyone finds an even better solution, we're happy to accept pull requests at the [GitHub repository of our fix](https://github.com/campudus/ispring-builder-fix).
