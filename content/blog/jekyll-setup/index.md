---
title: 'Setting up a site with Jekyll'
date: 2014-11-17
---

### What is Jekyll?

[Jekyll](http://jekyllrb.com/) is a simple, blog-aware, static site generator. I first heard about Jekyll through a [css-tricks screencast](http://css-tricks.com/video-screencasts/screencast-134-tour-site-progress-built-jekyll-grunt-sass-svg-system/). I had been looking for a simple blogging platform other than wordpress for a while and Jekyll seemed like a good option. At first glance it seemed like a lot to set up but I found some great tutorials to help me along the way.

### Installation and Setup

The first and most helpful tutorial by far was [Jekyll by Example](https://www.andrewmunsell.com/tutorials/jekyll-by-example) by Andrew Munsell. He walks you through installing Jekyll and setting up your site in an easy to follow manner. There is premium content available for purchase which walks you through command line basics, installing Jekyll plugins, optimizing for search engines, and optimizing load times. Well worth the \$15 in my opinion.

### Markdown?

During setup you write your blog posts in Markdown which I knew nothing about other than it is supposed to be awesome for writing. I found [this](http://markdowntutorial.com/) tutorial to be extremley helpful for learning the basics of Markdown.

### Deployment

Once my site was done I needed to deploy it somehow. At first I chose to deploy to [GitHub Pages](https://pages.github.com/) which was as simple as promised. This is a good option if you don't want to deal with a hosting company. You can even use a custom domain name although I had no luck getting this set up. Which led me to my next failed attempt at deployment: Deploying to a digital ocean droplet with a git-hook. Again I could not manage to get this working despite following an in-depth [tutorial](https://www.digitalocean.com/community/tutorials/how-to-deploy-jekyll-blogs-with-git).

I finally came accross [this](http://blog.grayghostvisuals.com/workflow/deploying-jekyll-with-rake/) post that walks you through deploying a Jekyll site using a Rakefile and was able to get eveything pushed up to mediatemple. One note if you are following this method: you have to run jekyll build before running rake deploy for your site to render properly.

### Final Thoughts

Despite the setbacks figuring out deployment I would highly recommend using Jekyll if it seems like the right solution for you. I am more than happy with the results and the ease of writing and pushing new content. Hopefully this can help others avoid the problems I had.
