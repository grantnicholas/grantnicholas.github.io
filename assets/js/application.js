console.log('require.js');

require.config({
  "baseUrl" : "/newblog/js",
  "paths"   : {
    "jquery"     : "jquery",
    "underscore" : "underscore",
    "searchdata"        : "searchdata", 
  },
  "shim" : {
    "jquery" : {
      "exports" : "$"
    },
    "underscore" : {
      "exports" : "_"
    },
  }
});

require(["jquery", "underscore", "searchdata"], function ($, _, searchdata){
	$(function() {
    console.log($);
    console.log(_);
    console.log(searchdata);
	});
});

