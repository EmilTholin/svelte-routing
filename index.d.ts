declare module 'svelte-routing' {
	import { SvelteComponent } from 'svelte'
	export const Router: SvelteComponent
	export const Route: SvelteComponent
	export const Link: SvelteComponent
	export const navigate: (to: string, { replace, state }: { replace?: boolean; state: object }) => void
	export const link: (node: Element) => { destroy(): void }
	export const links: (node: Element) => { destroy(): void }
}
