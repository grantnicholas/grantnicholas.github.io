---
layout: post
date: 2015-06-01 18:49:48
title: "Named tuple python trick"
---
What happens when we need to glue small pieces of data together
in order to return them from a function, pass them into a function, 
or just logically keep them together. In python people usually return 
tuples of values from functions like below. 

```
#arguments -> (max,min) of arguments
def getmaxmin(a,b,c):
    return max(a,b,c), min(a,b,c)
```
Here we return a tuple of data, but there are no labels on the tuple.
In order to unpack it, we must tediously remember what the order of the 
values in the tuple are. This can lead to annoying errors. 

```
a,b = getmaxmin(2,5,4) #is a max or is b max?
```

In some languages [like C] we have structs that let us neatly package
groups of data without the weight of a full class/object. Additionally 
we get some static typing guarantees as well as more readable code. 
Unfortunately it is more verbose. 

```
struct maxmin{
    int max;
    int min;
} typedef maxmin;

maxmin getmaxmin(int a, int b, int c)
{
    maxmin tup;
    tup.max = max(a,b,c);
    tup.min = min(a,b,c);
    return tup;   
}

int main()
{
    maxmin tup = getmaxmin(2,5,4);
    int themax = maxmin.max;
    int themin = maxmin.min;
}
```

In python the equivalent to the above is to build a class that explicity says
what we are returning and return the class. This can be useful, but 
creating tons of small classes only to use them once or twice and then 
be forgotten just feels *wrong*. We are repeating ourselves a lot. 

```
class maxmin:
    def __init__(self, max, min):
        self.max = max 
        self.min = min 

def getmaxmmin(a,b,c):
    return maxmin(max(a,b,c), min(a,b,c))

a_maxmin = getmaxmin(2,5,4)
amax = maxmin.max 
bmax = maxmin.min
```

One way to get around this is instead of using an object we can return a dictionary with our values in it. We lookup the values by key and we essentially get an object with 0 configuration. If you write javascript, this is essentially what you do in javascript.

```
def getmaxmin(a,b,c):
    return {"max" : max(a,b,c), 
            "min" : min(a,b,c)}

maxmin = getmaxmin(2,5,4)
amax   = maxmin["max"]
amin   = maxmin["min"]

```

This is a bit verbose however, and accessing fields using the dictionary lookup syntax is annoying. I'm lazy and I really want to be accessing fields like a normal object. 

```
class Struct:
    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)

def getmaxmin(a,b,c):
    return Struct(max= max(a,b,c), min= min(a,b,c))

maxmin = getmaxmin(2,5,4)
amax   = maxmin.max 
amin   = maxmin.min
```

One solution I found was to simply create a Struct object that lets
us package any values into a lightweight object.

For people not very familiar with python, the double star [**] syntax
denotes that any number of keyword arguments can be passed into this function and will be stored in the resulting dictionary kwargs. We then access the object's internal dict representation of itself (self.__dict__) and update it 
to reflect the new keyword arguments we passed in. 

```
from collections impoprt namedtuple 

Maxmin = namedtuple('Maxmin', ['max','min'])

def getmaxmin(a,b,c):
    return Maxmin(max= max(a,b,c), min= min(a,b,c))

amaxmin = getmaxmin(2,5,4)
amax    = amaxmin.max 
amin    = amaxmin.min

```

One final [and best!] solution is to use the builtin namedtuple container python provides. This is more performant than the python struct hack I was showing you above and is considered standard by pythoners. 


I'm satisfied with the namedtuple solution for lightweight throwaway objects for several reasons:

1. Not verbose. Easy to use. 
2. Eliminates most errors with packaging small pieces of data together
3. Code is reusable. Doesn't require full new class for each use. 
4. More performant than full OO

The downsides are of course documentation. Having a formal class for each type makes it clear about the intent of the return type instead of having a generic struct. Ultimately this is a trick to save developer time on small throwaway objects, and should not replace the use of real,formal classes and objects when needed. 


