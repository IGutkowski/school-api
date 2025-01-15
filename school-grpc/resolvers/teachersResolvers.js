import { teachers } from '../data/data.js';
import { applyFilters, applySort, applyPagination } from '../utils.js';

export function ListTeachers(call, callback) {
    let result = [...teachers];
    result = applyFilters(result, call.request.filters);
    result = applySort(result, call.request.sorts);
    result = applyPagination(result, call.request.pagination);
    callback(null, { teachers: result });
}

export function GetTeacher(call, callback) {
    const teacher = teachers.find((t) => t.id === call.request.id);
    if (!teacher) {
        return callback(new Error('Teacher not found'), null);
    }
    callback(null, { teacher });
}

export function CreateTeacher(call, callback) {
    const { name, gender, subject } = call.request;
    if (!name || !gender || !subject) {
        return callback(new Error('Missing required fields'), null);
    }
    const newId = (teachers.length + 1).toString();
    const newTeacher = { id: newId, name, gender, subject };
    teachers.push(newTeacher);
    callback(null, { teacher: newTeacher });
}

export function UpdateTeacher(call, callback) {
    const { id, name, gender, subject } = call.request;
    const teacherIndex = teachers.findIndex((t) => t.id === id);
    if (teacherIndex === -1) {
        return callback(new Error('Teacher not found'), null);
    }
    if (!name || !gender || !subject) {
        return callback(new Error('Missing required fields'), null);
    }
    const updatedTeacher = { id, name, gender, subject };
    teachers[teacherIndex] = updatedTeacher;
    callback(null, { teacher: updatedTeacher });
}

export function DeleteTeacher(call, callback) {
    const teacherIndex = teachers.findIndex((t) => t.id === call.request.id);
    if (teacherIndex === -1) {
        return callback(new Error('Teacher not found'), null);
    }
    teachers.splice(teacherIndex, 1);
    callback(null, {});
}
