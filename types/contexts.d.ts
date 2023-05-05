import { RouteLocation } from "./Route";
import { RouterProps } from "./Router";

type LOCATION = RouteLocation;
type ROUTER = RouterProps;
type HISTORY = Record<string | number, any>;

type useLocation = () => RouteLocation;
type useRouter = () => RouterProps;
type useHistory = () => Record<string | number, any>;
