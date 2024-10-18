import express from 'express';
import students from './students.js';
import {subjects} from "./subjects.js";


const router = express.Router();

export const classes = [
    { id: '1', name: 'Class 1', subjects: [subjects[0], subjects[1]] },
    { id: '2', name: 'Class 2', subjects: [subjects[2], subjects[3]] },
    { id: '3', name: 'Class 3', subjects: [subjects[4]] },
];

router.get('/', (req, res) => {
    res.json(classes);
});

router.get('/:id', (req, res) => {
    const clas = classes.find(c => c.id === req.params.id);
    if (clas) {
        res.json(clas);
    } else {
        res.status(404).send("Class not found");
    }
});

router.get('/:id/gender/:gender', (req, res) => {
    const clas = classes.find(c => c.id === req.params.id);
    if (clas) {
        const filteredStudents = students.filter(s => s.class.id === req.params.id && s.gender === req.params.gender);
        res.json(filteredStudents);
    } else {
        res.status(404).send("Class not found");
    }
});

//subjects in a class
router.get('/:id/subjects', (req, res) => {
    const clas = classes.find(c => c.id === req.params.id);
    if (clas) {
        res.json(clas.subjects);
    } else {
        res.status(404).send("Class not found");
    }
});

//students in a class
//to test: http://localhost:8989/classes/1/students
router.get('/:id/students', (req, res) => {
    const clas = classes.find(c => c.id === req.params.id);
    if (clas) {
        const studentsInClass = students.filter(s => s.class.id === req.params.id);
        res.json(studentsInClass);
    } else {
        res.status(404).send("Class not found");
    }
});

export default router;