Prerender HTML Cache plugin
===========================

This plugin is used with your Prerender server to cache HTML responses as files.

From within your Prerender server directory run:

```bash
$ npm install prerender-memory-cache --save
```
##### server.js
```js
const prerender = require('prerender');
const server = prerender();

server.use(require('prerender-html-cache'))

server.start();
```