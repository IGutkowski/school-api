import express from 'express';
import students from './students.js';
import {subjects} from "./subjects.js";
import {authorize} from "../auth.js";


const router = express.Router();

export const classes = [
    { id: '1', name: 'Class 1', subjects: [subjects[0], subjects[1]] },
    { id: '2', name: 'Class 2', subjects: [subjects[2], subjects[3]] },
    { id: '3', name: 'Class 3', subjects: [subjects[4]] },
];

router.get('/', (req, res) => {
    res.status(200).json(classes); // 200 - OK
});

router.get('/:id', (req, res) => {
    const clas = classes.find(c => c.id === req.params.id);

    if (clas) {
        res.status(200).json(clas); // 200 - OK
    } else {
        res.status(404).send("Class not found"); // 404 - Not Found
    }
});


router.get('/:id/gender/:gender', (req, res) => {
    const clas = classes.find(c => c.id === req.params.id);

    if (!clas) {
        return res.status(404).send("Class not found"); // 404 - Not Found
    }

    const filteredStudents = students.filter(s => s.class.id === req.params.id && s.gender === req.params.gender);

    if (filteredStudents.length === 0) {
        return res.status(204).send(); // 204 - No Content
    }

    res.status(200).json(filteredStudents); // 200 - OK

});

//subjects in a class
    router.get('/:id/subjects', (req, res) => {
        const clas = classes.find(c => c.id === req.params.id);

        if (!clas) {
            return res.status(404).send("Class not found"); // 404 - Not Found
        }

        res.status(200).json(clas.subjects); // 200 - OK
    });


//students in a class
//to test: http://localhost:8989/classes/1/students
    router.get('/:id/students', (req, res) => {
        const clas = classes.find(c => c.id === req.params.id);

        if (!clas) {
            return res.status(404).send("Class not found"); // 404 - Not Found
        }

        const studentsInClass = students.filter(s => s.class.id === req.params.id);

        if (studentsInClass.length === 0) {
            return res.status(200).json([]); // 200 - OK
        }


        res.status(200).json(studentsInClass); // 200 - OK
    });


router.delete('/:id', authorize, (req, res) => {
    const classIndex = classes.findIndex(c => c.id === req.params.id);

    if (classIndex === -1) {
        return res.status(404).send("Class not found"); // 404 - Not Found
    }

    classes.splice(classIndex, 1);

    res.status(204).send(); // 204 - No Content
});


router.post('/',authorize, (req, res) => {
    const { name, subjects } = req.body;

    if (!name || !subjects) {
        return res.status(400).send("Bad Request: Missing required fields"); // 400 - Bad Request
    }

    const newId = (classes.length + 1).toString();

    const newClass = { id: newId, name, subjects };
    classes.push(newClass);

    res.status(201).json(newClass);  // 201 - Created
});

router.put('/:id', authorize, (req, res) => {
    const { name, subjects } = req.body;
    const classIndex = classes.findIndex(c => c.id === req.params.id);

    if (classIndex === -1) {
        return res.status(404).send("Class not found"); // 404 - Not Found
    }

    if (!name || !subjects) {
        return res.status(400).send("Bad Request: Missing required fields"); // 400 - Bad Request
    }

    const updatedClass = { id: req.params.id, name, subjects };
    classes[classIndex] = updatedClass;

    res.status(200).json(updatedClass); // 200 - OK
});

router.patch('/:id', authorize, (req, res) => {
    const classIndex = classes.findIndex(c => c.id === req.params.id);

    if (classIndex === -1) {
        return res.status(404).send("Class not found"); // 404 - Not Found
    }

    const updatedClass = {
        ...classes[classIndex],
        ...req.body
    };

    classes[classIndex] = updatedClass;

    res.status(200).json(updatedClass); // 200 - OK
});





export default router;