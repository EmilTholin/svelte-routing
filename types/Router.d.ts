import { SvelteComponent } from "svelte";

type Viewtransition = {
    fn?: any;
    delay?: number;
    duration?: number;
    x?: number;
    y?: number;
    opacity?: number;
    easing?: any;
    css?: (t: number) => string;
};

type RouterProps = {
    basepath?: string;
    url?: string;
    viewtransition?: (direction?: string) => Viewtransition;
};

export class Router extends SvelteComponent<RouterProps> {}
