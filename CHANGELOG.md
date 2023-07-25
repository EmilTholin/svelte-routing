# CHANGELOG

# 2.0.0

-   PR Merged [#250](https://github.com/EmilTholin/svelte-routing/pull/250).
-   PR Merged [#247](https://github.com/EmilTholin/svelte-routing/pull/247).
-   Svelte version update.
-   Removing example folder.

# 1.11.0

-   PR Merged [#245](https://github.com/EmilTholin/svelte-routing/pull/245).
-   Svelte version update.

# 1.10.0

-   PR Merged [#243](https://github.com/EmilTholin/svelte-routing/pull/243).

# 1.9.0

-   Major improvement in performance. Minimize unnecessary prefetch components.

# 1.8.9

-   Fixed. Sometimes navigate return info null.
-   Issue fixed[#132](https://github.com/EmilTholin/svelte-routing/issues/132).

# 1.8.8

-   Issue Fixed [#242](https://github.com/EmilTholin/svelte-routing/issues/242).
-   PR Removed [#77](https://github.com/EmilTholin/svelte-routing/pull/77)
    Causing infinity loop in nested routes.

# 1.8.7

-   Segment mismatch bug fixed.

# 1.8.6

-   Svelte version update.
-   Issue Fixed [#242](https://github.com/EmilTholin/svelte-routing/issues/242).
-   Codebase improved.

# 1.8.5

-   Can Use Dom function improved.
-   function & class mismatch bug fixed.

# 1.8.4

-   Issue Fixed [#241](https://github.com/EmilTholin/svelte-routing/issues/241).

# 1.8.3

-   Hooks & Types bugs fixed.

# 1.8.2

-   Svelte dependency updated.
-   Lazyload component return type added.
-   Issue Fixed [#240](https://github.com/EmilTholin/svelte-routing/issues/240).

# 1.8.0

-   Major Bugs fixed in `Router.svelte`.
-   Converted all interfaces into types.
-   Improved Lazy Loading/Async Route Import. Get much smaller chunk for every
    route. Only load files (JS & CSS module) when URL is active.

```jsx
<!-- App.svelte -->
<Route path="/" component={() => import("./Home.svelte")} />

<Route path="/about" component={() => import("./About.svelte")} />

<Route path="/user/:user" component={() => import("./User.svelte")} />
```

-   Added Hooks for Contexts. `useLocation`, `useRouter`, `useHistory`.

```html
<!-- Page.svelte -->
<script>
    import { useLocation } from "svelte-routing";
    const location = useLocation();
</script>

<div>{JSON.stringify($location)}</div>
```

# 1.7.0

-   Added Code of Conduct.
-   Optimized the codebase.
-   Update the dependencies.
-   PR Merged [#220](https://github.com/EmilTholin/svelte-routing/pull/220).
-   PR Merged [#210](https://github.com/EmilTholin/svelte-routing/pull/210).
-   PR Merged [#206](https://github.com/EmilTholin/svelte-routing/pull/206).
-   PR Merged [#192](https://github.com/EmilTholin/svelte-routing/pull/193).
-   PR Merged [#188](https://github.com/EmilTholin/svelte-routing/pull/188).
-   PR Merged [#175](https://github.com/EmilTholin/svelte-routing/pull/175).
-   PR Merged [#173](https://github.com/EmilTholin/svelte-routing/pull/173).
-   PR Merged [#158](https://github.com/EmilTholin/svelte-routing/pull/158).
-   PR Merged [#105](https://github.com/EmilTholin/svelte-routing/pull/105).
-   PR Merged [#95](https://github.com/EmilTholin/svelte-routing/pull/95).
-   PR Merged [#85](https://github.com/EmilTholin/svelte-routing/pull/85).
-   PR Merged [#77](https://github.com/EmilTholin/svelte-routing/pull/77).
-   PR/Issue [#200](https://github.com/EmilTholin/svelte-routing/pull/200),
    Tested & it's not relevant/exists.
-   Issue Fixed [#122](https://github.com/EmilTholin/svelte-routing/issues/122),
    [#4652](https://github.com/sveltejs/svelte/issues/4652).

# 1.6.0

Added TypeScript support.

# 1.4.0

Added functionality for passing the `location` to the rendered Route `component`
and slot.

```html
<!-- App.svelte -->
<Route path="/blog" component="{Blog}" />

<!-- Blog.svelte -->
<script>
    import queryString from "query-string";

    export let location;

    let queryParams;
    $: queryParams = queryString.parse(location.search);
</script>

<h1>Blog</h1>
<p>{queryParams.foo}</p>

<!-- App.svelte -->
<Route path="/blog" let:location>
    <h1>Blog</h1>
    <p>{location.search}</p>
</Route>
```

# 1.3.0

Added functionality to pass potential `Route` path parameters back to the parent
using props, so they can be exposed to the slot template using `let:params`.

```html
<Route path="/blog/:id" let:params>
    <BlogPost id="{params.id}" />
</Route>
```

# 1.2.0

Added functionality for passing all the extra `Route` properties to the rendered
`component`.

```html
<!-- App.svelte -->
<Route path="/page" component="{Page}" foo="foo" bar="bar" />

<!-- Page.svelte -->
<script>
    export let foo;
    export let bar;
</script>

<h1>{foo} {bar}</h1>
```

# 1.1.0

Added the ability to give `Route` path wildcards a custom name.

```html
<!-- App.svelte -->
<Route path="/page/*wildcardName" component="{Page}" />

<!-- Page.svelte -->
<script>
    export let wildcardName;
</script>

<h1>{wildcardName}</h1>
```

# 1.0.0

-   Moved to Svelte 3.
-   It's now required for all `Route` and `Link` components to have a `Router`
    ancestor.
-   `NavLink` was removed in favour for a more versatile `Link` component. Check
    the userland `NavLink` component in the `example` directory for an example.
-   The SSR component no longer needs to be compiled at runtime with the help of
    [esm](https://github.com/standard-things/esm) as there is no longer a
    dependency on the `history` library. You can compile a separate CJS bundle
    for the server and pass in a prop to the topmost component and use that as
    the `url` property for the `Router`, which will force the URL for all
    descendants.
-   All component filename extensions have been changed to `.svelte`.
-   Hash routing is no longer supported.
-   The entire API of the library is now exported from the `src/index.js` file,
    so importing from the library is now much more pleasant.

```javascript
import { Router, Route, Link } from "svelte-routing";
```

# 0.4.0

Moved to Svelte v2 and added the new
[link](https://github.com/EmilTholin/svelte-routing#linkjs) and
[links](https://github.com/EmilTholin/svelte-routing#linksjs) actions.

# 0.3.0

Split the `createHistory` function into `createBrowserHistory`,
`createMemoryHistory`, `createHashHistory` to allow for better tree shaking of
unused history creation code.

# 0.2.0

Added the ability to access the match object in a matched route:

```html
<!-- App.html -->
<Route path="/:myParam" bind:match>
    <h1>{{match && match.params.myParam}}</h1>
</Route>
```

or:

```html
<!-- App.html -->
<Route path="/:myParam" component="{{MyComponent}}" />

<!-- MyComponent.html -->
<h1>{{match.params.myParam}}</h1>
```

# 0.1.0

Added the ability to give a component constructor to a route with the
`component` property:

```html
<!-- App.html -->
<Route path="/:myParam" component="{{MyComponent}}" />
```
