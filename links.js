import { getHistory, isModifiedEvent } from './index.js';

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

function findClosest(tagName, el) {
  while(el && el.tagName !== tagName) {
    el = el.parentNode;
  }
  return el;
}

function onClick(event) {
  const anchor = findClosest('A', event.target);
  if (!anchor || anchor.target || event.button !== 0 || anchor.host !== location.host || isModifiedEvent(event) ||
    anchor.hasAttribute('noroute'))
  {
    return;
  }
  event.preventDefault();
  if (anchor.hasAttribute('replace')) {
    getHistory().replace(anchor.pathname);
  } else {
    getHistory().push(anchor.pathname);
  }
}
