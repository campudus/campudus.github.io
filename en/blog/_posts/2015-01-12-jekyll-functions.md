---
title: Jekyll functions
description: How to use Liquid templates as functions for Jekyll
date:   2015-01-12 17:55:00
tags:
- jekyll
- liquid
- programming
- development
- hacks
---

Jekyll is a nice tool to use for GitHub Pages. Anyways, after playing around with it a bit, we've seen quite a few limitations. To get around them, you either start creating some plugins or you start using some hacks.

One of these hacks is to create "functions" through Liquid's `include` feature.

## Seeing the need

A lot of things are not given by Jekyll or you need to repeat information in the front matter in each file. Usually you want to avoid this and use variables instead. In some cases you need to calculate these variables first, by using different values.

A basic example is our multilingual setup. We needed a way to calculate an id based on the file name and other properties. We used it to fetch the appropriate links to the different languages.

## How to do it?

First of all, you should create a subdirectory inside your `_includes` directory to differentiate your functions from your regular html includes. We called it `fn` to have a short name as reference (we intent to use functions a lot, so we want to save some typing here). Inside that directory, we create a new text file that we use to calculate our values with, in our case, we named it `get-id-of-page.lq`.

To get the result of our function, we can call it like this in the file where we need it (in our case `_includes/footer.html`):

{% raw %}
```
{% capture functionResult %}{% include get-id-of-page.lq page=page %}{% endcapture %}
```
{% endraw %}

This way you'll end up with the included filename inside a ready to use string called `functionResult`.

The contents of `get-id-of-page.lq` look like this:

{% raw %}
```
{% capture fnRes %}
{% if include.page.id == nil %}

{% if include.page.idPrefix != nil %}
{% capture name %}/{% include fn/name-without-extension.lq page=include.page %}{% endcapture %}
{{ include.page.idPrefix }}{% if name != '/index' %}{{ name }}{% endif %}
{% else %}
{% include fn/url-without-current-lang-and-extension.lq page=include.page %}
{% endif %}

{% else %}

{{ include.page.id }}

{% endif %}
{% endcapture %}{{ fnRes | strip_newlines }}
```
{% endraw %}

The code inside the capture is pretty straight forward. We check if an id was manually set up - this overrides any calculation through the `else` part that outputs `include.page.id`. If it does not have an id set up, it checks if it finds any `idPrefix` set up in the front matter (we set these in the `_config.yml`, if we want the urls to change in German / English. For example we have `/en/products/some-project/` and `/de/produkte/some-project/`, so the idPrefix is set to `products` in the German case, to match the default English id.

There is a special case if the id calculates `products/index` - we don't want the `/index` part, so it won't be added to the `idPrefix`. In the case where we don't have an `idPrefix` set up, we will just assume that the complete url without the language part will be the identifier for our page.

## Keeping the code clean

You see that we include other functions inside this code to help us to keep our code cleaner than having everything in a single file.

We want the string results to match something like `/index` without any spaces or line breaks. To get there, we don't use spaces for formatting and strip all line breaks by using this template around our code inside the functions:

{% raw %}
```
{% capture fnRes %}
... some stuff ...
{% endcapture %}{{ fnRes | strip_newlines }}
```
{% endraw %}

If we wouldn't do this we'd need to put everything into a single line, which would be very hard to maintain.

Using Jekyll on GitHub pages, you can find its limitations pretty fast. Anyways, with hacks like this you can work around a few of them.