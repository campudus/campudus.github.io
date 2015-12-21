---
title: Spraying with style
---

In 2013 we had to implement some spraying functionality for an interactive presentation. It should show potential customers how their spray compared to others. While their spray is working reliable, fast, covers everthing and doesn't drop, the other spray doesn't cover as well and produces a lot of drops.

When we were trying to find some spraying tool that emulates drops, we were out of luck. Instead, we had to implement something like this ourselves. It's actually quite easy to draw a regular spray - basically just a few random spots around your fingertips - but creating drops that run down while spraying is quite challenging.

## Implementation

The initial spray was really just a big load of JavaScript and more or less only trial and error until we had something that worked for the presentation. Since then we wanted to create a nicer solution: Something testable and usable as a library.

Let's start from scratch with an empty canvas that fills our whole page.

```
<!DOCTYPE html>
<html>
<head lang="en">
  <meta charset="UTF-8">
  <title>Dropping spray</title>
  <style type="text/css">
    html, body {
      padding: 0;
      margin: 0;
      height: 100%;
    }

    #spray1 {
      height: 100%;
    }

    canvas {
      background-color: #eee;
    }
  </style>
</head>
<body>
<canvas id="spray1"></canvas>
</body>
</html>
```

As you can see, the HTML is really basic as most of the stuff is done in JavaScript.
