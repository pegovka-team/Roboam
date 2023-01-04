export function ignoreCaseIncludes(value: string, searchString: string) {
    return value.toLowerCase().includes(searchString.toLowerCase());
}
