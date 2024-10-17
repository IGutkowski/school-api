import express from 'express';

const app = express();

const teachers = [
    { id: '1', name: 'John Smith', gender: 'male', subject: 'Mathematics' },
    { id: '2', name: 'Jane Doe', gender: 'female', subject: 'Physics' },
    { id: '3', name: 'Albert Johnson', gender: 'male', subject: 'Chemistry' },
    { id: '4', name: 'Emily Davis', gender: 'female', subject: 'Biology' },
    { id: '5', name: 'Michael Brown', gender: 'male', subject: 'History' },
];

const subjects = [
    { id: '1', name: 'Mathematics', teacher: { id: '1', name: 'John Smith' } },
    { id: '2', name: 'Physics', teacher: { id: '2', name: 'Jane Doe' } },
    { id: '3', name: 'Chemistry', teacher: { id: '3', name: 'Albert Johnson' } },
    { id: '4', name: 'Biology', teacher: { id: '4', name: 'Emily Davis' } },
    { id: '5', name: 'History', teacher: { id: '5', name: 'Michael Brown' } },
];

const classes = [
    { id: '1', name: 'Class 1', subjects: [subjects[0], subjects[1]] },
    { id: '2', name: 'Class 2', subjects: [subjects[2], subjects[3]] },
    { id: '3', name: 'Class 3', subjects: [subjects[4]] },
];

const students = [
    { id: '1', name: 'Alice Green', age: 15, gender: 'female', class: classes[0], grades: { Mathematics: [4, 5, 3], Physics: [5, 3, 4] }, absences: { Mathematics: 3, Physics: 1 } },
    { id: '2', name: 'Bob White', age: 16, gender: 'male', class: classes[1], grades: { Chemistry: [3, 4], Biology: [5, 4] }, absences: { Chemistry: 1, Biology: 3 } },
    { id: '3', name: 'Charlie Black', age: 14, gender: 'male', class: classes[0], grades: { Mathematics: [4, 5, 3], Physics: [5, 3, 4] }, absences: { Mathematics: 3, Physics: 1 } },
    { id: '4', name: 'Diana Blue', age: 17, gender: 'female', class: classes[2], grades: { History: [3, 4] }, absences: { History: 2 } },
    { id: '5', name: 'Evan Red', age: 15, gender: 'other', class: classes[1], grades: { Chemistry: [2, 3], Biology: [3, 4] }, absences: { Chemistry: 1, Biology: 3 } },
    { id: '6', name: 'Fiona Yellow', age: 16, gender: 'female', class: classes[2], grades: { History: [5, 4] }, absences: { History: 2 } },
    { id: '7', name: 'George Purple', age: 14, gender: 'male', class: classes[0], grades: { Mathematics: [3, 4], Physics: [4, 3] }, absences: { Mathematics: 3, Physics: 1 } },
    { id: '8', name: 'Hannah Brown', age: 17, gender: 'female', class: classes[1], grades: { Chemistry: [4, 5], Biology: [5, 3] }, absences: { Chemistry: 1, Biology: 3 } },
    { id: '9', name: 'Ian Gray', age: 15, gender: 'male', class: classes[2], grades: { History: [3, 3] }, absences: { History: 2 } },
    { id: '10', name: 'Jack Orange', age: 16, gender: 'male', class: classes[0], grades: { Mathematics: [4, 3], Physics: [3, 4] }, absences: { Mathematics: 3, Physics: 1 } },
];

app.get('/', (req, res) => {
    res.send("School API!");
});

app.get('/students', (req, res) => {
    res.json(students);
});

app.get('/students/:id', (req, res) => {
    const student = students.find(s => s.id === req.params.id);
    if (student) {
        res.json(student);
    } else {
        res.status(404).send("Student not found");
    }
});

app.get('/teachers', (req, res) => {
    res.json(teachers);
});

app.get('/teachers/:id', (req, res) => {
    const teacher = teachers.find(t => t.id === req.params.id);
    if (teacher) {
        res.json(teacher);
    } else {
        res.status(404).send("Teacher not found");
    }
});

app.get('/subjects', (req, res) => {
    res.json(subjects);
});

app.get('/subjects/:id', (req, res) => {
    const subject = subjects.find(s => s.id === req.params.id);
    if (subject) {
        res.json(subject);
    } else {
        res.status(404).send("Subject not found");
    }

});


app.get('/classes', (req, res) => {
    res.json(classes);
});

app.get('/classes/:id', (req, res) => {
    const clas = classes.find(c => c.id === req.params.id);
    if (clas) {
        res.json(clas);
    } else {
        res.status(404).send("Class not found");
    }
});

//students in a class
app.get('/classes/:id/students', (req, res) => {
    const clas = classes.find(c => c.id === req.params.id);
    if (clas) {
        const studentsInClass = students.filter(s => s.class.id === req.params.id);
        res.json(studentsInClass);
    } else {
        res.status(404).send("Class not found");
    }
});

//subjects in a class
app.get('/classes/:id/subjects', (req, res) => {
    const clas = classes.find(c => c.id === req.params.id);
    if (clas) {
        res.json(clas.subjects);
    } else {
        res.status(404).send("Class not found");
    }
});

//average grades for a student in a subject
//to test: http://localhost:8989/students/1/grades/Mathematics
app.get('/students/:id/subjects/:subject', (req, res) => {
    const student = students.find(s => s.id === req.params.id);
    if (student) {
        const grades = student.grades[req.params.subject];
        const average = grades.reduce((a, b) => a + b, 0) / grades.length;
        res.json({ average });
    } else {
        res.status(404).send("Student not found");
    }
});

//absences for a student in a subject
//to test: http://localhost:8989/students/1/absences/Mathematics
app.get('/students/:id/absences/:subject', (req, res) => {
    const student = students.find(s => s.id === req.params.id);
    if (student) {
        const absences = student.absences[req.params.subject];
        res.json({ absences });
    } else {
        res.status(404).send("Student not found");
    }
});

//students in a class with a specific gender
// to test: http://localhost:8989/classes/1/gender/male
app.get('/classes/:id/gender/:gender', (req, res) => {
    const clas = classes.find(c => c.id === req.params.id);
    if (clas) {
        const filteredStudents = students.filter(s => s.class.id === req.params.id && s.gender === req.params.gender);
        res.json(filteredStudents);
    } else {
        res.status(404).send("Class not found");
    }
});


app.listen(8989, () => {
    console.log("Started on  8989");
});
