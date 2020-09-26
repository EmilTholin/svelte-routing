<script>
  import { getContext, createEventDispatcher } from "svelte";
  import { ROUTER, LOCATION } from "./contexts.js";
  import { navigate } from "./history.js";
  import {
    startsWith,
    resolve,
    shouldNavigate,
    checkRouteGuards,
    pick,
  } from "./utils.js";

  export let to = "#";
  export let replace = false;
  export let state = {};
  export let getProps = () => ({});

  const { base, routes, activeRoute } = getContext(ROUTER);
  const location = getContext(LOCATION);
  const dispatch = createEventDispatcher();

  let href, isPartiallyCurrent, isCurrent, props;
  $: href = to === "/" ? $base.uri : resolve(to, $base.uri);
  $: isPartiallyCurrent = startsWith($location.pathname, href);
  $: isCurrent = href === $location.pathname;
  $: ariaCurrent = isCurrent ? "page" : undefined;
  $: props = getProps({
    location: $location,
    href,
    isPartiallyCurrent,
    isCurrent,
  });

  async function onClick(event) {
    dispatch("click", event);

    if ($activeRoute) {
      const { shouldDeactivate } = await checkRouteGuards($activeRoute.route);
      if (!shouldDeactivate) {
        event.preventDefault();
        return;
      }
    }

    const { route: nextRoute } = pick($routes, href);
    const { shouldActivate } = await checkRouteGuards(nextRoute);
    if (!shouldActivate) {
      event.preventDefault();
      return;
    }

    if (shouldNavigate(event)) {
      event.preventDefault();
      // Don't push another entry to the history stack when the user
      // clicks on a Link to the page they are currently on.
      const shouldReplace = $location.pathname === href || replace;
      navigate(href, { state, replace: shouldReplace });
    }
  }
</script>

<a {href} aria-current={ariaCurrent} on:click={onClick} {...props}>
  <slot />
</a>
