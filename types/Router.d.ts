import { SvelteComponent } from "svelte";
import { TransitionConfig } from "svelte/transition";

type Viewtransition = {
    fn?: TransitionConfig;
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
    viewtransition?: (direction: "in" | "out" | "both") => Viewtransition;
};

export class Router extends SvelteComponent<RouterProps> {}
