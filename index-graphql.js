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
];

const typeDefs = gql`
    scalar JSON

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
        students: [Student]
        student(id: ID!): Student
        teachers: [Teacher]
        teacher(id: ID!): Teacher
        classes: [Class]
        class(id: ID!): Class
        subjects: [Subject]
        subject(id: ID!): Subject
    }
    
        type Mutation {
        addStudent(name: String!, age: Int!, gender: String!, classId: ID!, grades: JSON, absences: JSON): Student
        updateStudent(id: ID!, name: String, age: Int, gender: String, classId: ID, grades: JSON, absences: JSON): Student
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
        students: () => students,
        student: (_, { id }) => students.find(student => student.id === id),
        teachers: () => teachers,
        teacher: (_, { id }) => teachers.find(teacher => teacher.id === id),
        classes: () => classes,
        class: (_, { id }) => classes.find(clas => clas.id === id),
        subjects: () => subjects,
        subject: (_, { id }) => subjects.find(subject => subject.id === id)
    },
    Student: {
        class: (student) => classes.find(clas => clas.id === student.classId),
        grades: (student) => student.grades,
        absences: (student) => student.absences
    },
    Teacher: {
        subject: (teacher) => subjects.find(subject => subject.id === teacher.subjectId)
    },
    Class: {
        subjects: (clas) => clas.subjectIds.map(subjectId => subjects.find(subject => subject.id === subjectId))
    },
    Subject: {
        teacher: (subject) => teachers.find(teacher => teacher.id === subject.teacherId)
    },
    Mutation: {
        addStudent: (_, { name, age, gender, classId, grades = {}, absences = {} }) => {
            const newStudent = { id: `${students.length + 1}`, name, age, gender, classId, grades, absences };
            students.push(newStudent);
            return newStudent;
        },
        updateStudent: (_, { id, name, age, gender, classId, grades, absences }) => {
            const student = students.find(s => s.id === id);
            if (!student) return null;
            if (name !== undefined) student.name = name;
            if (age !== undefined) student.age = age;
            if (gender !== undefined) student.gender = gender;
            if (classId !== undefined) student.classId = classId;
            if (grades !== undefined) student.grades = grades;
            if (absences !== undefined) student.absences = absences;
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
        }
    },
};


const app = express();

const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    validationRules: [depthLimit(4)]
});
await apolloServer.start();
app.use('/graphql', cors(), express.json(), expressMiddleware(apolloServer));

app.listen(8989, () => {
    console.log("Started on http://localhost:8989/graphql");
});

