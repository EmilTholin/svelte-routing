import { getContext } from "svelte";

export const LOCATION = {};
export const ROUTER = {};
export const HISTORY = {};

export const useLocation = () => getContext(LOCATION);
export const useRouter = () => getContext(ROUTER);
export const useHistory = () => getContext(HISTORY);
