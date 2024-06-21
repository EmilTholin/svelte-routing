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
        blurActiveElement?: boolean;
    }
) => void;

export const listen: (
    listener: (data: {
        location: Location & {
            state: any,
            key: string
        },
        action: "POP"|"PUSH"
    }) => void
) => () => void;
