export const MAX_LIMIT = 50;
export const DEFAULT = 10;

export function parseLimit(value = DEFAULT) {
    const rawLimit = Number.parseInt(value, 10)    

    const limit = Number.isNaN(rawLimit) || rawLimit < 1 || rawLimit > MAX_LIMIT ? null : rawLimit

    return limit
}