import { SvelteComponentTyped } from 'svelte';

interface RouterProps {
  basepath?: string;
  url?: string;
}

export class Router extends SvelteComponentTyped<RouterProps> {}
