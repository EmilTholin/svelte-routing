<script>
    import { getContext, onDestroy } from "svelte";
    import { ROUTER } from "./contexts.js";

    export let path = "";
    export let component = null;

    let routeParams = {};
    let routeProps = {};

    const { registerRoute, unregisterRoute, activeRoute } = getContext(ROUTER);

    const route = {
        path,
        // If no path prop is given, this Route will act as the default Route
        // that is rendered if no other Route in the Router is a match.
        default: path === "",
    };

    $: if ($activeRoute && $activeRoute.route === route) {
        const { path: p, component: c, ...rest } = $$props;
        if (p === route._path) {
            if (c) {
                if (c.toString().startsWith("class ")) component = c;
                else component = c();
            }
            path = p;
            routeProps = rest;
            routeParams = $activeRoute.params;
        }
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

{#if $activeRoute && $activeRoute.route === route}
    {#if component}
        {#await component then resolvedComponent}
            <svelte:component
                this={resolvedComponent?.default || resolvedComponent}
                {...routeParams}
                {...routeProps}
            />
        {/await}
    {:else}
        <slot params={routeParams} />
    {/if}
{/if}
