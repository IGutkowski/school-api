import express from 'express';
import { authorize } from '../auth.js';
import {contentType} from "../contentType.js";
import { cache } from "../cache.js";
import {security} from "../security.js";

const router = express.Router();

router.use(security);

export const teachers = [
    { id: '1', name: 'John Smith', gender: 'male', subject: 'Mathematics' },
    { id: '2', name: 'Jane Doe', gender: 'female', subject: 'Physics' },
    { id: '3', name: 'Albert Johnson', gender: 'male', subject: 'Chemistry' },
    { id: '4', name: 'Emily Davis', gender: 'female', subject: 'Biology' },
    { id: '5', name: 'Michael Brown', gender: 'male', subject: 'History' },
];

router.get('/', cache, (req, res) => {
    res.status(200).json(teachers); // 200 - OK
});

router.get('/:id', cache, (req, res) => {
    const teacher = teachers.find(t => t.id === req.params.id);

    if (teacher) {
        res.status(200).json(teacher); // 200 - OK
    } else {
        res.status(404).send("Teacher not found"); // 404 - Not Found
    }
});

router.post('/', authorize, contentType, (req, res) => {
    const { name, gender, subject } = req.body;

    if (!name || !gender || !subject) {
        return res.status(400).send("Bad Request: Missing required fields"); // 400 - Bad Request
    }

    const newId = (teachers.length + 1).toString();
    const newTeacher = { id: newId, name, gender, subject };
    teachers.push(newTeacher);

    res.status(201).json(newTeacher);  // 201 - Created
});

router.put('/:id', authorize, contentType, (req, res) => {
    const { name, gender, subject } = req.body;
    const teacherIndex = teachers.findIndex(t => t.id === req.params.id);

    if (teacherIndex === -1) {
        return res.status(404).send("Teacher not found"); // 404 - Not Found
    }

    if (!name || !gender || !subject) {
        return res.status(400).send("Bad Request: Missing required fields"); // 400 - Bad Request
    }

    const updatedTeacher = { id: req.params.id, name, gender, subject };
    teachers[teacherIndex] = updatedTeacher;

    res.status(200).json(updatedTeacher); // 200 - OK
});

router.patch('/:id', authorize, contentType,(req, res) => {
    const teacherIndex = teachers.findIndex(t => t.id === req.params.id);

    if (teacherIndex === -1) {
        return res.status(404).send("Teacher not found"); // 404 - Not Found
    }

    const updatedTeacher = {
        ...teachers[teacherIndex],
        ...req.body
    };

    teachers[teacherIndex] = updatedTeacher;

    res.status(200).json(updatedTeacher); // 200 - OK
});

router.delete('/:id', authorize, contentType,(req, res) => {
    const teacherIndex = teachers.findIndex(t => t.id === req.params.id);

    if (teacherIndex === -1) {
        return res.status(404).send("Teacher not found"); // 404 - Not Found
    }

    teachers.splice(teacherIndex, 1);

    res.status(204).send(); // 204 - No Content
});
export default router;
