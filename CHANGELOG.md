# 0.3.0
Split the `createHistory` function into `createBrowserHistory`, `createMemoryHistory`, `createHashHistory` to allow for better tree shaking of unused history creation code.

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
<Route path="/:myParam" component={{MyComponent}} />

<!-- MyComponent.html -->
<h1>{{match.params.myParam}}</h1>
```

# 0.1.0
Added the ability to give a component constructor to a route with the `component` property:

```html
<!-- App.html -->
<Route path="/:myParam" component={{MyComponent}} />
```
