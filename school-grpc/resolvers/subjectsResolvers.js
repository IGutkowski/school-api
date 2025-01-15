import { subjects, teachers } from '../data/data.js';
import { applyFilters, applySort, applyPagination } from '../utils.js';

export function ListSubjects(call, callback) {
    let result = [...subjects];
    result = applyFilters(result, call.request.filters);
    result = applySort(result, call.request.sorts);
    result = applyPagination(result, call.request.pagination);
    callback(null, { subjects: result });
}

export function GetSubject(call, callback) {
    const subject = subjects.find((s) => s.id === call.request.id);
    if (!subject) {
        return callback(new Error('Subject not found'), null);
    }
    callback(null, { subject });
}

export function CreateSubject(call, callback) {
    const { name, teacherId, teacherName } = call.request;
    if (!name || !teacherId || !teacherName) {
        return callback(new Error('Missing required fields'), null);
    }
    const newId = (subjects.length + 1).toString();
    const foundTeacher = teachers.find((t) => t.id === teacherId);
    const teacherObj = foundTeacher
        ? foundTeacher
        : { id: teacherId, name: teacherName, gender: '', subject: name };

    const newSubject = { id: newId, name, teacher: teacherObj };
    subjects.push(newSubject);
    callback(null, { subject: newSubject });
}

export function UpdateSubject(call, callback) {
    const { id, name, teacherId, teacherName } = call.request;
    const subjectIndex = subjects.findIndex((s) => s.id === id);
    if (subjectIndex === -1) {
        return callback(new Error('Subject not found'), null);
    }
    if (!name || !teacherId || !teacherName) {
        return callback(new Error('Missing required fields'), null);
    }
    const foundTeacher = teachers.find((t) => t.id === teacherId);
    const teacherObj = foundTeacher
        ? foundTeacher
        : { id: teacherId, name: teacherName };

    const updatedSubject = {
        id,
        name,
        teacher: teacherObj,
    };
    subjects[subjectIndex] = updatedSubject;
    callback(null, { subject: updatedSubject });
}

export function DeleteSubject(call, callback) {
    const subjectIndex = subjects.findIndex((s) => s.id === call.request.id);
    if (subjectIndex === -1) {
        return callback(new Error('Subject not found'), null);
    }
    subjects.splice(subjectIndex, 1);
    callback(null, {});
}
