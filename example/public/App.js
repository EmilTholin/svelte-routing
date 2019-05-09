'use strict';

function noop() {}

function run(fn) {
	return fn();
}

function blank_object() {
	return Object.create(null);
}

function run_all(fns) {
	fns.forEach(run);
}

function safe_not_equal(a, b) {
	return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}

let current_component;

function set_current_component(component) {
	current_component = component;
}

function get_current_component() {
	if (!current_component) throw new Error(`Function called outside component initialization`);
	return current_component;
}

function onMount(fn) {
	get_current_component().$$.on_mount.push(fn);
}

function onDestroy(fn) {
	get_current_component().$$.on_destroy.push(fn);
}

function setContext(key, context) {
	get_current_component().$$.context.set(key, context);
}

function getContext(key) {
	return get_current_component().$$.context.get(key);
}

const invalid_attribute_name_character = /[\s'">/=\u{FDD0}-\u{FDEF}\u{FFFE}\u{FFFF}\u{1FFFE}\u{1FFFF}\u{2FFFE}\u{2FFFF}\u{3FFFE}\u{3FFFF}\u{4FFFE}\u{4FFFF}\u{5FFFE}\u{5FFFF}\u{6FFFE}\u{6FFFF}\u{7FFFE}\u{7FFFF}\u{8FFFE}\u{8FFFF}\u{9FFFE}\u{9FFFF}\u{AFFFE}\u{AFFFF}\u{BFFFE}\u{BFFFF}\u{CFFFE}\u{CFFFF}\u{DFFFE}\u{DFFFF}\u{EFFFE}\u{EFFFF}\u{FFFFE}\u{FFFFF}\u{10FFFE}\u{10FFFF}]/u;
// https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
// https://infra.spec.whatwg.org/#noncharacter

function spread(args) {
	const attributes = Object.assign({}, ...args);
	let str = '';

	Object.keys(attributes).forEach(name => {
		if (invalid_attribute_name_character.test(name)) return;

		const value = attributes[name];
		if (value === undefined) return;
		if (value === true) str += " " + name;

		const escaped = String(value)
			.replace(/"/g, '&#34;')
			.replace(/'/g, '&#39;');

		str += " " + name + "=" + JSON.stringify(escaped);
	});

	return str;
}

const escaped = {
	'"': '&quot;',
	"'": '&#39;',
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;'
};

function escape(html) {
	return String(html).replace(/["'&<>]/g, match => escaped[match]);
}

const missing_component = {
	$$render: () => ''
};

function validate_component(component, name) {
	if (!component || !component.$$render) {
		if (name === 'svelte:component') name += ' this={...}';
		throw new Error(`<${name}> is not a valid SSR component. You may need to review your build config to ensure that dependencies are compiled, rather than imported as pre-compiled modules`);
	}

	return component;
}

let on_destroy;

function create_ssr_component(fn) {
	function $$render(result, props, bindings, slots) {
		const parent_component = current_component;

		const $$ = {
			on_destroy,
			context: new Map(parent_component ? parent_component.$$.context : []),

			// these will be immediately discarded
			on_mount: [],
			before_render: [],
			after_render: [],
			callbacks: blank_object()
		};

		set_current_component({ $$ });

		const html = fn(result, props, bindings, slots);

		set_current_component(parent_component);
		return html;
	}

	return {
		render: (props = {}, options = {}) => {
			on_destroy = [];

			const result = { head: '', css: new Set() };
			const html = $$render(result, props, {}, options);

			run_all(on_destroy);

			return {
				html,
				css: {
					code: Array.from(result.css).map(css => css.code).join('\n'),
					map: null // TODO
				},
				head: result.head
			};
		},

		$$render
	};
}

function get_store_value(store) {
	let value;
	store.subscribe(_ => value = _)();
	return value;
}

function readable(value, start) {
	return {
		subscribe: writable(value, start).subscribe
	};
}

function writable(value, start = noop) {
	let stop;
	const subscribers = [];

	function set(new_value) {
		if (safe_not_equal(value, new_value)) {
			value = new_value;
			if (!stop) return; // not ready
			subscribers.forEach(s => s[1]());
			subscribers.forEach(s => s[0](value));
		}
	}

	function update(fn) {
		set(fn(value));
	}

	function subscribe(run, invalidate = noop) {
		const subscriber = [run, invalidate];
		subscribers.push(subscriber);
		if (subscribers.length === 1) stop = start(set) || noop;
		run(value);

		return () => {
			const index = subscribers.indexOf(subscriber);
			if (index !== -1) subscribers.splice(index, 1);
			if (subscribers.length === 0) stop();
		};
	}

	return { set, update, subscribe };
}

function derived(stores, fn, initial_value) {
	const single = !Array.isArray(stores);
	if (single) stores = [stores];

	const auto = fn.length < 2;

	return readable(initial_value, set => {
		let inited = false;
		const values = [];

		let pending = 0;

		const sync = () => {
			if (pending) return;
			const result = fn(single ? values[0] : values, set);
			if (auto) set(result);
		};

		const unsubscribers = stores.map((store, i) => store.subscribe(
			value => {
				values[i] = value;
				pending &= ~(1 << i);
				if (inited) sync();
			},
			() => {
				pending |= (1 << i);
			})
		);

		inited = true;
		sync();

		return function stop() {
			run_all(unsubscribers);
		};
	});
}

const LOCATION = {};
const ROUTER = {};

/**
 * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/history.js
 *
 * https://github.com/reach/router/blob/master/LICENSE
 * */

function getLocation(source) {
  return {
    ...source.location,
    state: source.history.state,
    key: (source.history.state && source.history.state.key) || "initial"
  };
}

function createHistory(source, options) {
  const listeners = [];
  let location = getLocation(source);

  return {
    get location() {
      return location;
    },

    listen(listener) {
      listeners.push(listener);

      const popstateListener = () => {
        location = getLocation(source);
        listener({ location, action: "POP" });
      };

      source.addEventListener("popstate", popstateListener);

      return () => {
        source.removeEventListener("popstate", popstateListener);

        const index = listeners.indexOf(listener);
        listeners.splice(index, 1);
      };
    },

    navigate(to, { state, replace = false } = {}) {
      state = { ...state, key: Date.now() + "" };
      // try...catch iOS Safari limits to 100 pushState calls
      try {
        if (replace) {
          source.history.replaceState(state, null, to);
        } else {
          source.history.pushState(state, null, to);
        }
      } catch (e) {
        source.location[replace ? "replace" : "assign"](to);
      }

      location = getLocation(source);
      listeners.forEach(listener => listener({ location, action: "PUSH" }));
    }
  };
}

// Stores history entries in memory for testing or other platforms like Native
function createMemorySource(initialPathname = "/") {
  let index = 0;
  const stack = [{ pathname: initialPathname, search: "" }];
  const states = [];

  return {
    get location() {
      return stack[index];
    },
    addEventListener(name, fn) {},
    removeEventListener(name, fn) {},
    history: {
      get entries() {
        return stack;
      },
      get index() {
        return index;
      },
      get state() {
        return states[index];
      },
      pushState(state, _, uri) {
        const [pathname, search = ""] = uri.split("?");
        index++;
        stack.push({ pathname, search });
        states.push(state);
      },
      replaceState(state, _, uri) {
        const [pathname, search = ""] = uri.split("?");
        stack[index] = { pathname, search };
        states[index] = state;
      }
    }
  };
}

// Global history uses window.history as the source if available,
// otherwise a memory history
const canUseDOM = Boolean(
  typeof window !== "undefined" &&
    window.document &&
    window.document.createElement
);
const globalHistory = createHistory(canUseDOM ? window : createMemorySource());

/**
 * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/utils.js
 *
 * https://github.com/reach/router/blob/master/LICENSE
 * */

const paramRe = /^:(.+)/;

const SEGMENT_POINTS = 4;
const STATIC_POINTS = 3;
const DYNAMIC_POINTS = 2;
const SPLAT_PENALTY = 1;
const ROOT_POINTS = 1;

/**
 * Check if `string` starts with `search`
 * @param {string} string
 * @param {string} search
 * @return {boolean}
 */
function startsWith(string, search) {
  return string.substr(0, search.length) === search;
}

/**
 * Check if `segment` is a root segment
 * @param {string} segment
 * @return {boolean}
 */
function isRootSegment(segment) {
  return segment === "";
}
/**
 * Check if `segment` is a dynamic segment
 * @param {string} segment
 * @return {boolean}
 */
function isDynamic(segment) {
  return paramRe.test(segment);
}
/**
 * Check if `segment` is a splat
 * @param {string} segment
 * @return {boolean}
 */
function isSplat(segment) {
  return segment === "*";
}

/**
 * Split up the URI into segments delimited by `/`
 * @param {string} uri
 * @return {string[]}
 */
function segmentize(uri) {
  return (
    uri
      // Strip starting/ending `/`
      .replace(/(^\/+|\/+$)/g, "")
      .split("/")
  );
}

/**
 * Strip `str` of potential start and end `/`
 * @param {string} str
 * @return {string}
 */
function stripSlashes(str) {
  return str.replace(/(^\/+|\/+$)/g, "");
}

/**
 * Score a route depending on how its individual segments look
 * @param {object} route
 * @param {number} index
 * @return {object}
 */
function rankRoute(route, index) {
  const score = route.default
    ? 0
    : segmentize(route.path).reduce((score, segment) => {
        score += SEGMENT_POINTS;

        if (isRootSegment(segment)) {
          score += ROOT_POINTS;
        } else if (isDynamic(segment)) {
          score += DYNAMIC_POINTS;
        } else if (isSplat(segment)) {
          score -= SEGMENT_POINTS + SPLAT_PENALTY;
        } else {
          score += STATIC_POINTS;
        }

        return score;
      }, 0);

  return { route, score, index };
}

/**
 * Give a score to all routes and sort them on that
 * @param {object[]} routes
 * @return {object[]}
 */
function rankRoutes(routes) {
  return (
    routes
      .map(rankRoute)
      // If two routes have the exact same score, we go by index instead
      .sort((a, b) =>
        a.score < b.score ? 1 : a.score > b.score ? -1 : a.index - b.index
      )
  );
}

/**
 * Ranks and picks the best route to match. Each segment gets the highest
 * amount of points, then the type of segment gets an additional amount of
 * points where
 *
 *  static > dynamic > splat > root
 *
 * This way we don't have to worry about the order of our routes, let the
 * computers do it.
 *
 * A route looks like this
 *
 *  { path, default, value }
 *
 * And a returned match looks like:
 *
 *  { route, params, uri }
 *
 * @param {object[]} routes
 * @param {string} uri
 * @return {?object}
 */
function pick(routes, uri) {
  let match;
  let default_;

  const [uriPathname] = uri.split("?");
  const uriSegments = segmentize(uriPathname);
  const isRootUri = uriSegments[0] === "";
  const ranked = rankRoutes(routes);

  for (let i = 0, l = ranked.length; i < l; i++) {
    const route = ranked[i].route;
    let missed = false;

    if (route.default) {
      default_ = {
        route,
        params: {},
        uri
      };
      continue;
    }

    const routeSegments = segmentize(route.path);
    const params = {};
    const max = Math.max(uriSegments.length, routeSegments.length);
    let index = 0;

    for (; index < max; index++) {
      const routeSegment = routeSegments[index];
      const uriSegment = uriSegments[index];

      let isSplat = routeSegment === "*";
      if (isSplat) {
        // Hit a splat, just grab the rest, and return a match
        // uri:   /files/documents/work
        // route: /files/*
        params["*"] = uriSegments
          .slice(index)
          .map(decodeURIComponent)
          .join("/");
        break;
      }

      if (uriSegment === undefined) {
        // URI is shorter than the route, no match
        // uri:   /users
        // route: /users/:userId
        missed = true;
        break;
      }

      let dynamicMatch = paramRe.exec(routeSegment);

      if (dynamicMatch && !isRootUri) {
        const value = decodeURIComponent(uriSegment);
        params[dynamicMatch[1]] = value;
      } else if (routeSegment !== uriSegment) {
        // Current segments don't match, not dynamic, not splat, so no match
        // uri:   /users/123/settings
        // route: /users/:id/profile
        missed = true;
        break;
      }
    }

    if (!missed) {
      match = {
        route,
        params,
        uri: "/" + uriSegments.slice(0, index).join("/")
      };
      break;
    }
  }

  return match || default_ || null;
}

/**
 * Check if the `path` matches the `uri`.
 * @param {string} path
 * @param {string} uri
 * @return {?object}
 */
function match(route, uri) {
  return pick([route], uri);
}

/**
 * Add the query to the pathname if a query is given
 * @param {string} pathname
 * @param {string} [query]
 * @return {string}
 */
function addQuery(pathname, query) {
  return pathname + (query ? `?${query}` : "");
}

/**
 * Resolve URIs as though every path is a directory, no files. Relative URIs
 * in the browser can feel awkward because not only can you be "in a directory",
 * you can be "at a file", too. For example:
 *
 *  browserSpecResolve('foo', '/bar/') => /bar/foo
 *  browserSpecResolve('foo', '/bar') => /foo
 *
 * But on the command line of a file system, it's not as complicated. You can't
 * `cd` from a file, only directories. This way, links have to know less about
 * their current path. To go deeper you can do this:
 *
 *  <Link to="deeper"/>
 *  // instead of
 *  <Link to=`{${props.uri}/deeper}`/>
 *
 * Just like `cd`, if you want to go deeper from the command line, you do this:
 *
 *  cd deeper
 *  # not
 *  cd $(pwd)/deeper
 *
 * By treating every path as a directory, linking to relative paths should
 * require less contextual information and (fingers crossed) be more intuitive.
 * @param {string} to
 * @param {string} base
 * @return {string}
 */
function resolve(to, base) {
  // /foo/bar, /baz/qux => /foo/bar
  if (startsWith(to, "/")) {
    return to;
  }

  const [toPathname, toQuery] = to.split("?");
  const [basePathname] = base.split("?");
  const toSegments = segmentize(toPathname);
  const baseSegments = segmentize(basePathname);

  // ?a=b, /users?b=c => /users?a=b
  if (toSegments[0] === "") {
    return addQuery(basePathname, toQuery);
  }

  // profile, /users/789 => /users/789/profile
  if (!startsWith(toSegments[0], ".")) {
    const pathname = baseSegments.concat(toSegments).join("/");

    return addQuery((basePathname === "/" ? "" : "/") + pathname, toQuery);
  }

  // ./       , /users/123 => /users/123
  // ../      , /users/123 => /users
  // ../..    , /users/123 => /
  // ../../one, /a/b/c/d   => /a/b/one
  // .././one , /a/b/c/d   => /a/b/c/one
  const allSegments = baseSegments.concat(toSegments);
  const segments = [];

  allSegments.forEach(segment => {
    if (segment === "..") {
      segments.pop();
    } else if (segment !== ".") {
      segments.push(segment);
    }
  });

  return addQuery("/" + segments.join("/"), toQuery);
}

/**
 * Combines the `basepath` and the `path` into one path.
 * @param {string} basepath
 * @param {string} path
 */
function combinePaths(basepath, path) {
  return `${stripSlashes(
    path === "/" ? basepath : `${stripSlashes(basepath)}/${stripSlashes(path)}`
  )}/*`;
}

/* node_modules/svelte-routing/src/Router.svelte generated by Svelte v3.2.2 */

const Router = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let $base, $location, $routes;

	

  let { basepath = "/", url = null } = $$props;

  const locationContext = getContext(LOCATION);
  const routerContext = getContext(ROUTER);

  const routes = writable([]); $routes = get_store_value(routes);
  const activeRoute = writable(null);
  let hasActiveRoute = false; // Used in SSR to synchronously set that a Route is active.

  // If locationContext is not set, this is the topmost Router in the tree.
  // If the `url` prop is given we force the location to it.
  const location =
    locationContext ||
    writable(url ? { pathname: url } : globalHistory.location); $location = get_store_value(location);

  // If routerContext is set, the routerBase of the parent Router
  // will be the base for this Router's descendants.
  // If routerContext is not set, the path and resolved uri will both
  // have the value of the basepath prop.
  const base = routerContext
    ? routerContext.routerBase
    : writable({
        path: basepath,
        uri: basepath
      }); $base = get_store_value(base);

  const routerBase = derived([base, activeRoute], ([base, activeRoute]) => {
    // If there is no activeRoute, the routerBase will be identical to the base.
    if (activeRoute === null) {
      return base;
    }

    const { path: basepath } = base;
    const { route, uri } = activeRoute;
    // Remove the /* from the end for child Routes relative paths.
    const path = route.default ? basepath : route.path.replace(/\*$/, "");

    return { path, uri };
  });

  function registerRoute(route) {
    const { path: basepath } = $base;
    let { path } = route;

    // We store the original path in the _path property so we can reuse
    // it when the basepath changes. The only thing that matters is that
    // the route reference is intact, so mutation is fine.
    route._path = path;
    route.path = combinePaths(basepath, path);

    if (typeof window === "undefined") {
      // In SSR we should set the activeRoute immediately if it is a match.
      // If there are more Routes being registered after a match is found,
      // we just skip them.
      if (hasActiveRoute) {
        return;
      }

      const matchingRoute = match(route, $location.pathname);
      if (matchingRoute) {
        activeRoute.set(matchingRoute);
        hasActiveRoute = true;
      }
    } else {
      routes.update(rs => {
        rs.push(route);
        return rs;
      });
    }
  }

  function unregisterRoute(route) {
    routes.update(rs => {
      const index = rs.indexOf(route);
      rs.splice(index, 1);
      return rs;
    });
  }

  if (!locationContext) {
    // The topmost Router in the tree is responsible for updating
    // the location store and supplying it through context.
    onMount(() => {
      const unlisten = globalHistory.listen(history => {
        location.set(history.location);
      });

      return unlisten;
    });

    setContext(LOCATION, location);
  }

  setContext(ROUTER, {
    activeRoute,
    base,
    routerBase,
    registerRoute,
    unregisterRoute
  });

	if ($$props.basepath === void 0 && $$bindings.basepath && basepath !== void 0) $$bindings.basepath(basepath);
	if ($$props.url === void 0 && $$bindings.url && url !== void 0) $$bindings.url(url);

	$base = get_store_value(base);
	$location = get_store_value(location);
	$routes = get_store_value(routes);

	{
        const { path: basepath } = $base;
        routes.update(rs => {
          rs.forEach(r => (r.path = combinePaths(basepath, r._path)));
          return rs;
        });
      }
	{
        const bestMatch = pick($routes, $location.pathname);
        activeRoute.set(bestMatch);
      }

	return `${$$slots.default ? $$slots.default() : ``}`;
});

/* node_modules/svelte-routing/src/Route.svelte generated by Svelte v3.2.2 */

const Route = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let $activeRoute;

	

  let { path = "", component = null } = $$props;

  const { registerRoute, unregisterRoute, activeRoute } = getContext(ROUTER); $activeRoute = get_store_value(activeRoute);

  const route = {
    path,
    // If no path prop is given, this Route will act as the default Route
    // that is rendered if no other Route in the Router is a match.
    default: path === ""
  };
  let routeParams = {};

  registerRoute(route);

  // There is no need to unregister Routes in SSR since it will all be
  // thrown away anyway.
  if (typeof window !== "undefined") {
    onDestroy(() => {
      unregisterRoute(route);
    });
  }

	if ($$props.path === void 0 && $$bindings.path && path !== void 0) $$bindings.path(path);
	if ($$props.component === void 0 && $$bindings.component && component !== void 0) $$bindings.component(component);

	$activeRoute = get_store_value(activeRoute);

	if ($activeRoute && $activeRoute.route === route) {
        const { params } = $activeRoute;
        routeParams = Object.keys(params).reduce((acc, param) => {
          if (param !== "*") {
            acc[param] = params[param];
          }
          return acc;
        }, {});
      }

	return `${ $activeRoute !== null && $activeRoute.route === route ? `${ component !== null ? `${validate_component(((component) || missing_component), 'svelte:component').$$render($$result, Object.assign(routeParams), {}, {})}` : `${$$slots.default ? $$slots.default() : ``}` }` : `` }`;
});

/* node_modules/svelte-routing/src/Link.svelte generated by Svelte v3.2.2 */

const Link = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let $base, $location;

	

  let { to = "#", replace = false, state = {}, getProps = () => ({}) } = $$props;

  const { base } = getContext(ROUTER); $base = get_store_value(base);
  const location = getContext(LOCATION); $location = get_store_value(location);

  let href, isPartiallyCurrent, isCurrent, props;

	if ($$props.to === void 0 && $$bindings.to && to !== void 0) $$bindings.to(to);
	if ($$props.replace === void 0 && $$bindings.replace && replace !== void 0) $$bindings.replace(replace);
	if ($$props.state === void 0 && $$bindings.state && state !== void 0) $$bindings.state(state);
	if ($$props.getProps === void 0 && $$bindings.getProps && getProps !== void 0) $$bindings.getProps(getProps);

	$base = get_store_value(base);
	$location = get_store_value(location);

	href = to === "/" ? $base.uri : resolve(to, $base.uri);
	isPartiallyCurrent = startsWith($location.pathname, href);
	isCurrent = href === $location.pathname;
	let ariaCurrent = isCurrent ? "page" : undefined;
	props = getProps({
        location: $location,
        href,
        isPartiallyCurrent,
        isCurrent
      });

	return `<a${spread([{ href: `${escape(href)}` }, { "aria-current": `${escape(ariaCurrent)}` }, props])}>
	  ${$$slots.default ? $$slots.default() : ``}
	</a>`;
});

