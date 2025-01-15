import { students, classes } from '../data/data.js';
import { applyFilters, applySort, applyPagination } from '../utils.js';

export function ListStudents(call, callback) {
    let result = [...students];
    result = applyFilters(result, call.request.filters);
    result = applySort(result, call.request.sorts);
    result = applyPagination(result, call.request.pagination);
    callback(null, { students: result });
}

export function GetStudent(call, callback) {
    const student = students.find((s) => s.id === call.request.id);
    if (!student) {
        return callback(new Error('Student not found'), null);
    }
    callback(null, { student });
}

export function CreateStudent(call, callback) {
    const { name, age, gender, classId, grades, absences } = call.request;
    if (!name || !age || !gender || !classId) {
        return callback(new Error('Missing required fields'), null);
    }
    const newId = (students.length + 1).toString();
    const foundClass = classes.find((c) => c.id === classId) || null;

    const newStudent = {
        id: newId,
        name,
        age,
        gender,
        classInfo: foundClass,
        grades: grades || [],
        absences: absences || [],
    };
    students.push(newStudent);
    callback(null, { student: newStudent });
}

export function UpdateStudent(call, callback) {
    const { id, name, age, gender, classId, grades, absences } = call.request;
    const studentIndex = students.findIndex((s) => s.id === id);

    if (studentIndex === -1) {
        return callback(new Error('Student not found'), null);
    }

    const existingStudent = students[studentIndex];

    if (name !== undefined) {
        existingStudent.name = name;
    }
    if (age !== undefined) {
        existingStudent.age = age;
    }
    if (gender !== undefined) {
        existingStudent.gender = gender;
    }
    if (classId !== undefined) {
        const foundClass = classes.find((c) => c.id === classId) || existingStudent.classInfo;
        existingStudent.classInfo = foundClass;
    }
    if (grades !== undefined) {
        existingStudent.grades = grades;
    }
    if (absences !== undefined) {
        existingStudent.absences = absences;
    }

    students[studentIndex] = existingStudent;
    callback(null, { student: existingStudent });
}


export function DeleteStudent(call, callback) {
    const studentIndex = students.findIndex((s) => s.id === call.request.id);
    if (studentIndex === -1) {
        return callback(new Error('Student not found'), null);
    }
    students.splice(studentIndex, 1);
    callback(null, {});
}
