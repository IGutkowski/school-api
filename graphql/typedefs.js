import {gql} from "graphql-tag";
import { GraphQLScalarType, Kind } from 'graphql';

export const JSONScalar = new GraphQLScalarType({
    name: 'JSON',
    serialize(value) {
        return value;
    },
    parseValue(value) {
        return value;
    },
    parseLiteral(ast) {
        switch (ast.kind) {
            case Kind.STRING:
                try {
                    return JSON.parse(ast.value);
                } catch (e) {
                    return null;
                }
            case Kind.INT:
            case Kind.FLOAT:
            case Kind.BOOLEAN:
            case Kind.NULL:
                return ast.value;
            case Kind.OBJECT:
                const value = Object.create(null);
                ast.fields.forEach(field => {
                    value[field.name.value] = this.parseLiteral(field.value);
                });
                return value;
            case Kind.LIST:
                return ast.values.map(valueNode => this.parseLiteral(valueNode));
            default:
                return null;
        }
    },
});

export const typeDefs = gql`
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