/* src/components/NavLink.svelte generated by Svelte v3.2.2 */

function getProps({ location, href, isPartiallyCurrent, isCurrent }) {
  const isActive = href === "/" ? isCurrent : isPartiallyCurrent || isCurrent;

  // The object returned here is spread on the anchor element's attributes
  if (isActive) {
    return { class: "active" };
  }
  return {};
}

const NavLink = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let { to = "" } = $$props;

	if ($$props.to === void 0 && $$bindings.to && to !== void 0) $$bindings.to(to);

	return `${validate_component(Link, 'Link').$$render($$result, { to: to, getProps: getProps }, {}, {
		default: () => `
	  ${$$slots.default ? $$slots.default() : ``}
	`
	})}`;
});

/* src/routes/Home.svelte generated by Svelte v3.2.2 */

const Home = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	return `<h1>Home</h1>
	<p>Welcome to my website</p>`;
});

/* src/routes/About.svelte generated by Svelte v3.2.2 */

const About = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	return `<h1>About</h1>
	<p>I like to code</p>`;
});

/* src/routes/Blog.svelte generated by Svelte v3.2.2 */

const Blog = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	return `${validate_component(Router, 'Router').$$render($$result, {}, {}, {
		default: () => `
	  <h1>Blog</h1>

	  <ul>
	    <li>${validate_component(Link, 'Link').$$render($$result, { to: "first" }, {}, {
		default: () => `Today I did something cool`
	})}</li>
	    <li>${validate_component(Link, 'Link').$$render($$result, { to: "second" }, {}, {
		default: () => `I did something awesome today`
	})}</li>
	    <li>${validate_component(Link, 'Link').$$render($$result, { to: "third" }, {}, {
		default: () => `Did something sweet today`
	})}</li>
	  </ul>

	  ${validate_component(Route, 'Route').$$render($$result, { path: "first" }, {}, {
		default: () => `
	    <p>
	      I did something cool today. Lorem ipsum dolor sit amet, consectetur 
	      adipisicing elit. Quisquam rerum asperiores, ex animi sunt ipsum. Voluptas 
	      sint id hic. Vel neque maxime exercitationem facere culpa nisi, nihil 
	      incidunt quo nostrum, beatae dignissimos dolores natus quaerat! Quasi sint 
	      praesentium inventore quidem, deserunt atque ipsum similique dolores maiores
	      expedita, qui totam. Totam et incidunt assumenda quas explicabo corporis 
	      eligendi amet sint ducimus, culpa fugit esse. Tempore dolorum sit 
	      perspiciatis corporis molestias nemo, veritatis, asperiores earum! 
	      Ex repudiandae aperiam asperiores esse minus veniam sapiente corrupti 
	      alias deleniti excepturi saepe explicabo eveniet harum fuga numquam 
	      nostrum adipisci pariatur iusto sint, impedit provident repellat quis?
	    </p>
	  `
	})}
	  ${validate_component(Route, 'Route').$$render($$result, { path: "second" }, {}, {
		default: () => `
	    <p>
	      I did something awesome today. Lorem ipsum dolor sit amet, consectetur 
	      adipisicing elit. Repudiandae enim quasi animi, vero deleniti dignissimos 
	      sapiente perspiciatis. Veniam, repellendus, maiores.
	    </p>
	  `
	})}
	  ${validate_component(Route, 'Route').$$render($$result, { path: "third" }, {}, {
		default: () => `
	    <p>
	      I did something sweet today. Lorem ipsum dolor sit amet, consectetur 
	      adipisicing elit. Modi ad voluptas rem consequatur commodi minima doloribus 
	      veritatis nam, quas, culpa autem repellat saepe quam deleniti maxime delectus 
	      fuga totam libero sit neque illo! Sapiente consequatur rem minima expedita 
	      nemo blanditiis, aut veritatis alias nostrum vel? Esse molestias placeat, 
	      doloribus commodi.
	    </p>
	  `
	})}
	`
	})}`;
});

/* src/App.svelte generated by Svelte v3.2.2 */

const App = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	

  // Used for SSR. A falsy value is ignored by the Router.
  let { url = "" } = $$props;

	if ($$props.url === void 0 && $$bindings.url && url !== void 0) $$bindings.url(url);

	return `${validate_component(Router, 'Router').$$render($$result, { url: url }, {}, {
		default: () => `
	  <nav>
	    ${validate_component(NavLink, 'NavLink').$$render($$result, { to: "/" }, {}, { default: () => `Home` })}
	    ${validate_component(NavLink, 'NavLink').$$render($$result, { to: "about" }, {}, { default: () => `About` })}
	    ${validate_component(NavLink, 'NavLink').$$render($$result, { to: "blog" }, {}, { default: () => `Blog` })}
	  </nav>
	  <div>
	    ${validate_component(Route, 'Route').$$render($$result, { path: "about", component: About }, {}, {})}
	    ${validate_component(Route, 'Route').$$render($$result, { path: "blog", component: Blog }, {}, {})}
	    ${validate_component(Route, 'Route').$$render($$result, { path: "/", component: Home }, {}, {})}
	  </div>
	`
	})}`;
});

module.exports = App;
