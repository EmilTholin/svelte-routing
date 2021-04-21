import 'svelte2tsx/svelte-jsx';
import { SvelteComponentTyped } from 'svelte';
import { RouteLocation } from './Route';

interface LinkProps {
  to: string;
  replace?: boolean;
  state?: {
    [k in string | number]: unknown;
  };
  getProps?: (linkParams: GetPropsParams) => Record<string, any>;
}

interface GetPropsParams {
  location: RouteLocation;
  href: string;
  isPartiallyCurrent: boolean;
  isCurrent: boolean;
}

export class Link extends SvelteComponentTyped<
  Omit<LinkProps & svelte.JSX.HTMLProps<HTMLAnchorElement> & svelte.JSX.SapperAnchorProps, 'href'>
> {}
