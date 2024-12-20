import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import depthLimit from 'graphql-depth-limit';
import { GraphQLJSON } from 'graphql-type-json';
import cors from 'cors';
import {students, teachers, classes, subjects,} from "./data.js";
import {JSONScalar, typeDefs} from "./typedefs.js";

const applyFilters = (data, filters) => {
    if (!filters) return data;
    return data.filter(item => {
        let valid = true;
        if (filters.name) {
            if (filters.name.equals && item.name !== filters.name.equals) valid = false;
            if (filters.name.contains && !item.name.includes(filters.name.contains)) valid = false;
            if (filters.name.notEquals && item.name === filters.name.notEquals) valid = false;
            if (filters.name.notContains && item.name.includes(filters.name.notContains)) valid = false;
        }
        if (filters.age) {
            if (filters.age.equals && item.age !== filters.age.equals) valid = false;
            if (filters.age.greaterThan && item.age <= filters.age.greaterThan) valid = false;
            if (filters.age.lessThan && item.age >= filters.age.lessThan) valid = false;
            if (filters.age.greaterThanOrEqual && item.age < filters.age.greaterThanOrEqual) valid = false;
            if (filters.age.lessThanOrEqual && item.age > filters.age.lessThanOrEqual) valid = false;
        }
        return valid;
    });
};

const applySortingAndPagination = (data, sortBy, limit, offset) => {
    if (sortBy) data.sort((a, b) => (a[sortBy] > b[sortBy] ? 1 : -1));
    if (offset) data = data.slice(offset);
    if (limit) data = data.slice(0, limit);
    return data;
};

const resolvers = {
        JSON: JSONScalar,
    Query: {
        students: (_, { filter, sortBy, limit, offset }) => applySortingAndPagination(applyFilters(students, filter), sortBy, limit, offset),
        student: (_, { id }) => students.find(s => s.id === id),
        teachers: (_, { filter, sortBy, limit, offset }) => applySortingAndPagination(applyFilters(teachers, filter), sortBy, limit, offset),
        teacher: (_, { id }) => teachers.find(t => t.id === id),
        classes: (_, { filter, sortBy, limit, offset }) => applySortingAndPagination(applyFilters(classes, filter), sortBy, limit, offset),
        class: (_, { id }) => classes.find(c => c.id === id),
        subjects: (_, { filter, sortBy, limit, offset }) => applySortingAndPagination(applyFilters(subjects, filter), sortBy, limit, offset),
        subject: (_, { id }) => subjects.find(s => s.id === id),
    },
    Student: {
        class: student => classes.find(c => c.id === student.classId),
    },
    Teacher: {
        subject: teacher => subjects.find(s => s.id === teacher.subjectId),
    },
    Class: {
        subjects: clas => clas.subjectIds.map(id => subjects.find(s => s.id === id)),
    },
    Subject: {
        teacher: subject => teachers.find(t => t.id === subject.teacherId),
    },
    Mutation: {
        addStudent: (_, { input }) => {
            const newStudent = { id: `${students.length + 1}`, ...input };
            students.push(newStudent);
            return newStudent;
        },
        updateStudent: (_, { input }) => {
            const student = students.find(s => s.id === input.id);
            if (!student) return null;
            Object.assign(student, input);
            return student;
        },
        deleteStudent: (_, { id }) => {
            const index = students.findIndex(s => s.id === id);
            if (index === -1) return false;
            students.splice(index, 1);
            return true;
        },
        addTeacher: (_, { name, gender, subjectId }) => {
            const newTeacher = { id: `${teachers.length + 1}`, name, gender, subjectId };
            teachers.push(newTeacher);
            return newTeacher;
        },
        updateTeacher: (_, { id, name, gender, subjectId }) => {
            const teacher = teachers.find(t => t.id === id);
            if (!teacher) return null;
            if (name !== undefined) teacher.name = name;
            if (gender !== undefined) teacher.gender = gender;
            if (subjectId !== undefined) teacher.subjectId = subjectId;
            return teacher;
        },
        deleteTeacher: (_, { id }) => {
            const index = teachers.findIndex(t => t.id === id);
            if (index === -1) return false;
            teachers.splice(index, 1);
            return true;
        },
        addClass: (_, { name, subjectIds }) => {
            const newClass = { id: `${classes.length + 1}`, name, subjectIds };
            classes.push(newClass);
            return newClass;
        },
        updateClass: (_, { id, name, subjectIds }) => {
            const clas = classes.find(c => c.id === id);
            if (!clas) return null;
            if (name !== undefined) clas.name = name;
            if (subjectIds !== undefined) clas.subjectIds = subjectIds;
            return clas;
        },
        deleteClass: (_, { id }) => {
            const index = classes.findIndex(c => c.id === id);
            if (index === -1) return false;
            classes.splice(index, 1);
            return true;
        },
        addSubject: (_, { name, teacherId }) => {
            const newSubject = { id: `${subjects.length + 1}`, name, teacherId };
            subjects.push(newSubject);
            return newSubject;
        },
        updateSubject: (_, { id, name, teacherId }) => {
            const subject = subjects.find(s => s.id === id);
            if (!subject) return null;
            if (name !== undefined) subject.name = name;
            if (teacherId !== undefined) subject.teacherId = teacherId;
            return subject;
        },
        deleteSubject: (_, { id }) => {
            const index = subjects.findIndex(s => s.id === id);
            if (index === -1) return false;
            subjects.splice(index, 1);
            return true;
        },
    },
};

const app = express();
const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    validationRules: [depthLimit(4)],
});
await apolloServer.start();
app.use('/graphql', cors(), express.json(), expressMiddleware(apolloServer));
app.listen(8989, () => {
    console.log('Started on http://localhost:8989/graphql');
});
