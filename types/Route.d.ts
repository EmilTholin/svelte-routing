import { SvelteComponent } from "svelte";

type AsyncSvelteComponent = () => Promise<{
    default: typeof SvelteComponent<any>;
}>;

type RouteProps = {
    path?: string;
    component?: typeof SvelteComponent<any> | AsyncSvelteComponent;
    [additionalProp: string]: unknown;
};

type RouteSlots = {
    default: {
        location: RouteLocation;
        params: RouteParams;
    };
};

type RouteLocation = {
    pathname: string;
    search: string;
    hash?: string;
    state: {
        [k in string | number]: unknown;
    };
};

type RouteParams = {
    [param: string]: string;
};

export class Route extends SvelteComponent<
    RouteProps,
    Record<string, any>,
    RouteSlots
> {}
