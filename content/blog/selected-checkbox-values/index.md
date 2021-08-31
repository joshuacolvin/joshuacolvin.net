---
title: 'How to get all checked checkbox values using JavaScript'
date: '2021-09-13'
---

Retrieving the values from a collection of checkboxes is not as straightforward as you would expect. In this article, I will show you one way you can accomplish this.

Let's say you have the HTML below and you want to retrieve the values of the checkboxes a user has selected.

```html
<div class="filter">
  Filter by quarter:
  <ul>
    <li>
      <input type="checkbox" value="1" name="q1" id="q1" />
      <label for="q1">Q1</label>
    </li>
    <li>
      <input type="checkbox" value="2" name="q2" id="q2" />
      <label for="q2">Q2</label>
    </li>
    <li>
      <input type="checkbox" value="3" name="q3" id="q3" />
      <label for="q3">Q3</label>
    </li>
    <li>
      <input type="checkbox" value="4" name="q4" id="q4" />
      <label for="q4">Q4</label>
    </li>
  </ul>
</div>
```

We can use `querySelectorAll` and look for `input` elements with the type `checkbox` to get all checkboxes but we only want the checkboxes a user has selected. We can get the selected checkboxes by using the `:checked` pseudo class.

```javascript
document.querySelectorAll('input[type="checkbox"]:checked')
```

Since `querySelectorAll` returns an `HTMLCollection` will need to convert it to an array and `map` over that array to get the `value` of the checked checkboxes.

We will use event delegation to listen for checkbox changes. Event delegation enables us to add the event listener to a parent element (the `ul`) instead of each child element (`input[type="checkbox"]`). For more information on event delegation, I highly recommend David Walsh's blog post ["How JavaScript Event Delegation Works"](https://davidwalsh.name/event-delegate)

```javascript
const ul = document.querySelector('ul')
let selected = [];

ul.addEventListener('change', event => {
  if (event.target.type === 'checkbox') {
    /* highlight-start */
    const checked = document.querySelectorAll('input[type="checkbox"]:checked')

    selected = Array.from(checked).map(x => x.value)
    /* highlight-end*
  }
})
```

Any time a checkbox is clicked, the `selected` array will be updated. If we select the first and last checkbox `selected` will contain `["1", "4"]`.
