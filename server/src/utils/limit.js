

export function parseLimit(value, {defaultValue, max}) {
    value = value ? value : defaultValue
    const rawLimit = Number.parseInt(value, 10) 
    console.log(rawLimit);
    
    const limit = Number.isNaN(rawLimit) || rawLimit < 1 || rawLimit > max || rawLimit % 1 !== 0 ? null : rawLimit
    
    return limit
}