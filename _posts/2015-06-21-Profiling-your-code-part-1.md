---
layout: post
date: 2015-06-18 18:49:48
title: "Profiling-your-code-part-1"
---

I'm going to run through a simple example in order to demonstrate how to profile and optimize code without worrying about other complicated stuff happening. 

Let's say we are doing some machine learning algorithm that needs to find the distance between two vectors many, many times. This can happen often, for example in a k-nearest-neighbor algorithm. Doing this distance calculating repeatedly in python will likely be slow. Thus, this lets us get a feel for writing something that will likely be inefficient at first.

Naively we might write a distance function like such:

```
import math 

def euclid_dist(vec1, vec2):
    if len(vec1) != len(vec2):
        raise Exception("lengths of vectors must match for distance calculation")
    dist = 0
    for i in range(len(vec1)):
        dist = dist + (vec1[i]-vec2[i])**2
    return math.sqrt(dist)

```

There is nothing wrong with this. Let's benchmark and see what happens.

```
import math
import random

def euclid_dist(vec1, vec2):
    if len(vec1) != len(vec2):
        raise Exception("lengths of vectors must match for distance")
    dist = 0
    for i in range(len(vec1)-1):
        if vec1[i] != -1 and vec2[i] != -1:
            dist = dist + (vec1[i]-vec2[i])**2
    return math.sqrt(dist)


def all_pairs_distance(DATABASE):
    for vec1 in DATABASE:
        for vec2 in DATABASE:
            euclid_dist(vec1, vec2)

def ntimes(f, ntimes, *args, **kwargs):
    for _ in range(0,ntimes):
        f(*args, **kwargs)


def make_database():
    DATABASE = [[random.random() for x in range(5000)] for x in range(50)]
    return DATABASE

def main():
    DATABASE = make_database()
    ntimes(all_pairs_distance, 5, DATABASE)

if __name__ == '__main__':
    main()
```

We simply make a database of 50 random vectors each of length 10000 and compute the pairwise distance between all of them[including themselves] 5 times. 

Now to profile [note I chopped off the tail end as there are lots of calls that take up very little time]:

```
python -m cProfile -s cumtime profileit.py 
         325111 function calls in 38.041 seconds

   Ordered by: cumulative time

   ncalls  tottime  percall  cumtime  percall filename:lineno(function)
        1    0.003    0.003   38.041   38.041 profileit.py:1(<module>)
        1    0.000    0.000   38.037   38.037 profileit.py:44(main)
        1    0.000    0.000   37.906   37.906 profileit.py:22(ntimes)
        5    0.008    0.002   37.906    7.581 profileit.py:17(all_pairs_distance)
    12500   37.506    0.003   37.898    0.003 profileit.py:7(euclid_dist)
    12552    0.385    0.000    0.385    0.000 {range}
        1    0.095    0.095    0.131    0.131 profileit.py:38(make_database)
   250000    0.034    0.000    0.034    0.000 {method 'random' of '_random.Random' objects}
    37500    0.005    0.000    0.005    0.000 {len}
    12501    0.004    0.000    0.004    0.000 {math.sqrt}
        1    0.000    0.000    0.001    0.001 random.py:40(<module>)
        1    0.001    0.001    0.001    0.001 hashlib.py:55(<module>)
```

Not surprising of the 38.041 seconds it takes to run the program 37.898 seconds are spent in the euclidean distance function. So while in this situation its extremely obvious that the distance function is the bottleneck, in other situations it won't be! Profiling lets us instantly see where to focus our attention. 

Great, so we know the distance function is slow, is there a way to speed it up?

That brings me to part 1:
rewrite your algorithms/data structures 

As we are computing the pairwise distance between every pair naively, we immediately see we are computing these distances a bunch. Why do this? Wouldn't it make more sense to cache the results after computing the distance once? Yes it would. 

So we change two lines of code to cache the results of the distance function given two vectors. The nice part about this memoize decorator is that it is generic and will work on (most) functions. 

```
from memo import memoize
import math
import random

@memoize
def euclid_dist(vec1, vec2):
    if len(vec1) != len(vec2):
        raise Exception("lengths of vectors must match for distance")
    dist = 0
    for i in range(len(vec1)-1):
        if vec1[i] != -1 and vec2[i] != -1:
            dist = dist + (vec1[i]-vec2[i])**2
    return math.sqrt(dist)


def all_pairs_distance(DATABASE):
    for vec1 in DATABASE:
        for vec2 in DATABASE:
            euclid_dist(vec1, vec2)

def ntimes(f, ntimes, *args, **kwargs):
    for _ in range(0,ntimes):
        f(*args, **kwargs)

def make_database():
    DATABASE = [[random.random() for x in range(5000)] for x in range(50)]
    return DATABASE



def main():
    DATABASE = make_database()
    ntimes(all_pairs_distance, 5, DATABASE)

if __name__ == '__main__':
    main()

```


