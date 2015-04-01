---
layout: post
date: 2015-03-16 18:49:48
title: "Boggle challenge improvements"
---
Last week I wrote a simple program to calculate all the possible words one can produce out of a boggle game. The solution was a naive/brute force solution
that required checking every possible board string against the dictionary to see if it is a valid word.

A quick refresher on Boggle for those of you who don't know what Boggle is:

<image src="http://www.blogcdn.com/blog.games.com/media/2013/02/mzl.dzqiyeiz.640x960-75.jpg"> </image>

Create as many words as you can by swiping over connected letters on the board (and not repeating a tile). 

So clearly checking EVERY possible board string against the dictionary performs very poorly as there are an exponential amount of strings on a boggle board. 

My first thought was to avoid recalculating "nodes" of the boggle board through memoization in a dynamic-programming inspired method. We still check every possible string but we check them *smartly*. However, due to the possible solutions at a given node depending on PREVIOUSLY visited nodes as nodes cannot be repeated, memoizing stuff does not help you out. Subproblems cannot be reused and the whole approach falls apart. 

After getting a little discouraged I tried a different approach. Why do we have to calculate **ALL** of the possible boggle string solutions. Instead of calculating all the solutions if we could trim our search space we would get a greatly improved runtime. So the problem boils down to how to trim the search space?

With this reduced problem, I thought of heuristics on how to trim the search space. Well we clearly know if the prefix of a word is not in our dictionary then clearly that word is not in our dictionary. Thus, if we ever check that a prefix of a word is NOT in our dictionary then we simply stop the search right there. Greatly trimming our search space.  

With this idea, I had to decide how best to implement a dictionary for looking up prefixes. I decided on using a Trie, which allows fast lookup of prefixes in O(length of prefix) which if the prefixes are small like in Boggle is O(1). 

For a quick review of Tries checkout the <a href="http://en.wikipedia.org/wiki/Trie">awesome Wiki article</a>.

<image class="center-75" src="http://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Trie_example.svg/400px-Trie_example.svg.png"></image>

Given this, I was ready to start coding up my solution. Really one line of code is the meat and potatoes of the change. The rest is the infrastructure necessary to support the trie lookup. 

```

if nword in atrie:
                find_util(board, used + [(ii, jj)], ii, jj, adict, atrie)

```

Which says if the new word prefix is in the trie then we continue our search of the boggle board. Otherwise, if the prefix is not in the trie then stop this search as we know that this path is a deadend. 

The rest of the code is attached below, including the simple Trie class I made out of nested python dictionaries with some simple wrapper functions. 


```

"""
betterboggle.py
Faster solution to print out all the words in a boggle board
"""


from trie import Trie
from timeit import timeit


def print_all(board, adict, atrie):
    for i in range(len(board)):
        for j in range(len(board[0])):
            find_util(board, [(i,j)], i, j, adict, atrie)


def find_util(board, used, starti, startj, adict, atrie):
    imax = len(board)
    jmax = len(board[0])
    used_word = ''
    for ii,jj in used:
        used_word = used_word + board[ii][jj]

    direct = {}

    direct['nw'] = (starti-1, startj-1)
    direct['n'] = (starti, startj-1)
    direct['ne'] = (starti+1, startj-1)
    direct['e'] = (starti+1, startj)
    direct['se'] = (starti+1, startj+1)
    direct['s'] = (starti, startj+1)
    direct['sw'] = (starti-1, startj+1)
    direct['w'] = (starti-1, startj)


    for d, tup in direct.iteritems():
        ii, jj = tup
        char = board[ii][jj] if ii >= 0 and ii < imax and jj >= 0 and jj < jmax and (ii, jj) not in used else None

        if char is not None:
            nword = used_word + char
            if nword in adict:
                print nword
            if nword in atrie:
                find_util(board, used + [(ii, jj)], ii, jj, adict, atrie)


@timeit
def main():
    adict = set(['cat', 'art', 'or', 'yo', 'gore', 'category', 'car', 'are'])
    atrie = Trie()
    for word in adict:
        atrie.add(word)

    board = [['c', 'a', 't'], ['y', 'r', 'e'], ['o', 'o', 'g']]
    print_all(board, adict, atrie)

if __name__ == '__main__':
    main()



```


```
#trie.py

class Trie:

    def __init__(self):
        self.adict = {}

    def _add(self, word, ind, adict):
        if ind >= len(word):
            return
        char = word[ind]
        if char in adict:
            self._add(word, ind + 1, adict[char])
        else:
            adict[char] = {}
            self._add(word, ind + 1, adict[char])

    def add(self, word):
        self._add(word, 0, self.adict)

    def _in(self, word, ind, adict):
        if ind >= len(word):
            return True
        char = word[ind]
        if char not in adict:
            return False
        else:
            return self._in(word, ind + 1, adict[char])

    def __contains__(self, word):
        return self._in(word, 0, self.adict)


def main():
    atrie = Trie()
    atrie.add('poop')
    atrie.add('pook')
    atrie.add('kpop')
    print 'poop' in atrie
    print 'kpor' in atrie


if __name__ == '__main__':
    main()

```

I also performed a simple benchmark using a timing decorator I made to test the speed of the naive/brute force implementation vs the trie based implementation. 

Attached is the timing decorator and a screenshot of a simple test I did. 

```
#timeit.py
import time


def timeit(f):

    def timed(*args, **kw):

        ts = time.time()
        result = f(*args, **kw)
        te = time.time()

        print 'func:%r args:[%r, %r] took: %2.4f sec' % \
            (f.__name__, args, kw, te - ts)
        return result

    return timed

```

<image class="center-75" src="/assets/images/bog.png"></image>

The trie based implementation severely outperforms the naive implementation on this board which is awesome! There are a few catches:

1. <div><p>Building the trie can be expensive if the dictionary is very large.</p><p>However this only has to be done once and then the trie is in main memory where lookups then become quite fast.</p></div>
2. <div><p>We use a lot of extra memory carrying our dictionary and trie around at the same time.</p><p>We can only use the trie for lookup instead of both the dictionary and trie. This slows the implementation down by a little due to the extra time lookup of the trie versus a hash map but saves a LOT of space.</p></div>

That is it for now! 
What I learned from this problem:
tries are awesome :)


