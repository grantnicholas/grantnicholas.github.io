---
layout: post
title: Expressjs no such file or directory error 
---

There are two packages in ubuntu: node and nodejs 
Most nodejs programs and libraries assume nodejs binary is node. 

The fix involves symlinking the two together: `sudo ln -s /usr/bin/nodejs /usr/local/bin/node`
Taken from here:
[http://stackoverflow.com/questions/14914715/express-js-no-such-file-or-directory](http://stackoverflow.com/questions/14914715/express-js-no-such-file-or-directory)
