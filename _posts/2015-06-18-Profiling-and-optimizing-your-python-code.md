---
layout: post
date: 2015-06-18 18:49:48
title: "Profiling-and-optimizing-your-code"
---

So python is really slow. Benchmarks are notoriously hard to do correctly so I'm not going to cite any specific benchmarks but being a non-compiled unityped scripting language just makes python slow. 

So why use python if it is so slow? 
*Because speed of execution of this app is non perfomance critical*
*Because speed of execution of glue code doesn't matter if you're constantly calling into C-libraries anyways*
*Because writing python is fun and writing C++ is horrendous*
*Because reasons*

So how do we get around python being slow?
1. Write the damn code [making sure your algorithms and data structures are efficient]
2. Profile your code: where are the hotspots
3. Try to rewrite the hotspots in a more efficient way [how?]
4. GOTO 2

The hard part is step 3:
  how do we make our code more efficient?

There are a few options. I'll put them in the rough order you should try things:
1. rewrite in vanilla python. can you be smarter with your time and space usage? can you cache values instead of recomputing them?
2. see if there is a c-library you can use to increase performance. IE) numpy for array and matrix operations.
3. try using the pypy JIT compiler [note some of numpy not supported with pypy
4. compile python with cython. usually just compiling your python code in cython will provide a 20-25% performance boost.
5. add type annotations to cython. this can increase performance to closeish to c levels. 
6. write a c library. 

Editorial note: I left out the numba library as it uses LLVM and I was havig a few issues on Ubuntu. I'll check back with numba later but I've heard great things.
[https://www.wikiwand.com/en/Numba](https://www.wikiwand.com/en/Numba)

In the next set of posts I will describe the process of writing, profiling, and rewriting perfomance-critical python code starting from the simple and moving towards the complex. So check back over the next few weeks to see posts about the specifics of profiling and optimizing your python code. 





