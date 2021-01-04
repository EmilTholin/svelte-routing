declare module 'svelte-routing' {
  import 'svelte2tsx/svelte-jsx'
  import { SvelteComponent, SvelteComponentTyped } from 'svelte'
  
  interface RouterProps {
    basepath?: string
    url?: string
  }

  interface RouteProps {
    path?: string
    component?: SvelteComponent
    [additionalProp: string]: unknown
  }

  interface RouteSlots {
    default: {
      location: RouteLocation
      params: RouteParams
    }
  }

  type State = {
    [k in string | number]: unknown
  }

  interface RouteLocation {
    pathname: string
    search: string
    hash?: string
    state: State
  }

  interface RouteParams {
    [param: string]: string;
  }

  interface LinkProps {
    to: string
    replace?: boolean
    state?: State
    getProps?: (linkParams: GetPropsParams) => Record<string, any>
  }

  interface GetPropsParams {
    location: RouteLocation
    href: string
    isPartiallyCurrent: boolean
    isCurrent: boolean
  }

	export const Router: SvelteComponentTyped<RouterProps>
	export const Route: SvelteComponentTyped<RouteProps, Record<string, any>, RouteSlots>
  export const Link: SvelteComponentTyped<
    Omit<
      LinkProps &
        svelte.JSX.HTMLProps<HTMLAnchorElement> &
        svelte.JSX.SapperAnchorProps,
      "href"
    >
  >
	export const navigate: (to: string, { replace, state }: { replace?: boolean; state: State }) => void
	export const link: (node: Element) => { destroy(): void }
	export const links: (node: Element) => { destroy(): void }
}
