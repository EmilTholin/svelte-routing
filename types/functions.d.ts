export const navigate: (
    to: string,
    {
        replace,
        state,
        preserveScroll,
    }?: {
        replace?: boolean;
        state?: {
            [k in string | number]: unknown;
        };
        preserveScroll?: boolean;
    }
) => void;
