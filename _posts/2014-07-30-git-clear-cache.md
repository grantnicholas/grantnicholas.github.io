---
layout: post
title: Git clear cache
---

To untrack a file that has been added/initialized to your repository ie) stop tracking the file but do not delete it


1. **Commit any outstanding code changes**
2. To remove any changed files from the index use: `git rm -r --cached .`
3. `git add -A`
4. `git commit -m ".gitignore is now working"`

