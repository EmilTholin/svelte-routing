declare module 'svelte-routing' {
  import { SvelteComponent, SvelteComponentTyped } from 'svelte'
  
  interface RouterProps {
    basepath?: string
    url?: string
  }

  interface RouteProps {
    path?: string
    component?: SvelteComponent
  }

  interface RouteSlots {
    default: {
      location: RouteLocation
      params: RouteParams
    }
  }

  interface RouteLocation {
    pathname: string
    search: string
    hash?: string
    state: {
      [k in string | number]: unknown
    }
  }

  interface RouteParams {
    [param: string]: string;
  }

  interface LinkProps {
    to: string
    replace?: boolean
    state?: {}
    getProps?: () => ({})
  }

	export const Router: SvelteComponentTyped<RouterProps>
	export const Route: SvelteComponentTyped<RouteProps, Record<string, any>, RouteSlots>
	export const Link: SvelteComponentTyped<LinkProps>
	export const navigate: (to: string, { replace, state }: { replace?: boolean; state: object }) => void
	export const link: (node: Element) => { destroy(): void }
	export const links: (node: Element) => { destroy(): void }
}
