<script>
  import { Link } from "svelte-routing";

  export let to = "";

  function getProps({ location, href, isPartiallyCurrent, isCurrent, existingProps }) {
    const isActive = href === "/" ? isCurrent : isPartiallyCurrent || isCurrent;

    let classNames = existingProps.class || '';
    if (isActive) {
      classNames += ' active';
    }

    return { class: classNames };
  }
</script>

<Link to="{to}" getProps="{getProps}">
  <slot />
</Link>
