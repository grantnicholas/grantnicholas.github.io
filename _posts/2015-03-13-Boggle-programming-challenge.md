---
layout: post
date: 2015-03-13 18:49:48
title: "Boggle challenge"
---

Boggle is one of those fun games I loved playing as a kid. And it also has a bunch of CS/MATH principles hidden beneath a seemingly simple game. 

For those of you who don't know what Boggle is it can be summed up in an image: 

<image src="http://www.blogcdn.com/blog.games.com/media/2013/02/mzl.dzqiyeiz.640x960-75.jpg"> </image>

Essentially you try to create as many words as you can by swiping over connected letters on the board (and not repeating a tile). 

So I wrote a naive/brute force solution below in python that simply prints out all the solutions. I'm thinking of some optimizations I can make to reduce repeated traversals of the board in order to speed up the solution, so check back in a few days.

One note: I did not feel like implementing a simple dictionary for word lookup so I just hardcoded a testdictionary with some sample words to verify the program was working. It is left as an exercise to the reader to find a good database of words for word lookup.

Update: 2015-01-16
Optimizations for speeding up the search
check it out here!

```

"""
Naive solution to print out all the words in a boggle board 
Brute force: check every possible solution

['c', 'a', 't']
['y', 'r', 'e'] 
['o', 'o', 'g']
"""


def print_all(board, adict):
    for i in range(len(board)):
        for j in range(len(board[0])):
            find_util(board, [(i,j)], i, j, adict)


def find_util(board, used, starti, startj, adict):
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
            find_util(board, used + [(ii, jj)], ii, jj, adict)


def main():
    adict = set(['cat', 'art', 'or', 'yo', 'gore', 'category', 'car', 'are'])
    board = [['c', 'a', 't'], ['y', 'r', 'e'], ['o', 'o', 'g']]
    print_all(board, adict)

if __name__ == '__main__':
    main()



```
