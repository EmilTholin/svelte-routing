<script>
  import { getContext, setContext, onDestroy } from "svelte";
  import { writable, derived } from "svelte/store";
  import { ROUTER } from "./contexts.js";
  import { stripSlashes } from "./utils.js";

  export let path = "";
  export let component = null;

  const { registerRoute, unregisterRoute, activeRoute } = getContext(ROUTER);

  const route = {
    path,
    // If no path prop is given, this Route will act as the default Route
    // that is rendered if no other Route in the Router is a match.
    default: path === ""
  };
  let routeParams = {};

  $: if ($activeRoute && $activeRoute.route === route) {
    routeParams = $activeRoute.params;
  }

  registerRoute(route);

  // There is no need to unregister Routes in SSR since it will all be
  // thrown away anyway.
  if (typeof window !== "undefined") {
    onDestroy(() => {
      unregisterRoute(route);
    });
  }
</script>

{#if $activeRoute !== null && $activeRoute.route === route}
  {#if component !== null}
    <svelte:component this="{component}" {...routeParams} />
  {:else}
    <slot></slot>
  {/if}
{/if}
