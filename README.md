[![npm][npm]][npm-url]

# Svelte Routing

A declarative Svelte routing library with SSR support.

[[CHANGELOG][changelog-url]]

## Install

```bash
npm i -D svelte-routing
```

## Usage

```html
<!-- App.svelte -->
<script>
  import { Router, Link, Route } from "svelte-routing";
  import Home from "./routes/Home.svelte";
  import About from "./routes/About.svelte";
  import Blog from "./routes/Blog.svelte";

  export let url = "";
</script>

<Router {url}>
  <nav>
    <Link to="/">Home</Link>
    <Link to="/about">About</Link>
    <Link to="/blog">Blog</Link>
  </nav>
  <div>
    <Route path="/blog/:id" component={BlogPost} />
    <Route path="/blog" component={Blog} />
    <Route path="/about" component={About} />
    <Route path="/"><Home /></Route>
  </div>
</Router>
```

```javascript
// main.js
import App from "./App.svelte";

const app = new App({
    target: document.getElementById("app"),
});
```

## API

#### `Router`

The `Router` component supplies the `Link` and `Route` descendant components
with routing information through context, so you need at least one `Router` at
the top of your application. It assigns a score to all its `Route` descendants
and picks the best match to render.

`Router` components can also be nested to allow for seamless merging of many
smaller apps.

###### Properties

|     Property     | Required | Default Value | Description                                                                                                                                                                                                                                                                                                 |
| :--------------: | :------: | :-----------: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|    `basepath`    |          |     `"/"`     | The `basepath` property will be added to all the `to` properties of `Link` descendants and to all `path` properties of `Route` descendants. This property can be ignored in most cases, but if you host your application on e.g. `https://example.com/my-site`, the `basepath` should be set to `/my-site`. |
|      `url`       |          |     `""`      | The `url` property is used in SSR to force the current URL of the application and will be used by all `Link` and `Route` descendants. A falsy value will be ignored by the `Router`, so it's enough to declare `export let url = "";` for your topmost component and only give it a value in SSR.           |
| `viewtransition` |          |    `null`     | View Transition (Experimental)                                                                                                                                                                                                                                                                              |

#### `Link`

A component used to navigate around the application.

###### Properties

|     Property     | Required | Default Value | Description                                                                                                                                                                                                                           |
| :--------------: | :------: | :-----------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
|       `to`       |   ✔ ️   |     `"#"`     | URL the component should link to.                                                                                                                                                                                                     |
|    `replace`     |          |    `false`    | When `true`, clicking the `Link` will replace the current entry in the history stack instead of adding a new one.                                                                                                                     |
|     `state`      |          |     `{}`      | An object that will be pushed to the history stack when the `Link` is clicked.                                                                                                                                                        |
|    `getProps`    |          | `() => ({})`  | A function that returns an object that will be spread on the underlying anchor element's attributes. The first argument given to the function is an object with the properties `location`, `href`, `isPartiallyCurrent`, `isCurrent`. |
| `preserveScroll` |          |    `false`    | When `true`, clicking the `Link` will not scroll the page to the top.                                                                                                                                                                 |

#### `Route`

A component that will render its `component` property or children when its
ancestor `Router` component decides it is the best match.

All properties other than `path` and `component` given to the `Route` will be
passed to the rendered `component`.

Potential path parameters will be passed to the rendered `component` as
properties. A wildcard `*` can be given a name with `*wildcardName` to pass the
wildcard string as the `wildcardName` property instead of as the `*` property.

Potential path parameters are passed back to the parent using props, so they can
be exposed to the slot template using `let:params`.

```html
<Route path="/blog/:id" let:params>
    <BlogPost id="{params.id}" />
</Route>
```

The active status of link can be exposed to the slot template using
`let:active`.

```html
<Link to="/browser" let:active>
  <MenuItem active={active}>Browser</MenuItem>
</Link>
```

###### Properties

|  Property   | Required | Default Value | Description                                                                                                                                                              |
| :---------: | :------: | :------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|   `path`    |          | `""`          | The path for when this component should be rendered. If no `path` is given the `Route` will act as the default that matches if no other `Route` in the `Router` matches. |
| `component` |          | `null`        | The component constructor that will be used for rendering when the `Route` matches. If `component` is not set, the children of `Route` will be rendered instead.         |

#### `navigate`

A function that allows you to imperatively navigate around the application for
those use cases where a `Link` component is not suitable, e.g. after submitting
a form.

The first argument is a string denoting where to navigate to, and the second
argument is an object with a `replace`, `state` and `preserveScroll` properties equivalent to those
in the `Link` component.

```html
<script>
    import { navigate } from "svelte-routing";

    function onSubmit() {
        login().then(() => {
            navigate("/success", { replace: true });
        });
    }
</script>
```

#### `link`

An action used on anchor tags to navigate around the application. You can add an
attribute `replace` to replace the current entry in the history stack instead of
adding a new one and `preserveScroll` to not scroll the page to the top when clicked.

```html
<script>
    import { link } from "svelte-routing";
</script>

<Router>
    <a href="/" use:link>Home</a>
    <a href="/replace" use:link replace>Replace this URL</a>
    <!-- ... -->
</Router>
```

#### `links`

An action used on a root element to make all relative anchor elements navigate
around the application. You can add an attribute `replace` on any anchor to
replace the current entry in the history stack instead of adding a new one.
You can add an attribute `preserveScroll` on any anchor to not to scroll the page to the top when clicked. You
can add an attribute `noroute` for this action to skip over the anchor and allow
it to use the native browser action.

```html
<!-- App.svelte -->
<script>
    import { links } from "svelte-routing";
</script>

<div use:links>
    <Router>
        <a href="/">Home</a>
        <a href="/replace" replace>Replace this URL</a>
        <a href="/native" noroute>Use the native action</a>
        <!-- ... -->
    </Router>
</div>
```

#### `viewtransition`

Viewtransition for navigation (Experimental).

_`builtin transition`_

```html
<script>
    import { fade } from "svelte/transition";
    // ...
</script>

<Router viewtransition="{() => { fn: fade, duration: 500 }}">
    <Route path="/" component="{Home}" />
    <Route path="/contact" component="{Contact}" />
</Router>
```

_`custom transition`_

```html
<script>
    import { cubicin } from "svelte/easing";
    // ...
</script>

<Router
    viewtransition="{() => { duration: 500, easing: cubicin, css: (t) => `scale:${t};transform-origin:center center;` }}"
>
    <Route path="/" component="{Home}" />
    <Route path="/contact" component="{Contact}" />
</Router>
```

# License

This project is licensed under the [**MIT**](LICENSE).

# Contribution

Unless you explicitly state otherwise, any contribution intentionally submitted
for this project by you, shall be licensed as **MIT**, without any additional
terms or conditions. [**Code of Conduct**](CODE_OF_CONDUCT.md).

[npm]: https://img.shields.io/npm/v/svelte-routing.svg
[npm-url]: https://npmjs.com/package/svelte-routing
[changelog-url]: https://github.com/EmilTholin/svelte-routing/blob/master/CHANGELOG.md