So how does the magic memoize decorator work?

It stores the result of the function in a dictionary where the key is the function input and the value is the function output. If the function is pure [ie: depends only on its inputs and not external state] then this means that every time the function is called with the same inputs it should return the same outputs and thus caching the function results in a dictionary lets us immediately speed up execution at the cost of memory usage. 

```
#memo.python

def memoize(function):
    memo = {}
    def wrapper(*args):
        if args in memo:
            return memo[args]
        else:
            rv = function(*args)
            memo[args] = rv 
            return rv 
    return wrapper 
```

*Disclaimer*: this is not entirely true.


How much does it increase execution speed? Benchmark it. 

```
python -m cProfile -s cumtime profileit.py 
         315112 function calls in 16.168 seconds

   Ordered by: cumulative time

   ncalls  tottime  percall  cumtime  percall filename:lineno(function)
        1    0.002    0.002   16.168   16.168 profileit.py:1(<module>)
        1    0.000    0.000   16.165   16.165 profileit.py:45(main)
        1    0.000    0.000   16.018   16.018 profileit.py:23(ntimes)
        5    0.271    0.054   16.018    3.204 profileit.py:18(all_pairs_distance)
    12500    6.794    0.001   15.746    0.001 memo.py:33(wrapper)
     2500    8.022    0.003    8.140    0.003 profileit.py:7(euclid_dist)
    12500    0.806    0.000    0.811    0.000 memo.py:16(convert)
        1    0.103    0.103    0.148    0.148 profileit.py:39(make_database)
     2552    0.117    0.000    0.117    0.000 {range}
   250000    0.043    0.000    0.043    0.000 {method 'random' of '_random.Random' objects}
    25000    0.005    0.000    0.005    0.000 {method 'append' of 'list' objects}
     2501    0.001    0.000    0.001    0.000 {math.sqrt}
        1    0.000    0.000    0.001    0.001 random.py:40(<module>)
     7500    0.001    0.000    0.001    0.000 {len}
        1    0.001    0.001    0.001    0.001 hashlib.py:55(<module>)
```
Notice we've cut execution time in less than half! By caching values we don't need to go do the expensive distance computation as often and we save a bunch of time at the cost of space. 


```
#memo.python

#is it really this easy?
def memoize(function):
    memo = {}
    def wrapper(*args):
        if args in memo:
            return memo[args]
        else:
            rv = function(*args)
            memo[args] = rv 
            return rv 
    return wrapper 
```

So you're probably curious what magic is happening in memo.py when I said it wasn't entirely true that the code was that simple. 

The problem is that we can only hash *immutable* data structures. If the data structure is mutable and the data structure changes, then its hash could change resulting in a dictionary obviously not working. So we must simply convert the mutable data structures to immutable data structures. In python lists and dictionaries are immutable so we must convert them to tuples and immutable dictionaries. 

Tuples are a built in python type but immutable dictionaries are not so we must create our own. 

```
class imdict(dict):
    def __hash__(self):
        return id(self)

    def _immutable(self, *args, **kws):
        raise TypeError('object is immutable')

    __setitem__ = _immutable
    __delitem__ = _immutable
    clear       = _immutable
    update      = _immutable
    setdefault  = _immutable
    pop         = _immutable
    popitem     = _immutable

#convert arguments to be immutable
def convert(args):
    newargs = []
    for arg in args:
        t = type(arg)
        if t==list or t==dict:
            if t == list:
                imarg = tuple(arg)
            if t == dict:
                imarg = imdict(arg)
            newargs.append(imarg)
        else:
            newargs.append(arg)

    return tuple(newargs)

def memoize(function):
    memo = {}
    def wrapper(*args):
        imargs = convert(args)
        if imargs in memo:
            return memo[imargs]
        else:
            rv = function(*imargs)
            memo[imargs] = rv 
            return rv 
    return wrapper
```

So it is a bit uglier but the basic logic is still there. You now have a plug-in memoize decorator that is *not at all tested and production ready so please don't use this in a real application* 

And that concludes part 1 of the series:
benchmarking and rewriting the logic of the code in pure python

Next time I'll talk about using existing python c-libraries to speed up code execution. 