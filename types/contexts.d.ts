import { readable } from "svelte/store";
import { RouteLocation } from "./Route";
import { RouterContext } from "./RouterContext";

type LOCATION = RouteLocation;
type ROUTER = RouterContext;
type HISTORY = Record<string | number, any>;

export const useLocation: () => ReturnType<typeof readable<LOCATION>>;
export const useRouter: () => ROUTER;
export const useHistory: () => ReturnType<typeof readable<HISTORY>>;
