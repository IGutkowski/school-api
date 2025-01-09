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

/**
 * @swagger
 * components:
 *   schemas:
 *     Teacher:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier of the teacher.
 *         name:
 *           type: string
 *           description: Name of the teacher.
 *         gender:
 *           type: string
 *           enum: [male, female, other]
 *           description: Gender of the teacher.
 *         subject:
 *           type: string
 *           description: Subject the teacher specializes in.
 */


/**
 * @swagger
 * /teachers:
 *   get:
 *     summary: Retrieve all teachers
 *     tags: [Teachers]
 *     responses:
 *       200:
 *         description: A list of teachers.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Teacher'
 */
router.get('/', cache, (req, res) => {
    const teachersWithLinks = teachers.map(teacher => ({
        ...teacher,
        _links: {
            main: { href: `${req.protocol}://${req.get('host')}/`, method: 'GET' },
            self: { href: `${req.protocol}://${req.get('host')}/teachers/${teacher.id}`, method: 'GET' },
            updatePartial: { href: `${req.protocol}://${req.get('host')}/teachers/${teacher.id}`, method: 'PATCH' },
            updateFull: { href: `${req.protocol}://${req.get('host')}/teachers/${teacher.id}`, method: 'PUT' },
            delete: { href: `${req.protocol}://${req.get('host')}/teachers/${teacher.id}`, method: 'DELETE' },
            allTeachers: { href: `${req.protocol}://${req.get('host')}/teachers`, method: 'GET' }
        }
    }));
    res.status(200).json(teachersWithLinks);
});

/**
 * @swagger
 * /teachers/{id}:
 *   get:
 *     summary: Retrieve a specific teacher by ID
 *     tags: [Teachers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The teacher ID
 *     responses:
 *       200:
 *         description: Teacher details retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Teacher'
 *       404:
 *         description: Teacher not found.
 */
router.get('/:id', cache, (req, res) => {
    const teacher = teachers.find(t => t.id === req.params.id);

    if (teacher) {
        const teacherWithLinks = {
            ...teacher,
            _links: {
                main: { href: `${req.protocol}://${req.get('host')}/`, method: 'GET' },
                self: { href: `${req.protocol}://${req.get('host')}/teachers/${teacher.id}`, method: 'GET' },
                updatePartial: { href: `${req.protocol}://${req.get('host')}/teachers/${teacher.id}`, method: 'PATCH' },
                updateFull: { href: `${req.protocol}://${req.get('host')}/teachers/${teacher.id}`, method: 'PUT' },
                delete: { href: `${req.protocol}://${req.get('host')}/teachers/${teacher.id}`, method: 'DELETE' },
                allTeachers: { href: `${req.protocol}://${req.get('host')}/teachers`, method: 'GET' }
            }
        };
        res.status(200).json(teacherWithLinks);
    } else {
        res.status(404).send("Teacher not found");
    }
});

/**
 * @swagger
 * /teachers:
 *   post:
 *     summary: Create a new teacher
 *     tags: [Teachers]
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
 *               - gender
 *               - subject
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the teacher.
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *                 description: Gender of the teacher.
 *               subject:
 *                 type: string
 *                 description: Subject the teacher specializes in.
 *     responses:
 *       201:
 *         description: Teacher created successfully.
 *       400:
 *         description: Missing required fields.
 *       401:
 *         description: Unauthorized - No token provided.
 *       403:
 *         description: Forbidden - Invalid token.
 */
router.post('/', authorize, (req, res) => {
    const { name, gender, subject } = req.body;

    if (!name || !gender || !subject) {
        return res.status(400).send("Bad Request: Missing required fields"); // 400 - Bad Request
    }

    const newId = (teachers.length + 1).toString();
    const newTeacher = { id: newId, name, gender, subject };
    teachers.push(newTeacher);

    res.status(201).json(newTeacher);  // 201 - Created
});

/**
 * @swagger
 * /teachers/{id}:
 *   put:
 *     summary: Fully update a teacher
 *     tags: [Teachers]
 *     security:
 *       - customAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The teacher ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Teacher'
 *     responses:
 *       200:
 *         description: Teacher updated successfully.
 *       400:
 *         description: Missing required fields.
 *       404:
 *         description: Teacher not found.
 */
router.put('/:id', authorize, (req, res) => {
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

/**
 * @swagger
 * /teachers/{id}:
 *   patch:
 *     summary: Partially update a teacher
 *     tags: [Teachers]
 *     security:
 *       - customAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The teacher ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               gender:
 *                 type: string
 *               subject:
 *                 type: string
 *     responses:
 *       200:
 *         description: Teacher updated successfully.
 *       404:
 *         description: Teacher not found.
 */
router.patch('/:id', authorize,(req, res) => {
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

/**
 * @swagger
 * /teachers/{id}:
 *   delete:
 *     summary: Delete a teacher
 *     tags: [Teachers]
 *     security:
 *       - customAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The teacher ID
 *     responses:
 *       204:
 *         description: Teacher deleted successfully.
 *       404:
 *         description: Teacher not found.
 */
router.delete('/:id', authorize,(req, res) => {
    const teacherIndex = teachers.findIndex(t => t.id === req.params.id);

    if (teacherIndex === -1) {
        return res.status(404).send("Teacher not found"); // 404 - Not Found
    }

    teachers.splice(teacherIndex, 1);

    res.status(204).send(); // 204 - No Content
});
export default router;
