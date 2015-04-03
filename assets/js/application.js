//For production use only; console.log was causing weird errors when dev tools were not open in chrome

(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

console.log('require.js app');

require.config({
    "baseUrl": "/assets/js",
    "paths": {
        "jquery": "jquery",
        "underscore": "underscore",
        "fitvids": "jquery.fitvids",
        "index": "index",
        "readtime": "readingTime.min",
        "react": "react",
        "searchdata": "searchdata",
        "searchbar": "app/searchbar"
    },
    "shim": {
        "jquery": {
            "exports": "$"
        },
        "underscore": {
            "exports": "_"
        },
        "fitvids": {
            "deps": ["jquery"]
        },
        "index": {
            "deps": ["jquery", "readtime", "fitvids"]
        },
        "readtime": {
            "deps": ["jquery"]
        },
        "react": {
            "deps": ["jquery"],
            "exports": "_React"
        },
        "searchbar": {
            "deps": ["jquery", "underscore", "react", "searchdata"]
        }
    }
});

require(["jquery", "underscore", "react"], function($, _, _React) {
    //GLOBAL REACT VARIABLE; needed for the below react components
    React = _React; 

    //REACT COMPONENTS;
    switch ($('body').attr('class')){
        case 'default':
            require(["searchdata", "searchbar"], function() {
                console.log('searchbar loaded');
            });
            break;
        default:
            break;
    }

    //OTHER JS
    require(["fitvids", "index", "readtime"], function() {
        console.log('base js loaded');
    });

});

