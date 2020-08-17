<script>
  import { onMount } from "svelte";
  import { navigate } from "./history.js";

  export let to = "#";

  onMount(() => {
    navigate(to);
  });
</script>
