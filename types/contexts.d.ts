import { getContext } from "svelte";
import { RouteLocation } from "./Route";
import { RouterProps } from "./Router";

type LOCATION = RouteLocation;
type ROUTER = RouterProps;
type HISTORY = Record<string | number, any>;

export const useLocation: () => typeof getContext<LOCATION>;
export const useRouter: () => typeof getContext<ROUTER>;
export const useHistory: () => typeof getContext<HISTORY>;
