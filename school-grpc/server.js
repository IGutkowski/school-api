import path from 'path';
import url from 'url';
import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';

import * as studentsResolvers from './resolvers/studentsResolvers.js';
import * as teachersResolvers from './resolvers/teachersResolvers.js';
import * as subjectsResolvers from './resolvers/subjectsResolvers.js';
import * as classesResolvers from './resolvers/classesResolvers.js';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packageDefinition = protoLoader.loadSync(
    [
        path.join(__dirname, 'proto/common.proto'),
        path.join(__dirname, 'proto/teachers.proto'),
        path.join(__dirname, 'proto/subjects.proto'),
        path.join(__dirname, 'proto/classes.proto'),
        path.join(__dirname, 'proto/students.proto'),
    ],
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
    }
);

const grpcObject = grpc.loadPackageDefinition(packageDefinition);


const teachersPackage = grpcObject.school.teachers;
const subjectsPackage = grpcObject.school.subjects;
const classesPackage = grpcObject.school.classes;
const studentsPackage = grpcObject.school.students;

function main() {
    const server = new grpc.Server();

    server.addService(teachersPackage.TeachersService.service, {
        ListTeachers: teachersResolvers.ListTeachers,
        GetTeacher: teachersResolvers.GetTeacher,
        CreateTeacher: teachersResolvers.CreateTeacher,
        UpdateTeacher: teachersResolvers.UpdateTeacher,
        DeleteTeacher: teachersResolvers.DeleteTeacher,
    });

    server.addService(subjectsPackage.SubjectsService.service, {
        ListSubjects: subjectsResolvers.ListSubjects,
        GetSubject: subjectsResolvers.GetSubject,
        CreateSubject: subjectsResolvers.CreateSubject,
        UpdateSubject: subjectsResolvers.UpdateSubject,
        DeleteSubject: subjectsResolvers.DeleteSubject,
    });

    server.addService(classesPackage.ClassesService.service, {
        ListClasses: classesResolvers.ListClasses,
        GetClass: classesResolvers.GetClass,
        CreateClass: classesResolvers.CreateClass,
        UpdateClass: classesResolvers.UpdateClass,
        DeleteClass: classesResolvers.DeleteClass,
    });

    server.addService(studentsPackage.StudentsService.service, {
        ListStudents: studentsResolvers.ListStudents,
        GetStudent: studentsResolvers.GetStudent,
        CreateStudent: studentsResolvers.CreateStudent,
        UpdateStudent: studentsResolvers.UpdateStudent,
        DeleteStudent: studentsResolvers.DeleteStudent,
    });

    const address = '0.0.0.0:50051';
    server.bindAsync(address, grpc.ServerCredentials.createInsecure(), (err, port) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(`gRPC server running on port ${port}`);
    });
}

main();
