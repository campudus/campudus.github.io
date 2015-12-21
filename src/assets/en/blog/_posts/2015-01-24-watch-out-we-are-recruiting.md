---
layout: post
title: Watch out, we're recruiting!
description: A different approach to find talented people...
blog-id: watch-out-we-are-recruiting
date: 2015-01-24 02:06:00
tags:
- campudus
- internal
- organization
- recruitment
- jobs
- fun friday
---
**TL;DR:** We have a page to [apply for a job at Campudus](https://campudus.github.io/en/recruit/).

## Concept and Workflow
It's been fun friday again and this time we wanted to build something meaningful for ourselves. Right now it is important to find new talented developers to support our team. We decided to build a small page, that potential applicants can use to send us a message and tell us something about themselves.

As we have seen during the last fun fridays, it is not easy to complete a whole project in a single day. Especially when you try to combine a lot of new technologies at once and create a concept from scratch. Thus we made life easier for us and decided on a rough concept up front.

We know that you won't learn the technologies in computer science education that we currently use. Many of our fellow students told us they are discouraged from applying when reading too many requirements on the job description. It's completely clear for us that no one can do all the things that we currently wish for. This is why we designed our "we are searching" part differently. We show our potential team members what we do or focus on and they can check what interests them. One of the main goals at Campudus is to always improve ourselves. For this reason, we search for people who share our own mindset and don't want to evolve into a specialist for a single task.

A small site emerged, where you can apply at Campudus through a minimalist form. After getting an application, we send a short mail to the provided address to achieve two things: Get to know the applicant a bit more and reduce fears: We address each other informally and want to share the comfortable and refreshing atmosphere before getting in touch.

## Implementation
The concept showed a few icons for the technologies we use. To show these in a scaling fashion, we wanted to get the icons in our own font file. After the first try with [Fontello](http://fontello.com/) failed, we had more luck using [IcoMoon](https://icomoon.io/app/) - even providing own SVGs.

To evaluate the contact form, we didn't want to create our own server-side implementation. Thus we had a closer look at Google Apps API. It is easy to create a small web service that listens on `POST` requests and saves the data directly into a Google Docs spreadsheet. The [blog post by Martin Hawksey](https://mashe.hawksey.info/2014/07/google-sheets-as-a-database-insert-with-apps-script-using-postget-methods-with-ajax-example/) was very helpful and described our use case pretty well with a code example.

We extended the code a bit more to check whether all required fields are filled. We used the [MailApp Service](https://developers.google.com/apps-script/reference/mail/mail-app) to send us an e-mail whenever someone has filled out the form.

To get a nice look on mobile and we don't have to do a lot of fixes for it, we decided to use the [Zurb Foundation framework](http://foundation.zurb.com/). We already had some experience with this and could save some time on the changes for the different resolutions.

At the end of the day we had a few missing images, a bit JavaScript and a bit more CSS to have the complete site look like the one on our concept. During the next week, we should be able to get it done completely.

## Conclusion
Looking at it from some distance, we came pretty far this friday. The biggest time killer were a lot of merge conflicts as four of us tried to work on just a few files. There were a lot less issues than we expected.

Updated at 30.01.2015: The job page is complete can be seen online at [https://campudus.github.io/en/recruit/](https://campudus.github.io/en/recruit/)!
