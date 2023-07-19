import { readable } from "svelte/store";
import { RouteLocation } from "./Route";
import { RouterProps } from "./Router";

type LOCATION = RouteLocation;
type ROUTER = RouterProps;
type HISTORY = Record<string | number, any>;

export const useLocation: () => ReturnType<typeof readable<LOCATION>>;
export const useRouter: () => ReturnType<typeof readable<ROUTER>>;
export const useHistory: () => ReturnType<typeof readable<HISTORY>>;
