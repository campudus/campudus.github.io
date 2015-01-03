---
layout: post
title:  "Fun Friday: First impressions of Jekyll"
date:   2015-01-02 09:53:16
tags:
- fun friday
- jekyll
---


# Working with Jekyll

## First Impressions

Our first fun friday this year was all about Jekyll. We've been thinking about converting our current web page into a static site for quite some time, but we didn't have the time to evaluate nice frameworks until today. It always takes a bit of time to understand the concepts of a framework, so a fun friday is a good way to start looking deeply into it.

What follows are our first impressions. At the time of writing, Jekyll's version is 2.5.3.

## General considerations

GitHub has Jekyll integration with its hosting service GitHub Pages. This is something really nice, as you don't have to find a hoster for your source and binaries and just upload the sources to GitHub and let it do the rest.

## Setting up Jekyll

### Linux and Mac

For Linux and Mac it’s pretty straight forward because of the official support. You need the following requirements on your system:

[Ruby](http://www.ruby-lang.org/en/downloads/)
[RubyGems](http://rubygems.org/pages/download)
[NodeJS](http://nodejs.org/) (optional, for CoffeeScript support)
For OS X, the Xcode and the Xcode Command-Line Tools are recommended by the official docs.

Detailed information can be found on the official [Jekyll](http://jekyllrb.com/docs/installation/) website.

To install it you just have to run

```
$ gem install jekyll
```

and you are ready to go.


#### Possible permission issue on a mac
If you happen to encounter the following error on a Mac:


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
After installing rbenv make sure to add the following line into your `~/.bash_profile` file:
```
eval "$(rbenv init -)"
```

When you start up your terminal the next time (or open a new tab), you shouldn't need to install gems into system folders anymore and the `gem install jekyll` command should succeed without permission errors.

### Windows

Setting up Jekyll on Windows caused us some trouble. Windows is not officially supported and setting it up is not really straight forward. To get Jekyll up and running, you need to have Ruby (for Jekyll) and Python (for highlighting) installed.

#### Installing Ruby

1. Download and install Ruby from http://rubyinstaller.org/downloads/ and check “Add Ruby executables to PATH” during installation, so ruby will be available in your terminal.
2. Download and Install the associated RubyDevKit Version from http://rubyinstaller.org/downloads/. The DevKit is needed to build native extensions that Jekyll needs. You can find more information at
3. Now you need to configure RubyDevKit to use the correct Ruby version with these commands (assuming you installed RubyDevKit into `C:\RubyDevKit`):
```
cd C:\RubyDevKit
ruby dk.rb init
ruby dk.rb install
```

3. Check `C:\RubyDevKit\config.yml` for correct path to Ruby

```
gem install jekyll
```


During the installation of Jekyll we encountered the following error

```
ERROR:  Could not find a valid gem 'jekyll' (>= 0), here is why: Unable to download data from https://rubygems.org/ - SSL_connect returned=1 errno=0 state=SSLv3 read server certificate B: certificate verify failed (https://api.rubygems.org/latest_specs.4.8.gz)
```

To fix this, we used the following command, which basically downloads Jekyll from the HTTP server instead of HTTPS:

```
gem install jekyll --source http://rubygems.org
```

Install Python https://www.python.org/downloads/

Add Python to the systems PATH variable

```
jekyll serve
```

We got following error:
 Liquid Exception: undefined method `[]' for nil:NilClass in _posts/2015-01-02-welcome-to-jekyll.markdown

To fix this issue, open the `_config.yml` of your project and add the following commands:
```
permalink: pretty
highlighter: true
```

Now the syntax highlighter Pygments should work correctly.

## Digging Deeper into Jekyll
Jekyll is made for blogging and simple websites. We wanted to see how flexible and powerful Jekyll really is so we tried out some advanced techniques:

### Using custom post types
By default there are two post types: static pages and blog posts. What if we wanted something like projects?
Introduced in v2.0, Jekyll is able to do this and its called [collections](http://jekyllrb.com/docs/collections/). At the time of this article the feature was experimental and marked as unstable by the jekyll team.


First step add the collection in the `_config.yml`:

```
collections:
  projects:
    permalink: /projects/:path/
    output: true
```

Collections can be accessed by using the Liquid templating syntax. If you want to access the `projects` collection in ` _projects` folder use the `site` Liquid variable `site.projects`.


CODE EXAMPLE HERE

### Multiple Layouts

We tried to find a way to generate the same page in multiple layouts. For example generating a big HTML file and a smaller AJAX file, that contains only the body of the big HTML file. When looking for a solution, we found a small plugin called [jekyll-multipost](), but it didn't turn out to be helpful in two ways: First of all, it seems that it only works with posts and no other pages. Second, it will probably not work on GitHub pages, as GH only allows a few whitelisted plugins.

## Using your own URL for a github page
Refer to: https://help.github.com/articles/setting-up-a-custom-domain-with-github-pages/

## Making Jekyll multilingual
Here is a great article which covers this topic pretty well:
http://sylvain.durand.tf/making-jekyll-multilingual/

## Javascript alternatives for Jekyll
At Campudus we use JavaScript quite often, so we researched some alternatives written in Javascript with Node.JS. Here are some of the most promising ones we found so far:
http://brunch.io/ - Looks a lot like a really simple build tool for web pages.
http://hexo.io/ - Looks like Jekyll for JavaScript. A shame that GitHub doesn't support it natively!


## Notes for us
Using smooth transitions between page refreshes http://weblinc.github.io/jquery.smoothState.js/index.html
