import { debounce } from "lodash";

export const searchDebounce = (fetchFunc: (value: string) => void) =>
    debounce((searchValue: string) => {
        fetchFunc(searchValue);
    }, 1000);