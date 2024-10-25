import express from 'express';
import {classes} from "./classes.js";
import { authorize } from "../auth.js";
import { contentType } from "../contentType.js";
import { cache } from "../cache.js";
import {security} from "../security.js";

const router = express.Router();

router.use(security);

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

router.get('/', cache, (req, res) => {
    res.status(200).json(students); // 200 - OK
});

router.get('/:id', cache, (req, res) => {
    const student = students.find(s => s.id === req.params.id);

    if (student) {
        res.status(200).json(student); // 200 - OK
    } else {
        res.status(404).send("Student not found"); // 404 - Not Found
    }
});

router.post('/', authorize, contentType,(req, res) => {
    const { name, age, gender, classId, grades, absences } = req.body;

    if (!name || !age || !gender || !classId) {
        return res.status(400).send("Bad Request: Missing required fields"); // 400 - Bad Request
    }

    const newId = (students.length + 1).toString();
    const newClass = classes.find(c => c.id === classId);

    const newStudent = {
        id: newId,
        name,
        age,
        gender,
        class: newClass,
        grades: grades || {},
        absences: absences || {}
    };

    students.push(newStudent);
    res.status(201).json(newStudent); // 201 - Created
});



router.put('/:id', authorize, contentType,(req, res) => {
    const { name, age, gender, classId, grades, absences } = req.body;
    const studentIndex = students.findIndex(s => s.id === req.params.id);

    if (studentIndex === -1) {
        return res.status(404).send("Student not found"); // 404 - Not Found
    }

    if (!name || !age || !gender || !classId) {
        return res.status(400).send("Bad Request: Missing required fields"); // 400 - Bad Request
    }

    const updatedClass = classes.find(c => c.id === classId);
    const updatedStudent = {
        id: req.params.id,
        name,
        age,
        gender,
        class: updatedClass,
        grades: grades || students[studentIndex].grades,
        absences: absences || students[studentIndex].absences
    };

    students[studentIndex] = updatedStudent;
    res.status(200).json(updatedStudent); // 200 - OK
});

router.patch('/:id', authorize, contentType,(req, res) => {
    const studentIndex = students.findIndex(s => s.id === req.params.id);

    if (studentIndex === -1) {
        return res.status(404).send("Student not found"); // 404 - Not Found
    }

    const updatedStudent = {
        ...students[studentIndex],
        ...req.body
    };

    students[studentIndex] = updatedStudent;
    res.status(200).json(updatedStudent); // 200 - OK
});





router.delete('/:id', authorize, contentType,(req, res) => {
    const studentIndex = students.findIndex(s => s.id === req.params.id);

    if (studentIndex === -1) {
        return res.status(404).send("Student not found"); // 404 - Not Found
    }

    students.splice(studentIndex, 1);
    res.status(204).send(); // 204 - No Content
});




export default router;