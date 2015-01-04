---
layout: post
title:  "Fun Friday: First impressions of Jekyll"
date:   2015-01-02 09:53:16
tags:
- fun friday
- jekyll
- learning
---

Our first fun friday this year was all about Jekyll. We've been thinking about converting our current web page into a static site for quite some time, but we didn't have the time to evaluate nice frameworks until today. It always takes a bit of time to understand the concepts of a framework, so a fun friday is a good way to start looking deeply into it.

What follows are our first impressions. At the time of writing, Jekyll's version is 2.5.3.

## General considerations

GitHub has Jekyll integration with its hosting service GitHub Pages. This is something really nice, as you don't have to find a hoster for your source and binaries and just upload the sources to GitHub and let it do the rest.

## Setting up Jekyll

### Linux and Mac

For Linux and Mac it’s pretty straight forward because of the official support. You need the following requirements on your system:

- [Ruby](http://www.ruby-lang.org/en/downloads/)
- [RubyGems](http://rubygems.org/pages/download)
- [NodeJS](http://nodejs.org/) (optional, for CoffeeScript support)
- For OS X, the Xcode and the Xcode Command-Line Tools are recommended by the official docs.

Detailed information can be found on the official [Jekyll documentation](http://jekyllrb.com/docs/installation/).

To install it you just have to run

```
$ gem install jekyll
```

and you are ready to go.

#### Possible permission issue on a Mac

If you haven't set up a local ruby environment for your Mac yet, you may encounter the following error:


```
$ gem install jekyll
ERROR:  While executing gem ... (Gem::FilePermissionError)
    You don't have write permissions for the /Library/Ruby/Gems/2.0.0 directory.
```

This means that it tries to install the gem into a system folder. You should fix it by creating your own ruby installation into your home folder. The tool [rbenv](https://github.com/sstephenson/rbenv) manages this local installation for you and you can easily install it via [homebrew](http://brew.sh/):

```
$ brew update
$ brew install rbenv ruby-build
```

After installing rbenv make sure to add the following line into your `~/.bash_profile` file, so it will use the local ruby environment as a default:

```
eval "$(rbenv init -)"
```

When you start up your terminal the next time (or open a new tab), you shouldn't need to install gems into system folders anymore and the `gem install jekyll` command should succeed without permission errors.

### Windows

Setting up Jekyll on Windows is a bit more work than Linux or Mac. Windows is not officially supported and setting it up is not really straight forward. To get Jekyll up and running, you need to have Ruby (for Jekyll) and Python (for Jekyll's default syntax highlighter) installed.

There is a nice blog by [@juthilo](https://twitter.com/juthilo) at [jekyll-windows.juthilo.com](http://jekyll-windows.juthilo.com/) that explains every step very detailed. It also gives a hint that you may not need the Python/pygmenter dependency, but if you want to have the same setup like GitHub Pages and syntax highlighting, we recommend installing it.

#### Installing Ruby

1. Download and install Ruby from http://rubyinstaller.org/downloads/ and check “Add Ruby executables to PATH” during installation, so ruby will be available in your terminal.
2. Download and Install the associated RubyDevKit Version from http://rubyinstaller.org/downloads/. The DevKit is needed to build native extensions that Jekyll needs. You can find more information at
3. Now you need to configure RubyDevKit to use the correct Ruby version with these commands (assuming you installed RubyDevKit into `C:\RubyDevKit`):
{% highlight bash %}
cd C:\RubyDevKit
ruby dk.rb init
ruby dk.rb install
{% endhighlight %}
Now you should verify that `C:\RubyDevKit\config.yml` contains the correct path to Ruby.

#### Install Python for syntax highlighting
1. Download and install [Python](https://www.python.org/downloads/) to be able to use pygments, the default syntax highlighter for Jekyll.
2. Add Python to the systems `PATH` environment variable
3. Add the line `highlighter: true` to the `_config.yml` file in jekyll, to enable syntax highlighting. Otherwise you may end up with an error similar to the following:

```
Liquid Exception: undefined method `[]' for nil:NilClass in _posts/2015-01-02-welcome-to-jekyll.markdown
```

#### Install Jekyll
1. Install Jekyll via `gem install jekyll`
If you encounter an SSL error during installation, you might have hit a problem with SSL certificates. Please have a look at this [Ruby SSL guide](https://gist.github.com/luislavena/f064211759ee0f806c88) for more information and how to fix it.
Some people recommend to just install the gem via HTTP by adding the option `--source http://rubygems.org` to the `gem` command. From a security perspective, you should really avoid doing that, as you may download and execute code from an unverified source.
2. Start jekyll via `jekyll serve`


## Digging Deeper into Jekyll

Jekyll is made for blogging and simple websites. We wanted to see how flexible and powerful Jekyll really is so we tried out some advanced techniques.

### Using custom post types

By default there are two post types: static pages and blog posts. What if we wanted something like portolio objects?

Introduced in v2.0, Jekyll is able to do this and its called [collections](http://jekyllrb.com/docs/collections/). At the time of writing, the feature is still experimental and marked as unstable by the Jekyll team. Anyway, we had to try it out and see how it works.

The first step is to add the collection in the `_config.yml`:

```
collections:
  projects:
    permalink: /projects/:path/
    output: true
```

This adds a collection called `projects` which expects the documents for the collection in the directory `_projects`. The `permalink` option let you specify how the URLs for the collections should look like. With `output` set to `true`, Jekyll will render each site in the `projects` collection as an independent file.

Collections can be accessed by using the Liquid templating syntax. If you want to access the `projects` collection in ` _projects` folder use the `site` Liquid variable `site.projects`.

```
{% raw %}
{% assign pages = site.projects | sort: 'order' %}
{% for page in pages %}
  {% if page.title %}
    <li class="{{ page.name }}"><a class="page-link" href="{{ page.url | prepend: site.baseurl }}">{{ page.title }}</a></li>
  {% endif %}
{% endfor %}
{% endraw %}
```

This code snippet will render a list of all projects with a link to the corresponding project page.

### Multiple Layouts

We tried to find a way to generate the same page in multiple layouts. For example generating a big HTML file and a smaller AJAX file, that contains only the body of the big HTML file. When looking for a solution, we found a small plugin called [jekyll-multipost](https://github.com/saclark/jekyll-multipost), but it didn't fit for us because of two things:

1. It seems that it only works with posts and no other pages like the `_projects` type we're planning.
2. It will probably not work on GitHub pages, as GH only allows a few whitelisted plugins.


### Using your own URL/Domain for a github page

Refer to: [https://help.github.com/articles/setting-up-a-custom-domain-with-github-pages/](https://help.github.com/articles/setting-up-a-custom-domain-with-github-pages/)
And be aware of a possible mail problem: [http://imakewebthings.com/blog/github-pages-email/](http://imakewebthings.com/blog/github-pages-email/)

### Making Jekyll multilingual

Here is a great article which covers this topic pretty well: [http://sylvain.durand.tf/making-jekyll-multilingual/](http://sylvain.durand.tf/making-jekyll-multilingual/)

## Javascript alternatives for Jekyll

At Campudus we use JavaScript quite often, so we researched some alternatives written in Javascript with Node.JS. Here are some of the most promising ones we found so far:

- [http://brunch.io/](http://brunch.io/) - Looks a lot like a really simple build tool for web pages.
- [http://hexo.io/](http://hexo.io/) - Looks like Jekyll for JavaScript. We will probably try it out soon, but as there is no native support in GitHub, it means to have a separate source and "binary" branch.
