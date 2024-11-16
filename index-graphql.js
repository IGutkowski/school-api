import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { GraphQLJSON } from 'graphql-type-json';
import depthLimit from 'graphql-depth-limit';
import { gql } from 'graphql-tag';
import cors from 'cors';

const students = [
    { id: '1', name: 'Alice Green', age: 15, gender: 'female', classId: '1', grades: { Mathematics: [4, 5, 3], Physics: [5, 3, 4] }, absences: { Mathematics: 3, Physics: 1 } },
    { id: '2', name: 'Bob White', age: 16, gender: 'male', classId: '2', grades: { Chemistry: [3, 4], Biology: [5, 4] }, absences: { Chemistry: 1, Biology: 3 } },
    { id: '3', name: 'Charlie Black', age: 14, gender: 'male', classId: '1', grades: { Mathematics: [4, 5, 3], Physics: [5, 3, 4] }, absences: { Mathematics: 3, Physics: 1 } },
    { id: '4', name: 'Diana Blue', age: 17, gender: 'female', classId: '3', grades: { History: [3, 4] }, absences: { History: 2 } },
    { id: '5', name: 'Evan Red', age: 15, gender: 'other', classId: '2', grades: { Chemistry: [2, 3], Biology: [3, 4] }, absences: { Chemistry: 1, Biology: 3 } },
    { id: '6', name: 'Fiona Yellow', age: 16, gender: 'female', classId: '3', grades: { History: [5, 4] }, absences: { History: 2 } },
    { id: '7', name: 'George Purple', age: 14, gender: 'male', classId: '1', grades: { Mathematics: [3, 4], Physics: [4, 3] }, absences: { Mathematics: 3, Physics: 1 } },
    { id: '8', name: 'Hannah Brown', age: 17, gender: 'female', classId: '2', grades: { Chemistry: [4, 5], Biology: [5, 3] }, absences: { Chemistry: 1, Biology: 3 } },
    { id: '9', name: 'Ian Gray', age: 15, gender: 'male', classId: '3', grades: { History: [3, 3] }, absences: { History: 2 } },
    { id: '10', name: 'Jack Orange', age: 16, gender: 'male', classId: '1', grades: { Mathematics: [4, 3], Physics: [3, 4] }, absences: { Mathematics: 3, Physics: 1 } },
];

const teachers = [
    { id: '1', name: 'John Smith', gender: 'male', subjectId: '1' },
    { id: '2', name: 'Jane Doe', gender: 'female', subjectId: '2' },
    { id: '3', name: 'Albert Johnson', gender: 'male', subjectId: '3' },
    { id: '4', name: 'Emily Davis', gender: 'female', subjectId: '4' },
    { id: '5', name: 'Michael Brown', gender: 'male', subjectId: '5' },
];

const subjects = [
    { id: '1', name: 'Mathematics', teacherId: '1' },
    { id: '2', name: 'Physics', teacherId: '2' },
    { id: '3', name: 'Chemistry', teacherId: '3' },
    { id: '4', name: 'Biology', teacherId: '4' },
    { id: '5', name: 'History', teacherId: '5' },
];

const classes = [
    { id: '1', name: 'Class 1', subjectIds: ['1', '2'] },
    { id: '2', name: 'Class 2', subjectIds: ['3', '4'] },
    { id: '3', name: 'Class 3', subjectIds: ['5'] },
    { id: '2', name: 'Class 2', subjectIds: ['1'] },
];
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

const typeDefs = gql`
    scalar JSON

    input StringFilter {
        equals: String
        contains: String
        notEquals: String
        notContains: String
    }

    input IntFilter {
        equals: Int
        greaterThan: Int
        lessThan: Int
        greaterThanOrEqual: Int
        lessThanOrEqual: Int
    }

    input StudentFilter {
        name: StringFilter
        age: IntFilter
        gender: String
        classId: ID
    }

    input AddStudentInput {
        name: String!
        age: Int!
        gender: String!
        classId: ID!
        grades: JSON
        absences: JSON
    }

    input UpdateStudentInput {
        id: ID!
        name: String
        age: Int
        gender: String
        classId: ID
        grades: JSON
        absences: JSON
    }

    input TeacherFilter {
        name: StringFilter
        gender: String
    }

    input ClassFilter {
        name: StringFilter
    }

    input SubjectFilter {
        name: StringFilter
    }

    type Student {
        id: ID!
        name: String!
        age: Int!
        gender: String!
        class: Class
        grades: JSON
        absences: JSON
    }

    type Teacher {
        id: ID!
        name: String!
        gender: String!
        subject: Subject
    }

    type Class {
        id: ID!
        name: String!
        subjects: [Subject]
    }

    type Subject {
        id: ID!
        name: String!
        teacher: Teacher
    }

    type Query {
        students(filter: StudentFilter, sortBy: String, limit: Int, offset: Int): [Student]
        student(id: ID!): Student
        teachers(filter: TeacherFilter, sortBy: String, limit: Int, offset: Int): [Teacher]
        teacher(id: ID!): Teacher
        classes(filter: ClassFilter, sortBy: String, limit: Int, offset: Int): [Class]
        class(id: ID!): Class
        subjects(filter: SubjectFilter, sortBy: String, limit: Int, offset: Int): [Subject]
        subject(id: ID!): Subject
    }

    type Mutation {
        addStudent(input: AddStudentInput!): Student
        updateStudent(input: UpdateStudentInput!): Student
        deleteStudent(id: ID!): Boolean
        addTeacher(name: String!, gender: String!, subjectId: ID!): Teacher
        updateTeacher(id: ID!, name: String, gender: String, subjectId: ID): Teacher
        deleteTeacher(id: ID!): Boolean
        addClass(name: String!, subjectIds: [ID!]!): Class
        updateClass(id: ID!, name: String, subjectIds: [ID!]): Class
        deleteClass(id: ID!): Boolean
        addSubject(name: String!, teacherId: ID!): Subject
        updateSubject(id: ID!, name: String, teacherId: ID): Subject
        deleteSubject(id: ID!): Boolean
    }
`;

const resolvers = {
    JSON: GraphQLJSON,
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
