import { classes, subjects } from '../data/data.js';
import { applyFilters, applySort, applyPagination } from '../utils.js';

export function ListClasses(call, callback) {
    let result = [...classes];
    result = applyFilters(result, call.request.filters);
    result = applySort(result, call.request.sorts);
    result = applyPagination(result, call.request.pagination);
    callback(null, { classes: result });
}

export function GetClass(call, callback) {
    const foundClass = classes.find((c) => c.id === call.request.id);
    if (!foundClass) {
        return callback(new Error('Class not found'), null);
    }
    callback(null, { classObj: foundClass });
}

export function CreateClass(call, callback) {
    const { name, subjectIds } = call.request;
    if (!name || !subjectIds || subjectIds.length === 0) {
        return callback(new Error('Missing required fields'), null);
    }
    const newId = (classes.length + 1).toString();
    const subjs = subjectIds
        .map((sid) => subjects.find((s) => s.id === sid))
        .filter(Boolean);

    const newClass = {
        id: newId,
        name,
        subjects: subjs,
    };
    classes.push(newClass);
    callback(null, { classObj: newClass });
}

export function UpdateClass(call, callback) {
    const { id, name, subjectIds } = call.request;
    const classIndex = classes.findIndex((c) => c.id === id);
    if (classIndex === -1) {
        return callback(new Error('Class not found'), null);
    }
    if (!name || !subjectIds || subjectIds.length === 0) {
        return callback(new Error('Missing required fields'), null);
    }
    const subjs = subjectIds
        .map((sid) => subjects.find((s) => s.id === sid))
        .filter(Boolean);

    const updatedClass = { id, name, subjects: subjs };
    classes[classIndex] = updatedClass;
    callback(null, { classObj: updatedClass });
}

export function DeleteClass(call, callback) {
    const classIndex = classes.findIndex((c) => c.id === call.request.id);
    if (classIndex === -1) {
        return callback(new Error('Class not found'), null);
    }
    classes.splice(classIndex, 1);
    callback(null, {});
}
