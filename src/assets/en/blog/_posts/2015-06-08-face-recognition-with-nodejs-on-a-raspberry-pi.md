---
title: Face recognition with NodeJS on a Raspberry Pi
description: Trying out face recognition with NodeJS for the Raspberry Pi
date: 2015-06-08 13:45:00
tags:
- fun friday
- face recognition
- opencv
- raspberry pi
- node.js
---
We tried to find some use for a spare [Raspberry Pi](https://www.raspberrypi.org/) and an old webcam. The first half of our day went to the sink, trying to get a basic example of [node-opencv](https://github.com/peterbraden/node-opencv) running with the webcam. We could make the Raspberry take one, maybe two pictures but then it always rendered black images until we rebooted it or plugged the webcam out and in again.

Until we finally gave up on the webcam (we believe it just doesn't really work anymore - we couldn't get it running on our development machines either), we encountered a few things that we can share about our learnings.

### The Setup
As soon as you have an empty, formatted SD card, it's actually extremely easy to set up a running system. Just copy the [NOOBS](https://www.raspberrypi.org/help/noobs-setup/) image on the Raspberry by moving the unzipped image on the SD card. No special boot sector writing required, so no need for UNetbootin or similar tools. As soon as you boot it up again with a keyboard (and/or mouse) and monitor connected, you can simply click on the image you want to download / install.

Today we went with Archlinux, just because it's pretty fast to download and you don't clutter the Raspberry with more stuff than needed. After running the necessary system upgrades with `pacman -Syu`, moving the `/boot/*.txt.pacnew` files in the right place and rebooting, the Raspberry didn't start up anymore. Looks like the `.pacnew` files have overwritten some necessary configuration!

To fix this, we had to change a small thing in the file `/boot/cmdline.txt`, which we could edit through the machine we used to copy stuff on the SD card in the first place. There is a line with `root=/dev/mmcblk0p2` which we needed to change to `root=/dev/mmcblk0p6` in order to have the Raspberry Pi start again. Phew! Saved us some time setting everything up once more and didn't even destroy the data we put on the card through our updates.

### Build/compile of necessary libraries and programs
Building on the Raspberry Pi is slow. Having to build something multiple times and have them crash right in the middle due to missing dependencies is even worse. To get the Raspberry build the `opencsv` node module, we had to do a few steps:

1. ```pacman -S opencv```
To get us OpenCV itself. This installs quite some dependencies, not sure if everything was really needed, but it saved some time just pressing `ENTER` and let it install.
2. ```pacman -S nodejs npm```
Well, basically none of our projects can be done without it, so we'll just get it. In Archlinux, Node and NPM are two separate packages, so be sure to install both to be able to use npm as well.
3. ```pacman -S base-devel```
This gets us basic C compilers, make, etc. whatever is needed to build native packages. The node module wants to build some native bindings to OpenCV.
4. ```pacman -S python2```
Yep, some scripts that build things are written in Python. And be sure to use the `python2` package as it seems that `python` (= Python 3.x) is incompatible with these scripts. It will tell you anyways while compiling, but as we stated before, this just takes some time before you get that message...

After creating a node project with `npm init` and having all these dependencies (let's just hope we didn't forget anything in the list above…), we could finally `npm install --save-dev opencv` without errors.

### Using OpenCV
Great, now we just needed to use the OpenCV-binding in our JavaScript to blend some pictures. The problem is, that if you've never worked with [OpenCV](http://opencv.org/), you won't really know what's possible and how to do it. This was basically our case when we started with just a few hours left for coding. We just heard "use OpenCV - you can do anything with it" and wanted to give it a go.

We could apply the [face-recognition example in the node-opencv](https://github.com/peterbraden/node-opencv/blob/master/examples/face-detection.js) and see if it works. After seeing the initially mentioned problems with the webcam, we used one of our development machines (which happens to have a built-in webcam that works) to see how to use it. It worked actually pretty well with "just put me an ellipse over my face", but putting something over your face like a hat or sunglasses seems to be completely different in OpenCV than for example in drawing on a canvas in the browser.

We've pushed the prototype on our [ff-node-opencv GitHub repository](https://github.com/campudus/ff-node-opencv), but please don't expect too much. It cuts out the face of the 10 pictures it takes from the webcam, puts a silly mask on it and writes a new file for each of these images. We couldn't really find out how to draw the mask on the image when you just have some matrices to use. So if you want to do something with OpenCV, try to have a look at examples in other languages and see how this translates into JavaScript. We didn't and nothing made sense during the two hours or so we had time to look at it.

If you're interested in doing some image processing stuff, maybe something like this [OpenCV tutorial page](http://www.tutorialspoint.com/java_dip/dip_quick_guide.htm) helps you to get started with it. We should definitely have a deeper look into it, as there are a lot of examples and we could probably use  the "watermarking with image" example as our starting point in putting masks on faces. We know the coordinates of the faces, so it should "just" be some translating the example into JavaScript.

### Something we found during our journey: js-objectdetect
Another very promising browser library we found for face-recognition was [js-objectdetect](https://github.com/mtschirs/js-objectdetect). Trying out glasses in the browser is a great example. The problem with this is just that we wanted to do the processing on the server side, without access to a browser. Using a Raspberry Pi, we don't really have access to all these nice methods like `ctx.drawImage()` etc. So even though this is probably a really cool library to use for a [node-webkit](https://github.com/nwjs/nw.js/) project, in the Raspberry setup we couldn't use it.

Anyways, we're always learning during fun fridays. This time we can conclude that image processing on the server side seems to be still a hard task that doesn't provide us too many high-level abstractions for our use-cases. And something we already knew: We're a software company - handling hardware is never easy for us :)
