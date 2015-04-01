console.log('require.js');

require.config({
    "baseUrl": "/-blog/assets/js",
    "paths": {
        "jquery": "jquery",
        "underscore": "underscore",
        "searchdata": "searchdata",
    },
    "shim": {
        "jquery": {
            "exports": "$"
        },
        "underscore": {
            "exports": "_"
        },
    }
});

require(["jquery", "underscore", "searchdata"], function($, _, searchdata) {
    $(function() {
        console.log($);
        console.log(_);
        console.log(searchdata);
        $.ajax({
            url: "/-blog/assets/js/app/searchbar.js",
            dataType: "script",
            async: true
        });

    });
});
