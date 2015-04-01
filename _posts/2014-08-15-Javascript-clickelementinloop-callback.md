---
layout: post
title: Adding click handlers in a loop with javascript closures
---
I wanted to make an array of elements on a page all have an event happen on click. 
I first tried:



```
for(var i=0; i<array.length; i++){
	jQuery(array[i]).click(function(){
		coolEventGoesHere();
	});
}
```



I quickly ran into a common javascript error of trying to add click handlers in a loop. 
This stackoverflow post about closures explained it much better than I ever would so please read it!
[http://stackoverflow.com/questions/111102/how-do-javascript-closures-work](http://stackoverflow.com/questions/111102/how-do-javascript-closures-work)

Seriously read the post and don't just blind copy paste this code. 

Now on to how to fix the issue...

Create a callback function that returns a function. 



```
function createCallback(i){
  return function(){
    jQuery(array[i]).toggle();
  }
}`
```


Call the callback function while looping through and assigning the click elements. 


```
$(document).ready(function(){
  for(var i = 1; i < array.length; i++) {
    jQuery(array[i]).click( createCallback( i ) );
  }
});
```


