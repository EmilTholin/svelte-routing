<script>
    import { createEventDispatcher, getContext } from "svelte";
    import { HISTORY, LOCATION, ROUTER } from "./contexts.js";
    import { resolve, shouldNavigate } from "./utils.js";

    export let to = "#";
    export let replace = false;
    export let state = {};
    export let getProps = () => ({});
    export let preserveScroll = false;

    const location = getContext(LOCATION);
    const { base } = getContext(ROUTER);
    const { navigate } = getContext(HISTORY);
    const dispatch = createEventDispatcher();

    let href, isPartiallyCurrent, isCurrent, props;
    $: href = resolve(to, $base.uri);
    $: isPartiallyCurrent = $location.pathname.startsWith(href);
    $: isCurrent = href === $location.pathname;
    $: ariaCurrent = isCurrent ? "page" : undefined;
    $: props = getProps({
        location: $location,
        href,
        isPartiallyCurrent,
        isCurrent,
        existingProps: $$restProps,
    });

    const onClick = (event) => {
        dispatch("click", event);
        if (shouldNavigate(event)) {
            event.preventDefault();
            // Don't push another entry to the history stack when the user
            // clicks on a Link to the page they are currently on.
            const shouldReplace = $location.pathname === href || replace;
            navigate(href, { state, replace: shouldReplace, preserveScroll });
        }
    };
</script>

<a
    {href}
    aria-current={ariaCurrent}
    on:click={onClick}
    {...props}
    {...$$restProps}
>
    <slot active={!!ariaCurrent} />
</a>
