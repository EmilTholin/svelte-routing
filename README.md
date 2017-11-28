[![npm][npm]][npm-url]

# Svelte Routing

A Svelte routing library with SSR support.

## Install

```bash
npm install --save svelte-routing
```

## Usage

```html
<!-- App.html -->
<nav>
  <NavLink exact to="/">Home</NavLink>
  <NavLink to="/about">About</NavLink>
  <NavLink to="/blog">Blog</NavLink>
</nav>

<Route exact path="/"><Home/></Route>
<Route path="/about"><About/></Route>
<Route path="/blog"><Blog/></Route>

<script>
import NavLink from 'svelte-routing/NavLink.html';
import Route from 'svelte-routing/Route.html';
import Home from './components/Home.html';
import About from './components/About.html';
import Blog from './components/Blog.html';

export default {
  components: {
    NavLink,
    Route,
    Home,
    About,
    Blog
  }
};
</script>
```

```javascript
// main.js
import { createHistory } from 'svelte-routing';
import App from './App.html';

createHistory('browser');

const app = new App({
  target: document.getElementById('app'),
  hydrate: true
});
```

```javascript
// server.js
const { createServer } = require('http');
const { createHistory } = require('svelte-routing');
require('svelte/ssr/register');
const app = require('./App.html');

const history = createHistory('memory');

createServer((req, res) => {
  history.replace(req.url);

  res.write(`
    <!DOCTYPE html>
    <div id="app">${app.render()}</div>
    <script src="/bundle.js"></script>
  `);

  res.end();
}).listen(3000);
```

## API

#### `createHistory`

A function that initializes the history object.

```javascript
import { createHistory } from 'svelte-routing';

// Browser history is for use in modern web browsers that support the HTML5 history API
const history = createHistory('browser');

// Memory history is for use in non-DOM environments, like the server and tests
const history = createHistory('memory');

// Hash history is for use in legacy web browsers
const history = createHistory('hash');
```

#### `Link.html`

A component used to navigate around the application.

###### Properties

| Property    | Required | Default Value | Description                                                                                                     |
| :---------- | :------- | :------------ | :-------------------------------------------------------------------------------------------------------------- |
| `to`        | `true`   | `'#'`         | URL the component should link to.                                                                               |
| `replace`   |          | `false`       | When `true`, clicking the link will replace the current entry in the history stack instead of adding a new one. |
| `target`    |          | `''`          | A `target` attribute given to the component.                                                                    |
| `className` |          | `''`          | A `class` attribute given to the component.                                                                     |

#### `NavLink.html`

A component used to navigate around the application that will have an additional
class added to it when its `to` property matches the current URL.

###### Properties

| Property          | Required | Default Value | Description                                                                                                                                         |
| :---------------- | :------- | :------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------- |
| `to`              | `true`   | `'#'`         | URL the component should link to.                                                                                                                   |
| `replace`         |          | `false`       | When `true`, clicking the link will replace the current entry in the history stack instead of adding a new one.                                     |
| `exact`           |          | `false`       | When `true`, the active class will only be applied if the location is matched exactly.                                                              |
| `strict`          |          | `false`       | When `true`, the trailing slash on a location’s pathname will be taken into consideration when determining if the location matches the current URL. |
| `target`          |          | `''`          | A `target` attribute given to the component.                                                                                                        |
| `className`       |          | `''`          | A `class` attribute given to the component.                                                                                                         |
| `activeClassName` |          | `'active'`    | A `class` attribute given to the component when its `to` matches the current URL.                                                                   |
| `ariaCurrent`     |          | `'true'`      | The value given to the [aria-current][aria-current-url] attribute when the component's `to` matches the current URL.                                |

#### `Route.html`

A component that will render its children when its `path` property matches the
current URL.

###### Properties

| Property  | Required | Default Value | Description                                                                                                                         |
| :-------- | :------- | :------------ | :---------------------------------------------------------------------------------------------------------------------------------- |
| `path`    | `true`   | `''`          | The component will render its children when `path` matches the URL. Can be any value that [path-to-regexp][regexp-url] understands. |
| `exact`   |          | `false`       | When `true`, will only match if `path` matches the URL exactly.                                                                     |
| `strict`  |          | `false`       | When `true`, a `path` that has a trailing slash will only match a URL with a trailing slash.                                        |

[npm]: https://img.shields.io/npm/v/svelte-routing.svg
[npm-url]: https://npmjs.com/package/svelte-routing
[aria-current-url]: https://tink.uk/using-the-aria-current-attribute
[regexp-url]: https://www.npmjs.com/package/path-to-regexp
