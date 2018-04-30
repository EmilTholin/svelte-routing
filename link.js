import { getHistory, isModifiedEvent } from './index.js';

/**
 * A link action that can be added to <a href=""> tags rather than using the <Link> component. Example:
 * ```
 * <a href="post/{postId}" use:link>{post.title}</a>
 * ```
 */
export default function link(node) {

  function onClick(event) {
    const anchor = event.target;

    // Ignore everything but left clicks, let browser handle
    // "target=_blank" etc., ignore clicks with modifier keys
    if (event.button !== 0 || anchor.target !== '' || isModifiedEvent(event)) {
      return;
    }

    event.preventDefault();

    if (anchor.hasAttribute('replace')) {
      getHistory().replace(anchor.pathname);
    } else {
      getHistory().push(anchor.pathname);
    }
  }

  node.addEventListener('click', onClick);

  return {
    destroy() {
      node.removeEventListener('click', onClick);
    }
  }
}
