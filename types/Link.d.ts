import { SvelteComponent } from "svelte";
import { RouteLocation } from "./Route";

type LinkProps = {
    to: string;
    replace?: boolean;
    state?: {
        [k in string | number]: unknown;
    };
    getProps?: (linkParams: GetPropsParams) => Record<string, any>;
};

type GetPropsParams = {
    location: RouteLocation;
    href: string;
    isPartiallyCurrent: boolean;
    isCurrent: boolean;
};

export class Link extends SvelteComponent<
    Omit<
        LinkProps &
            svelte.JSX.HTMLProps<HTMLAnchorElement> &
            svelte.JSX.SapperAnchorProps,
        "href"
    >
> {}
