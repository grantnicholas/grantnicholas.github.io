---
layout: post
date: 2015-01-05 18:49:48
title: "Interesting uses for closures"
tags: python
---

So every javascript developer should know the basics of how closures work. But often when programming with students in some of my classes I've noticed that people with little exposure to Javascipt or more functional languages do not know about this concept. 

##So what are closures?

According to Wikipedia:

>>>Closures are a technique for implementing lexically scoped name binding in languages with first-class functions

So maybe not very helpful. Then what are closures used to do?

>>> Operationally, a closure is a data structure storing a function together with an environment


Ahh! So a closure lets us access variables not EXPLICITY in a function but within the scoping of a higher order function. So something like this will run with no errors. 

```
def make_adder(startval):
    
    def add_amount(amount):
        return startval + amount

    return add_amount

fiveadder = make_adder(5)
fouradder = make_adder(4)
 
print fiveadder(3)      #8
print fouradder(3)     #7
```

Ok so closures are cool but why do we use them?

One such use of closures that was helpful the other day for me was creating a fast string-searching function using a compiled regex using a closure.

We simply pass the regex into the function, which then compiles the regex and then returns ANOTHER function that uses the compiled regex for its search. 


```
def make_string_searcher(regex, ignore=True):
    rx = re.compile(regex, re.IGNORECASE) if ignore else re.compile(regex)

    def find_string(string):
        return re.search(rx, string)

    return find_string

```


When performing a string search repeatedly in python, compiling a regex can greatly increase its speed. Thus, closures can make our life much easier here!

 