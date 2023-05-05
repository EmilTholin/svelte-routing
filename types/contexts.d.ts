import { getContext } from "svelte";
import { RouteLocation } from "./Route";
import { RouterProps } from "./Router";
// import { useLocation, useRouter, useHistory } from "../src/contexts";

type LOCATION = RouteLocation;
type ROUTER = RouterProps;
type HISTORY = Record<string | number, any>;

export const useLocation: () => getContext<LOCATION>;
export const useRouter: () => getContext<ROUTER>;
export const useHistory: () => getContext<HISTORY>;
