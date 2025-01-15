import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import path from 'path';
import url from 'url';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packageDefinition = protoLoader.loadSync([
    path.join(__dirname, 'proto/common.proto'),
    path.join(__dirname, 'proto/teachers.proto'),
    path.join(__dirname, 'proto/subjects.proto'),
    path.join(__dirname, 'proto/classes.proto'),
    path.join(__dirname, 'proto/students.proto'),
]);
const grpcObject = grpc.loadPackageDefinition(packageDefinition);

const studentsClient = new grpcObject.school.students.StudentsService(
    'localhost:50051',
    grpc.credentials.createInsecure()
);
const teachersClient = new grpcObject.school.teachers.TeachersService(
    'localhost:50051',
    grpc.credentials.createInsecure()
);
const subjectsClient = new grpcObject.school.subjects.SubjectsService(
    'localhost:50051',
    grpc.credentials.createInsecure()
);
const classesClient = new grpcObject.school.classes.ClassesService(
    'localhost:50051',
    grpc.credentials.createInsecure()
);


// //  STUDENTS
studentsClient.ListStudents(
    {
        filters: [{ field: 'gender', value: 'male' }],
        sorts: [{ field: 'name', ascending: false }],
        pagination: { page: 1, pageSize: 2 },
    },
    (err, response) => {
        if (err) return console.error('ListStudents error:', err.message);
        console.log('\nListStudents(male, sorted by name descending, first page, size 2) =>');
        console.dir(response.students, { depth: null });
    }
);

//
studentsClient.GetStudent({ id: '1' }, (err, response) => {
    if (err) return console.error('GetStudent error:', err.message);
    console.log('\nGetStudent(1) =>');
    console.dir(response.student, { depth: null });
});
//
studentsClient.CreateStudent(
    {
        name: 'Newcomer',
        age: 14,
        gender: 'female',
        classId: '1',
    },
    (err, response) => {
        if (err) return console.error('CreateStudent error:', err.message);
        console.log('\nCreated Student =>');
        console.dir(response.student, { depth: null });
    }
);

studentsClient.UpdateStudent(
    {
        id: '4',
        name: 'Updated Student',
        age: 999,
    },
    (err, response) => {
        if (err) return console.error('UpdateStudent error:', err.message);
        console.log('\nUpdated Student(4) =>');
        console.dir(response.student, { depth: null });
    }

);

studentsClient.ListStudents({
    sorts: [{ field: 'id', ascending: false }],
    pagination: { page: 1, pageSize: 3 },
}, (err, response) => {
    if (err) return console.error('ListStudents error:', err.message);
    console.log('\nListStudents(by Id descending, page 1, size 3) =>');
    console.dir(response.students, { depth: null });
})

//
// //  CLASSES
// classesClient.ListClasses({}, (err, response) => {
//     if (err) return console.error('ListClasses error:', err.message);
//     console.log('\nListClasses =>');
//     console.dir(response.classes, { depth: null });
// });
//
// classesClient.GetClass({ id: '1' }, (err, response) => {
//     if (err) return console.error('GetClass error:', err.message);
//     console.log('\nGetClass(1) =>');
//     console.dir(response.classObj, { depth: null });
// });
//
// classesClient.CreateClass(
//     { name: 'Class 4', subjectIds: ['1', '5'] },
//     (err, response) => {
//         if (err) return console.error('CreateClass error:', err.message);
//         console.log('\nCreated Class =>');
//         console.dir(response.classObj, { depth: null });
//     }
// );
//
//
// //  TEACHERS
// teachersClient.ListTeachers({}, (err, response) => {
//     if (err) return console.error('ListTeachers error:', err.message);
//     console.log('\nListTeachers =>');
//     console.dir(response.teachers, { depth: null });
// });
//
// teachersClient.GetTeacher({ id: '2' }, (err, response) => {
//     if (err) return console.error('GetTeacher error:', err.message);
//     console.log('\nGetTeacher(2) =>');
//     console.dir(response.teacher, { depth: null });
// });
//
// teachersClient.CreateTeacher(
//     { name: 'Sophia Gray', gender: 'female', subject: 'Philosophy' },
//     (err, response) => {
//         if (err) return console.error('CreateTeacher error:', err.message);
//         console.log('\nCreated Teacher =>');
//         console.dir(response.teacher, { depth: null });
//     }
// );
//
//
//  SUBJECTS
// subjectsClient.ListSubjects({}, (err, response) => {
//     if (err) return console.error('ListSubjects error:', err.message);
//     console.log('\nListSubjects =>');
//     console.dir(response.subjects, { depth: null });
// });
//
// subjectsClient.GetSubject({ id: '4' }, (err, response) => {
//     if (err) return console.error('GetSubject error:', err.message);
//     console.log('\nGetSubject(4) =>');
//     console.dir(response.subject, { depth: null });
// });
//
// subjectsClient.CreateSubject(
//     {
//         name: 'Literature',
//         teacherId: '5',
//         teacherName: 'Michael Brown',
//     },
//     (err, response) => {
//         if (err) return console.error('CreateSubject error:', err.message);
//         console.log('\nCreated Subject =>');
//         console.dir(response.subject, { depth: null });
//     }
// );

// subjectsClient.DeleteSubject({ id: '6' }, (err, response) => {
//     if (err) return console.error('DeleteSubject error:', err.message);
//     console.log('\nDeleted Subject =>');
//     console.dir(response.subject, { depth: null });
// });

// filtrowanie
// subjectsClient.ListSubjects(
//     {
//         filters: [{ field: 'name', value: 'bio' }],
//     },
//     (err, response) => {
//         if (err) return console.error('ListSubjects error:', err.message);
//         console.log('\nListSubjects filtered by name="bio" =>');
//         console.dir(response.subjects, { depth: null });
//     }
// )
//
// // sortowanie
// subjectsClient.ListSubjects(
//     {
//         sorts: [{ field: 'name', ascending: true }],
//     },
//     (err, response) => {
//         if (err) return console.error('ListSubjects error:', err.message);
//         console.log('\nListSubjects sorted by name (descending) =>');
//         console.dir(response.subjects, { depth: null });
//     }
// );

//paginacja z filtrowaniem i sortowaniem
// studentsClient.ListStudents(
//     {
//         filters: [{ field: 'gender', value: 'female' }], // filtr "płeć = female"
//         sorts: [{ field: 'name', ascending: false }],    // sortuj wg "name" malejąco
//         pagination: { page: 1, pageSize: 2 },            // weź pierwsze 2 wyniki
//     },
//     (err, response) => {
//         if (err) return console.error('ListStudents error:', err.message);
//         console.log('\n[1] Studenci => filtr: gender=female, sort name DESC, pagination(1,2)');
//         console.dir(response.students, { depth: null });
//     }
// );

// subjectsClient.ListSubjects({
//     filters: [{ field: 'name', value: 'Biology' }],
//     sorts: [{ field: 'name', ascending: true }],
//     pagination: { page: 1, pageSize: 2 },
// }, (err, response) => {
//     if (err) return console.error('ListSubjects error:', err.message);
//     console.log('\nListSubjects =>');
//     console.dir(response.subjects, { depth: null });
// });




