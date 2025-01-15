export function applyFilters(items, filters) {
    if (!filters || filters.length === 0) return items;
    return items.filter((item) => {
        return filters.every((f) => {
            const fieldVal = item[f.field] ?? '';
            return fieldVal.toLowerCase() === f.value.toLowerCase();
        });
    });
}



export function applySort(items, sorts) {
    if (!sorts || sorts.length === 0) return items;
    const { field, ascending } = sorts[0];
    return items.sort((a, b) => {
        const valA = a[field]?.toString().toLowerCase() || '';
        const valB = b[field]?.toString().toLowerCase() || '';
        if (valA < valB) return ascending ? -1 : 1;
        if (valA > valB) return ascending ? 1 : -1;
        return 0;
    });
}

export function applyPagination(items, pagination) {
    if (!pagination) return items;
    const page = pagination.page || 1;
    const pageSize = pagination.pageSize || items.length;
    const startIndex = (page - 1) * pageSize;
    return items.slice(startIndex, startIndex + pageSize);
}
