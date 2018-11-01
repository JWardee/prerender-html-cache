Prerender HTML Cache plugin
===========================

This plugin is used with your Prerender server to cache HTML responses as files.

From within your Prerender server directory run:

## NPM installation coming soon

```bash
$ npm install prerender-html-cache --save
```
##### server.js
```js
global.scriptPath = __dirname;

const prerender = require('prerender');
const server = prerender();

server.use(require('prerender-html-cache'))

server.start();
```