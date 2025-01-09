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


/**
 * @swagger
 * components:
 *   schemas:
 *     Subject:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier of the subject.
 *         name:
 *           type: string
 *           description: Name of the subject.
 *         teacher:
 *           type: object
 *           $ref: '#/components/schemas/Teacher'
 *           properties:
 *             id:
 *               type: string
 *               description: Unique identifier of the teacher.
 *             name:
 *               type: string
 *               description: Name of the teacher.
 */


/**
 * @swagger
 * /subjects:
 *   get:
 *     summary: Retrieve all subjects
 *     tags: [Subjects]
 *     responses:
 *       200:
 *         description: A list of subjects.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Subject'
 */
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


/**
 * @swagger
 * /subjects/{id}:
 *   get:
 *     summary: Retrieve a specific subject by ID
 *     tags: [Subjects]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The subject ID
 *     responses:
 *       200:
 *         description: Subject details retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subject'
 *       404:
 *         description: Subject not found.
 */
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


/**
 * @swagger
 * /subjects:
 *   post:
 *     summary: Create a new subject
 *     tags: [Subjects]
 *     security:
 *       - customAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - teacher
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the subject.
 *               teacher:
 *                 type: object
 *                 required:
 *                   - id
 *                   - name
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: Unique identifier of the teacher.
 *                   name:
 *                     type: string
 *                     description: Name of the teacher.
 *     responses:
 *       201:
 *         description: Subject created successfully.
 *       400:
 *         description: Missing required fields.
 *       401:
 *         description: Unauthorized - No token provided.
 *       403:
 *         description: Forbidden - Invalid token.
 */
router.post('/', authorize,(req, res) => {
    const { name, teacher } = req.body;

    if (!name || !teacher || !teacher.id || !teacher.name) {
        return res.status(400).send("Bad Request: Missing required fields"); // 400 - Bad Request
    }

    const newId = (subjects.length + 1).toString();
    const newSubject = { id: newId, name, teacher };
    subjects.push(newSubject);

    res.status(201).json(newSubject);  // 201 - Created
});

/**
 * @swagger
 * /subjects/{id}:
 *   put:
 *     summary: Fully update a subject
 *     tags: [Subjects]
 *     security:
 *       - customAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The subject ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Subject'
 *     responses:
 *       200:
 *         description: Subject updated successfully.
 *       400:
 *         description: Missing required fields.
 *       404:
 *         description: Subject not found.
 *       401:
 *         description: Unauthorized - No token provided.
 *       403:
 *         description: Forbidden - Invalid token.
 */
router.put('/:id', authorize,(req, res) => {
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

/**
 * @swagger
 * /subjects/{id}:
 *   patch:
 *     summary: Partially update a subject
 *     tags: [Subjects]
 *     security:
 *       - customAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The subject ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               teacher:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *     responses:
 *       200:
 *         description: Subject updated successfully.
 *       404:
 *         description: Subject not found.
 *       401:
 *         description: Unauthorized - No token provided.
 *       403:
 *         description: Forbidden - Invalid token.
 */
router.patch('/:id', authorize,(req, res) => {
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


/**
 * @swagger
 * /subjects/{id}:
 *   delete:
 *     summary: Delete a subject
 *     tags: [Subjects]
 *     security:
 *       - customAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The subject ID
 *     responses:
 *       204:
 *         description: Subject deleted successfully.
 *       404:
 *         description: Subject not found.
 *       401:
 *         description: Unauthorized - No token provided.
 *       403:
 *         description: Forbidden - Invalid token.
 */
router.delete('/:id', authorize,(req, res) => {
    const subjectIndex = subjects.findIndex(s => s.id === req.params.id);

    if (subjectIndex === -1) {
        return res.status(404).send("Subject not found"); // 404 - Not Found
    }

    subjects.splice(subjectIndex, 1);

    res.status(204).send(); // 204 - No Content
});

export default router;
