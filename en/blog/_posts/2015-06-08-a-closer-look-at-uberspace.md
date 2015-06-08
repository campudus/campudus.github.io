---
title: A closer look at Uberspace
description: A small evaluation of the hosting service and its features
date: 2015-06-08 13:40:00
tags:
- fun friday
- uberspace
- evaluation
- hosting
- ssh
---
We played around with a German shared web hosting service called [Uberspace](https://uberspace.de/tech). Their price model is special: You pay what you want. It's at least 1 Euro but they recommend to pay between 5 and 10 Euros.

Another special thing about Uberspace: they offer you full-featured [SSH access](https://wiki.uberspace.de/system:ssh). It is also possible to configure own [daemon processes](https://wiki.uberspace.de/system:daemontools) with [daemontools](http://cr.yp.to/daemontools.html) and execute binaries. Your own software can be installed with the [toast package manager](https://wiki.uberspace.de/system:toast). Thanks to all of these features, it is possible to install NodeJS and register a [simple http server as a service](https://wiki.uberspace.de/development:nodejs).

Overall, Uberspace feels like a root server with some limits. If you don't want to administrate a root server, Uberspace is the way to go. But don't forget it's a shared hosting service, so big heavy process (over 400MB RAM) are not tolerated.
