import express from 'express';
import students from './students.js';
import {subjects} from "./subjects.js";
import {authorize} from "../auth.js";
import {contentType} from "../contentType.js"
import {cache} from "../cache.js";
import {security} from "../security.js";


const router = express.Router();

router.use(security);

export const classes = [
    { id: '1', name: 'Class 1', subjects: [subjects[0], subjects[1]] },
    { id: '2', name: 'Class 2', subjects: [subjects[2], subjects[3]] },
    { id: '3', name: 'Class 3', subjects: [subjects[4]] },
];

router.get('/', cache, (req, res) => {
    res.status(200).json(classes); // 200 - OK
});

router.get('/:id', cache, (req, res) => {
    const clas = classes.find(c => c.id === req.params.id);

    if (clas) {
        res.status(200).json(clas); // 200 - OK
    } else {
        res.status(404).send("Class not found"); // 404 - Not Found
    }
});


router.delete('/:id', authorize, contentType, (req, res) => {
    const classIndex = classes.findIndex(c => c.id === req.params.id);

    if (classIndex === -1) {
        return res.status(404).send("Class not found"); // 404 - Not Found
    }

    classes.splice(classIndex, 1);

    res.status(204).send(); // 204 - No Content
});


router.post('/',authorize, contentType, (req, res) => {
    const { name, subjects } = req.body;

    if (!name || !subjects) {
        return res.status(400).send("Bad Request: Missing required fields"); // 400 - Bad Request
    }

    const newId = (classes.length + 1).toString();

    const newClass = { id: newId, name, subjects };
    classes.push(newClass);

    res.status(201).json(newClass);  // 201 - Created
});

router.put('/:id', authorize, contentType, (req, res) => {
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

router.patch('/:id', authorize, contentType, (req, res) => {
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