import { SvelteComponent } from "svelte";

type RouterProps = {
    basepath?: string;
    url?: string;
};

export class Router extends SvelteComponent<RouterProps> {}
