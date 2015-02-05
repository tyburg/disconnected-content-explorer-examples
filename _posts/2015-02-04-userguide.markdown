---
layout:       post
title:        "User Guide"
description:  "An overview of the app"
date:         2015-02-04 12:51:33
categories:    Example
---
![User Guide Screenshot]({{ site.baseurl }}/images/userguide.png)

An example metadata.json
{% highlight json %}
{
  "title": "DICE User Guide",
  "description": "A brief overview of this app",
  "thumbnail": "img/thumbnail.png",
  "tile_thumbnail":"img/tilethumb.png",
  "reportID":"userguide1.0",
  "lat": "0.0",
  "lon": "0.0"
}
{% endhighlight %}


Feel free to pull this report out of DICE and poke around in the code.

Resources used to create the user guide: [Bootstrap][bootstrap] for layout, [TwentyTwenty][twentytwenty] for the image comparison, [Leaflet.js][leaflet] for the map, and [Swiper][swiper] for the photo gallery.

[bootstrap]:    http://getbootstrap.com/
[twentytwenty]: http://zurb.com/playground/twentytwenty
[leaflet]:      http://leafletjs.com/
[swiper]:       http://www.idangero.us/sliders/swiper/index.php
