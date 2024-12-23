import express from 'express';
import { authorize } from "../auth.js";
import { contentType } from "../contentType.js";
import { cache } from "../cache.js";
import {security} from "../security.js";


const router = express.Router();

router.use(security);

export const subjects = [
    { id: '1', name: 'Mathematics', teacher: { id: '1', name: 'John Smith' } },
    { id: '2', name: 'Physics', teacher: { id: '2', name: 'Jane Doe' } },
    { id: '3', name: 'Chemistry', teacher: { id: '3', name: 'Albert Johnson' } },
    { id: '4', name: 'Biology', teacher: { id: '4', name: 'Emily Davis' } },
    { id: '5', name: 'History', teacher: { id: '5', name: 'Michael Brown' } },
];

router.get('/', cache, (req, res) => {
    const subjectsWithLinks = subjects.map(subject => ({
        ...subject,
        _links: {
            main: { href: `${req.protocol}://${req.get('host')}/`, method: 'GET' },
            self: { href: `${req.protocol}://${req.get('host')}/subjects/${subject.id}`, method: 'GET' },
            updatePartial: { href: `${req.protocol}://${req.get('host')}/subjects/${subject.id}`, method: 'PATCH' },
            updateFull: { href: `${req.protocol}://${req.get('host')}/subjects/${subject.id}`, method: 'PUT' },
            delete: { href: `${req.protocol}://${req.get('host')}/subjects/${subject.id}`, method: 'DELETE' },
            allSubjects: { href: `${req.protocol}://${req.get('host')}/subjects`, method: 'GET' }
        }
    }));
    res.status(200).json(subjectsWithLinks);
});

router.get('/:id', cache, (req, res) => {
    const subject = subjects.find(s => s.id === req.params.id);

    if (subject) {
        const subjectWithLinks = {
            ...subject,
            _links: {
                main: { href: `${req.protocol}://${req.get('host')}/`, method: 'GET' },
                self: { href: `${req.protocol}://${req.get('host')}/subjects/${subject.id}`, method: 'GET' },
                updatePartial: { href: `${req.protocol}://${req.get('host')}/subjects/${subject.id}`, method: 'PATCH' },
                updateFull: { href: `${req.protocol}://${req.get('host')}/subjects/${subject.id}`, method: 'PUT' },
                delete: { href: `${req.protocol}://${req.get('host')}/subjects/${subject.id}`, method: 'DELETE' },
                allSubjects: { href: `${req.protocol}://${req.get('host')}/subjects`, method: 'GET' }
            }
        };
        res.status(200).json(subjectWithLinks);
    } else {
        res.status(404).send("Subject not found");
    }
});

router.post('/', authorize, contentType,(req, res) => {
    const { name, teacher } = req.body;

    if (!name || !teacher || !teacher.id || !teacher.name) {
        return res.status(400).send("Bad Request: Missing required fields"); // 400 - Bad Request
    }

    const newId = (subjects.length + 1).toString();
    const newSubject = { id: newId, name, teacher };
    subjects.push(newSubject);

    res.status(201).json(newSubject);  // 201 - Created
});

router.put('/:id', authorize, contentType,(req, res) => {
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

router.patch('/:id', authorize, contentType,(req, res) => {
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

router.delete('/:id', authorize, contentType,(req, res) => {
    const subjectIndex = subjects.findIndex(s => s.id === req.params.id);

    if (subjectIndex === -1) {
        return res.status(404).send("Subject not found"); // 404 - Not Found
    }

    subjects.splice(subjectIndex, 1);

    res.status(204).send(); // 204 - No Content
});

export default router;
