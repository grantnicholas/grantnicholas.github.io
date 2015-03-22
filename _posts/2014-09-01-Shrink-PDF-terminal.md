---
layout: post
title: Shrink PDF files from the terminal
---
Really quick terminal command to shrink large PDF files for sites with stubborn upload limits:

`convert -density 200x200 -quality 60 -compress jpeg input.pdf output.pdf`

Just change the quality to a lower number to reduce the filesize even more. 


