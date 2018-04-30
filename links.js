import { isModifiedEvent } from 'svelte-routing';
import { history } from 'dabble/routing';

/**
 * An action to be added at a root element of your application to capture all relative links and push them onto the
 * history stack. Example:
 * ```html
 * <div use:links>
 *   <Route exact path="/" component={Home} bind:match/>
 *   <Route exact path="/p/:projectId/:docId?" component={ProjectScreen}/>
 *
 *   {#each projects as project}
 *     <a href="/p/{project.id}">{project.title}</a>
 *   {/each}
 * </div>
 * ```
 */
export default function links(node) {
  node.addEventListener('click', onClick);

  return {
    destroy() {
      node.removeEventListener('click', onClick);
    }
  }
}

function onClick(event) {
  const anchor = event.target.closest('a[href]:not([target])');
  if (!anchor || event.button !== 0 || anchor.host !== location.host || isModifiedEvent(event) ||
    anchor.hasAttribute('noroute'))
  {
    return;
  }
  event.preventDefault();
  if (anchor.hasAttribute('replace')) {
    history.replace(anchor.pathname);
  } else {
    history.push(anchor.pathname);
  }
}
