import express from 'express';
import { authorize } from "../auth.js";


const router = express.Router();

export const subjects = [
    { id: '1', name: 'Mathematics', teacher: { id: '1', name: 'John Smith' } },
    { id: '2', name: 'Physics', teacher: { id: '2', name: 'Jane Doe' } },
    { id: '3', name: 'Chemistry', teacher: { id: '3', name: 'Albert Johnson' } },
    { id: '4', name: 'Biology', teacher: { id: '4', name: 'Emily Davis' } },
    { id: '5', name: 'History', teacher: { id: '5', name: 'Michael Brown' } },
];

router.get('/', (req, res) => {
    res.status(200).json(subjects); // 200 - OK
});

router.get('/:id', (req, res) => {
    const subject = subjects.find(s => s.id === req.params.id);

    if (subject) {
        res.status(200).json(subject); // 200 - OK
    } else {
        res.status(404).send("Subject not found"); // 404 - Not Found
    }
});

router.post('/', authorize, (req, res) => {
    const { name, teacher } = req.body;

    if (!name || !teacher || !teacher.id || !teacher.name) {
        return res.status(400).send("Bad Request: Missing required fields"); // 400 - Bad Request
    }

    const newId = (subjects.length + 1).toString();
    const newSubject = { id: newId, name, teacher };
    subjects.push(newSubject);

    res.status(201).json(newSubject);  // 201 - Created
});

router.put('/:id', authorize, (req, res) => {
    const { name, teacher } = req.body;
    const subjectIndex = subjects.findIndex(s => s.id === req.params.id);

    if (subjectIndex === -1) {
        return res.status(404).send("Subject not found"); // 404 - Not Found
    }

    if (!name || !teacher || !teacher.id || !teacher.name) {
        return res.status(400).send("Bad Request: Missing required fields"); // 400 - Bad Request
    }

    const updatedSubject = { id: req.params.id, name, teacher };
    subjects[subjectIndex] = updatedSubject;

    res.status(200).json(updatedSubject); // 200 - OK
});

router.patch('/:id', authorize, (req, res) => {
    const subjectIndex = subjects.findIndex(s => s.id === req.params.id);

    if (subjectIndex === -1) {
        return res.status(404).send("Subject not found"); // 404 - Not Found
    }

    const updatedSubject = {
        ...subjects[subjectIndex],
        ...req.body
    };

    subjects[subjectIndex] = updatedSubject;

    res.status(200).json(updatedSubject); // 200 - OK
});

router.delete('/:id', authorize, (req, res) => {
    const subjectIndex = subjects.findIndex(s => s.id === req.params.id);

    if (subjectIndex === -1) {
        return res.status(404).send("Subject not found"); // 404 - Not Found
    }

    subjects.splice(subjectIndex, 1);

    res.status(204).send(); // 204 - No Content
});

export default router;
