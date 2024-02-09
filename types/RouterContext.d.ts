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
    activeRoute: ActiveRoute;
    base: RouterBase;
    routerBase: RouterBase;
    registerRoute: (route: Omit<RouteConfig, 'default'>) => {};
    unregisterRouter: () => {}
}