---
layout: post
title: Mongodb set dbpath and debugging
---

From the node project directory use the following command to launch mongodb with the path to the data directory:

mongod --dbpath /path/to/data 

ie) mongod --dbpath ~/Desktop/nodeCIHL/data

If there is an error about the address being in use check that mongod is not already active with 

sudo service mongodb stop
mongod --dbpath /path/to/data

Finally, if there is an error about not enough space to make the directories use:

mongod --dbpath /path/to/data --smallfiles


