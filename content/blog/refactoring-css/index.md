---
title: 'Writing maintainable CSS'
date: 2015-06-05
---

I've been thinking and reading a lot lately about different CSS architecture methodologies. I'm somewhat ashamed to admit that my approach to CSS until recently had been to start at the header and style the page until I reached the footer. While this approach might have been visually effective it left me with a sense of dread at the thought of ever having to open the code again. I now know the reason for my cavalier attitude towards styling pages was that I didn't give CSS the respect it deserves. Even if you don't aspire to become a CSS expert it is still worth the effort to use some sort of CSS architecture in your projects. With this in mind I decided to undertake the seemingly sisyphean task of refactoring a project that was in dire need of some structure. Here are some of my thoughts and takeaways.

### 01. Decide on a methodology before you begin

Whether you choose BEM, OOCSS, SMACCS or some hybrid of your own design it is important that you choose something before you begin a project. Starting with some sort of architecture will significantly increase the maintainability of your code and save you a lot of stress. Decide on a file structure for your project as well and set it up before writing any code. I used [this](http://www.sitepoint.com/architecture-sass-project/) one from Hugo Giraudel as the starting point when refactoring a site and found it incredibly helpful. This type of system eliminates the headache of searching thousands of lines of CSS in order to locate the styles you want.

### 02. Consider using a CSS preprocessor

If you are not already using a CSS preprocessor you should if for no other reason than the ability to declare variables. While there is a small learning curve involved, it is well worth the effort. I recommend [Sass](http://sass-lang.com/).

### 03. Write DRY CSS

The first thing I noticed when revisiting the code was the sheer amount of repetition it contained. I declared the font 'Helvetica' ten times and it's the only font I used in this project! That's not to mention the multiple repeated line-heights, font-weights and other properties. You may be asking yourself, 'why is this a bad thing?'. Let's say you want to change the font for the entire site. You now have to find and change every declaration of that font in your style sheet. This might not be a big deal when dealing with small style sheets but this can quickly grown into a huge problem as your pages get bigger.

### Further Reading

There are many great resources regardless of which CSS methodology you choose. Here are some links I have found useful:

1. [CSS Guidelines](http://cssguidelin.es/) by Harry Roberts
2. Pretty much then entirety of Harry Roberts blog [CSS Wizardry](http://csswizardry.com/)
3. Nicole Sullivan's [OOCSS](http://oocss.org/)
4. [SMACSS Book](https://smacss.com/) by Jonathan Snook
5. [Modern CSS Development](https://www.youtube.com/watch?v=HoQ-QEusyS0) talk by Julie Cameron
6. [Architecture for a Sass Project](http://www.sitepoint.com/architecture-sass-project/) by Hugo Giraudel
