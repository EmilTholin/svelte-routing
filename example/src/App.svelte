<script>
  import { Router, Route } from "svelte-routing";
  import NavLink from "./components/NavLink.svelte";
  import Home from "./routes/Home.svelte";
  import About from "./routes/About.svelte";
  import Blog from "./routes/Blog.svelte";

  // Used for SSR. A falsy value is ignored by the Router.
  export let url = "";
</script>

<Router url="{url}">
  <nav>
    <NavLink to="/">Home</NavLink>
    <NavLink to="about">About</NavLink>
    <NavLink to="blog">Blog</NavLink>
  </nav>
  <div>
    <Route path="about" component="{About}" />
    <Route path="blog" component="{Blog}" />
    <Route path="/" component="{Home}" />
  </div>
</Router>
