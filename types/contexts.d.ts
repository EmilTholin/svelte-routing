import { getContext } from "svelte";
import { RouteLocation } from "./Route";
import { RouterProps } from "./Router";

type LOCATION = RouteLocation;
type ROUTER = RouterProps;
type HISTORY = Record<string | number, any>;

export const useLocation: () => ReturnType<typeof getContext<LOCATION>>;
export const useRouter: () => ReturnType<typeof getContext<ROUTER>>;
export const useHistory: () => ReturnType<typeof getContext<HISTORY>>;
