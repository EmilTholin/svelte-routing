<script>
    import { getContext, onDestroy } from "svelte";
    import { ROUTER } from "./contexts.js";
    import { canUseDOM } from "./utils.js";

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
        routeParams = $activeRoute.params;

        const { component: c, path, ...rest } = $$props;
        routeProps = rest;

        if (c) {
            if (c.toString().startsWith("class ")) component = c;
            else component = c();
        }

        canUseDOM() && !$activeRoute.preserveScroll && window?.scrollTo(0, 0);
    }

    registerRoute(route);

    onDestroy(() => {
        unregisterRoute(route);
    });
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
