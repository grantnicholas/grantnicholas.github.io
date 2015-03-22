---
layout: post
title: Override default behavior of a link in a div in drupal
---
The problem: I was developing a page in drupal to display a slideshow of views (with linkable content within the views). 
However, the default views slideshow behavior was to advance forward a slide on click, making the links within the views useless.

The solution:
I first disabled the click to advance a slide with:
			
			
			Drupal.behaviors.fssnewBehavior = {
			attach: function(){
					$(" #views_slideshow_cycle_teaser_section_case_studies-block ").click(function(event){
						event.preventDefault(); 
						event.stopImmediatePropagation();
						console.log(event.type + "was prevented");
					});
			}
			};
	 
However, I quickly found that this also disabled the links within the views. After messing around with using preventDefault()
versus return false and not getting anywhere I decided to go the hacky route: write new javascript to reimplement
the function of the links. I played around with it a bit and found a quick way to restore the functionality. Essentially when
any of the class site-link links are clicked, the event.target it came from is grabbed and its innerHTML [ie the url]
is grabbed and used to open a new webpage. Really simple and intuitive. Let me know if you have a "non-hacky" way of 
implementing this functionality! 
-Grant

	 		Drupal.behaviors.fssnew1Behavior = {
			attach: function(){
					$(" .site-link ").click(function(event){
					var sitename = event.target.innerHTML;
					window.open(sitename);
					})
			}
			};