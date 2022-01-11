
# Secret Santa Randomizer
## Introduction
A React application that allows users to input names and generate random pairings for a **secret santa gift exchange**. This application also allows users to specify people that a specific santa should not be assigned to.

Input is interactive and responsive: simply input names and exclusion lists in the text fields and see what the program registers in real-time. 

The app can be found here: http://tiffie44.github.io/secret-santa-randomizer

*:･ﾟ Happy holidays! *:･ﾟ
## Inspiration
I have done a secret santa gift exchange with a close-knit group of seven other friends from high school every year since 2015. We used to excitedly draw names out of our pencil cases at lunch. 

When we graduated in 2019, the eight of us went our separate ways (to seven different universities!). Seeing as we were far apart, I wrote a small Python program that would generate the pairings and save them in text files that I could tend off to my friends. It worked. 

The next year, I decided we needed something more fun after being away from each other as we quarantined during the COVID-19 pandemic—something as fun as drawing scraps of paper out of a pencil case. That night, I made a clunky “website” by scrapping together bits of HTML and CSS, not even hosted anywhere, and sent the entire thing to them as a zip file. It worked, but I knew it could be better. 

In my first ever look at JavaScript and React, I present my first real attempt at fleshing out these iterations into a working application that we can use for years to come.

> And Julia ended up getting Isaac for almost three years in a row, so there was some personal motivation to get something up and running.

## Prerequisites
Feel free to play around with names and generate your own permutations at http://tiffie44.github.io/secret-santa-randomizer!

Otherwise, the app can be run using the zip file and an adequate version of `Node.js` and `npm` installed.
At the time of writing, this is my version of `Node.js`:
```
$ node --version
v16.13.1
```
and this is my verison of `npm`:
```
$ npm --version
8.1.2
```

## Next Steps
At the moment, the program works for my specific use case (permutating my list of eight names), but that doesn’t mean it’s fully fleshed out. In the future, I can see myself implementing new things such as:  
<ul> 
<li> Viewing historical stats of previous name assignments throughout the years
<li> Allowing the user to “log in” to see their assignment (the true interactive experience I dreamed of in the Inspiration section!) 
</ul>
I also look forward to using this application as a blank slate when I tinker with HTML and CSS more!

## Notes

Thanks to guides by [Richard Hulse and Abhishek Singh](https://github.com/gitname/react-gh-pages), and [Sabesan Sathananthan](https://betterprogramming.pub/how-to-host-your-react-app-on-github-pages-for-free-919ad201a4cb) that helped me deploy this app to GitHub pages!
