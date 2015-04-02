  console.log('require.js app');

  require.config({
    "baseUrl": "/assets/js",
    "paths": {
        "jquery": "jquery",
        "underscore": "underscore",
    },
    "shim": {
        "jquery": {
            "exports": "$"
        },
        "underscore": {
            "exports": "_"
        }
    }
  });

require(["jquery", "underscore"], function($, _) {
    $(function() {
        console.log('base application loaded');
    });
});
