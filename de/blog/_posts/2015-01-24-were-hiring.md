---
layout: post
title: Aufgepasst, wir rekrutieren!
description: Unsere Talentsuche ist wohl etwas anders...
date: 2015-01-24 02:06:00
tags:
- campudus
- internal
- organization
- recruitment
- jobs
- fun friday
---
**TL;DR:** Wir basteln eine Seite, über die man sich bei Campudus bewerben kann.

## Konzept und Ablauf
Es war mal wieder Fun Friday angesagt und unsere Idee für dieses mal war es, etwas sinnvolles für uns selbst zu basteln. Zur Zeit ist vor allem die Suche nach neuen Talenten zur Unterstützung unseres Teams wichtig. Daher haben wir beschlossen, eine kleine Seite zu basteln, die potentielle Bewerber nutzen können, um sich uns vorzustellen.

Wie wir in den vergangenen Fun Fridays gesehen haben, ist es nicht gerade leicht komplett mit einem Projekt an einem Tag fertig zu werden. Vor allem wenn man viele neue Technologien auf einmal ausprobiert und gleichzeitig noch ein Konzept dafür aus dem Hut zaubern muss. Daher haben wir es uns diesmal etwas einfacher gemacht und uns schon vorher ein grobes Konzept überlegt.

Wir wissen, dass man in der Ausbildung zum Informatiker leider nicht wirklich die Technologien lernt, die wir inzwischen einsetzen. Viele unserer Kommilitonen haben sich immer abgeschreckt gefühlt, wenn auf den Aushängen zuviel gefordert wurde. Uns ist klar, dass sicherlich niemand bereits jetzt genau all die Sachen kann, die wir uns im Moment wünschen. Daher möchten wir unseren "Wir suchen" Teil anders gestalten. Wir zeigen unseren potentiellen Bewerbern, was wir so tun und sie kreuzen an, was für sie interessant klingt. Eines der Kernziele von Campudus ist es, dass wir uns immer weiter verbessern. Aus diesem Grund suchen wir Leute, die ähnlich wie wir ticken und sich nicht zu "Fachidioten" entwickeln wollen.

Herausgekommen ist eine kleine Seite, auf der man sich mit einer minimalistischen Eingabeoberfläche bei Campudus bewerben kann. Nach dem Erhalt einer Bewerbung, senden wir eine kurze Mail an die angegebene Adresse, um weiteres über den Bewerber zu erfragen und auch ein bisschen Ängste abzubauen: Wir duzen uns alle und möchten eine angenehme und erfrischende Atmosphäre bieten.

## Implementierung
Auf dem Konzept haben wir einige Icons für die von uns verwendeten Technologien eingebettet. Um diese dann auch schön skalierbar anzuzeigen, wollten wir die Icons in eine eigene Font-Datei eintragen. Nachdem der erste Versuch mit [Fontello](http://fontello.com/) scheiterte, schien es mit [IcoMoon](https://icomoon.io/app/) jedoch auf Anhieb zu funktionieren - auch mit eigenen SVGs.

Um das Kontaktformular auszuwerten, wollten wir aufgrund unserer zeitlichen Restriktionen auf eine eigene Server-Implementierung verzichten. Daher haben wir uns näher mit der Google Apps API auseinandergesetzt. Damit lässt sich ein kleiner Webservice erstellen, der auf `POST` Anfragen wartet und die Daten direkt in einem Google Docs Spreadsheet speichert. Sehr hilfreich war ein Blogpost von [Martin Hawksey](https://mashe.hawksey.info/2014/07/google-sheets-as-a-database-insert-with-apps-script-using-postget-methods-with-ajax-example/), der genau diesen Fall beschreibt und ein Codebeispiel enthält.

Wir haben den Code noch etwas erweitert, um zu prüfen ob auch alle Pflichtfelder belegt sind. Zusätzlich haben wir noch den [MailApp Service](https://developers.google.com/apps-script/reference/mail/mail-app) benutzt, um gleich eine Hinweismail an uns zu schicken, wenn jemand das Formular ausgefüllt hat.

Damit alles auch auf Mobilgeräten gut aussieht und wir nicht allzu viel Arbeit damit haben, entschieden wir uns für das [Zurb Foundation](http://foundation.zurb.com/) Framework. Hiermit haben wir bereits ein paar Erfahrungen sammeln können und sparen uns bei der Anpassung für unterschiedliche Auflösungen einiges an Zeit.

Am Ende des Tages fehlten uns nur noch einige wenige Grafiken, etwas JavaScript und ein kleines bisschen mehr CSS, um die Seite fertig zu haben, wie auf unserem Konzept. Dies sollten wir allerdings in der kommenden Woche irgendwann zwischenschieben können.

## Fazit
Aus der Retrospektive betrachtet, sind wir diesen Freitag recht weit gekommen. Zeit haben uns vor allem die vielen Merge Konflikte gekostet, da wir zu viert an nur wenigen Dateien herumhantierten. Generell waren es aber weitaus weniger Probleme als wir gedacht haben.
