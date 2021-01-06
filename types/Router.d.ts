import { SvelteComponentTyped } from 'svelte'

interface RouterProps {
  basepath?: string
  url?: string
}

type Router = SvelteComponentTyped<RouterProps>

export default Router
