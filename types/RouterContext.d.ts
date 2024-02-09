import { readable } from "svelte/store";

type RouteConfig = {
    path: string;
    default: boolean;
}

type ActiveRoute = {
    params: { [key: string]: string };
    preserveScroll: boolean;
    route: RouteConfig;
    uri: string;
}

type RouterBase = {
    path: string;
    uri: string;
}

export type RouterContext = {
    activeRoute: ReturnType<typeof readable<ActiveRoute>>;
    base: ReturnType<typeof readable<RouterBase>>;
    routerBase: ReturnType<typeof readable<RouterBase>>;
    registerRoute: (route: Omit<RouteConfig, 'default'>) => {};
    unregisterRouter: () => {}
}