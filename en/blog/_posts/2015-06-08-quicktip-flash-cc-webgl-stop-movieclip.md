---
title: QuickTip&#58; Flash CC WebGL stop movieclip at specific frame
description: A handy function to stop the animation of a Flash CC WebGL movieclip
date: 2015-06-08 13:30:00
tags:
- fun friday
- Flash
- HTML5
- WebGL
---
During one of our fun fridays, we did some research with the Flash CC Tools to create HTML5 content out of the IDE. When working with the WebGL Runtime API we realized that it’s still limited regarding movieclip animation. Since you’re not able to write any code in the timeline like `stop();` and the API doesn’t give us any function, we did implement it ourselves. 
We’d like to share this handy function to stop a movieclip at a specific frame:

```
/**
 * Stop the movieclip at a specific frame or at the end of the animation.
 * @param mc The movieclip to stop
 * @param stopFrame(optional). When missing, the animation stops at the last frame
 */
function stop(mc, stopFrame) {
  var ENTER_FRAME = flwebgl.events.Event.ENTER_FRAME;
  mc.addEventListener(ENTER_FRAME, onEnterHandler);
  //stops event handling when looping
  var lastFrame = 0;
  var totalFrames = mc.getTotalFrames();

  function onEnterHandler(e) {
    var currentFrame = mc.getCurrentFrame();
    //Stop at the end of the animation when no frame is given
    if (currentFrame == totalFrames || currentFrame == stopFrame || currentFrame == lastFrame) {
      mc.removeEventListener(ENTER_FRAME, onEnterHandler);
      mc.stop();
    }
    lastFrame = currentFrame;
  }
}
```

Use it in any way you like.