---
title: How to Check Which Versions of Node Angular CLI Supports
date: '2020-09-08'
tags: ['angular']
---

I recently ran into an issue with Angular CLI version 10.1.0. Anytime I ran `ng serve` I would get this error:

```bash
Unknown error: SyntaxError: Unexpected token 'export'
```

After a lot of trial and error I finally figured out what the issue was. I had upgraded Node to the latest version which the Angular CLI does not support yet.

To see what versions of Node the Angular CLI supports, you can check the `package.json` file in the project on GitHub.

The supported versions of Node can be found under `engines`:

```json
"engines": {
    "node": ">=10.13.0 <13.0.0",
    "yarn": ">=1.22.4"
},
```

Angular CLI version 10.1.0 supports Node versions 10.13.0 to any version less than 13.0.0.
