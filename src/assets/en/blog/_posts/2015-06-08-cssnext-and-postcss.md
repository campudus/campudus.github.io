---
title: CSSNext and PostCSS
description: Evaluation of CSSNext.
date: 2015-06-08 13:35:00
tags:
- fun friday
- cssnext
- postcss
- evaluation
- css
- intellij
---
Looking at [CSSNext](http://cssnext.io/), it's really just that: Code future-proof CSS from the latest W3C specs. For example, the new syntax for [custom selectors](http://dev.w3.org/csswg/css-extensions/#custom-selectors) helps to get rid of a lot of boilerplate code. The general recommendation seems to be that you use it in conjunction with [PostCSS](https://github.com/postcss/postcss).

PostCSS is a plugin based CSS post processor, which takes the code and converts it through some filters into CSS that current browsers understand. There are tons of modules which can [create vendor prefixes](https://github.com/postcss/autoprefixer), [flatten nested rules](https://github.com/postcss/postcss-nested) and a lot of other things that the CSS specification doesn't cover.

The concept is quite nice and it does what it promises. On top, it compiles faster than preprocessors like SASS/Compass. The biggest problem for us is just that our IDE (IntelliJ) doesn’t understand the latest CSS specs yet. So when you write in this specification, IntelliJ throws syntax errors and won't be able to help like it does with current CSS features. For us, this means that we won't use this technology until it's a bit more stable in our development tools. We'll wait for a plugin or an update for our IDEs.
