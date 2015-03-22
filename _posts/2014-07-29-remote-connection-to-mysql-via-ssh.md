---
layout: post
title: Remote connection to MySQL via SSH 
---

Was trying to connect to MySQL on a remote server via SSH. Was getting permission errors so needed to 
remotely connect to MySQL via an SSH tunnel

1. `ssh login@serverip -L 3306:127.0.0.1:3306 -N`
2. `mysql -u username -p`
3. enter your password and you are in!

Really simple. You might have to change the port to 3307 if a local instance of mysql is running, but otherwise
is straightforward. 
 