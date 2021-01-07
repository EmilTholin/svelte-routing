import { SvelteComponent, SvelteComponentTyped } from 'svelte'

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

interface RouteLocation {
  pathname: string
  search: string
  hash?: string
  state: {
    [k in string | number]: unknown
  }
}

interface RouteParams {
  [param: string]: string
}

type Route = SvelteComponentTyped<RouteProps, Record<string, any>, RouteSlots>

export { Route, RouteLocation }
