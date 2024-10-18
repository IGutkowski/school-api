import express from 'express';
import {classes} from "./classes.js";

const router = express.Router();

export const students = [
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

router.get('/', (req, res) => {
    res.json(students);
});

router.get('/:id', (req, res) => {
    const student = students.find(s => s.id === req.params.id);
    if (student) {
        res.json(student);
    } else {
        res.status(404).send("Student not found");
    }
});

//average grades for a student in a subject
router.get('/:id/subjects/:subject', (req, res) => {
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
router.get('/:id/absences/:subject', (req, res) => {
    const student = students.find(s => s.id === req.params.id);
    if (student) {
        const absences = student.absences[req.params.subject];
        res.json({ absences });
    } else {
        res.status(404).send("Student not found");
    }
});

export default router;