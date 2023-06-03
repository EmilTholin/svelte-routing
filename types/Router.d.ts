import { SvelteComponentTyped } from "svelte";

type RouterProps = {
    basepath?: string;
    url?: string;
};

export class Router extends SvelteComponentTyped<RouterProps> {}
