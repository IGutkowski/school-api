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

/**
 * @swagger
 * components:
 *   schemas:
 *     Class:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier of the class.
 *         name:
 *           type: string
 *           description: Name of the class.
 *         subjects:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Subject'
 *           description: List of subjects in the class.
 */

/**
 * @swagger
 * /classes:
 *   get:
 *     summary: Retrieve all classes
 *     tags: [Classes]
 *     responses:
 *       200:
 *         description: A list of classes.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Class'
 */
router.get('/', cache, (req, res) => {
    const classesWithLinks = classes.map(clas => ({
        ...clas,
        _links: {
            main: { href: `${req.protocol}://${req.get('host')}/`, method: 'GET' },
            self: { href: `${req.protocol}://${req.get('host')}/classes/${clas.id}`, method: 'GET' },
            updatePartial: { href: `${req.protocol}://${req.get('host')}/classes/${clas.id}`, method: 'PATCH' },
            updateFull: { href: `${req.protocol}://${req.get('host')}/classes/${clas.id}`, method: 'PUT' },
            delete: { href: `${req.protocol}://${req.get('host')}/classes/${clas.id}`, method: 'DELETE' },
            allClasses: { href: `${req.protocol}://${req.get('host')}/classes`, method: 'GET' }
        }
    }));
    res.status(200).json(classesWithLinks);
});

/**
 * @swagger
 * /classes/{id}:
 *   get:
 *     summary: Retrieve a class by ID
 *     tags: [Classes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The class ID
 *     responses:
 *       200:
 *         description: Class data retrieved.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Class'
 *       404:
 *         description: Class not found.
 */
router.get('/:id', cache, (req, res) => {
    const clas = classes.find(c => c.id === req.params.id);

    if (clas) {
        const classWithLinks = {
            ...clas,
            _links: {
                main: { href: `${req.protocol}://${req.get('host')}/`, method: 'GET' },
                self: { href: `${req.protocol}://${req.get('host')}/classes/${clas.id}`, method: 'GET' },
                updatePartial: { href: `${req.protocol}://${req.get('host')}/classes/${clas.id}`, method: 'PATCH' },
                updateFull: { href: `${req.protocol}://${req.get('host')}/classes/${clas.id}`, method: 'PUT' },
                delete: { href: `${req.protocol}://${req.get('host')}/classes/${clas.id}`, method: 'DELETE' },
                allClasses: { href: `${req.protocol}://${req.get('host')}/classes`, method: 'GET' }
            }
        };
        res.status(200).json(classWithLinks);
    } else {
        res.status(404).send("Class not found");
    }
});

/**
 * @swagger
 * /classes/{id}:
 *   delete:
 *     summary: Delete a class by ID
 *     tags: [Classes]
 *     security:
 *       - customAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The class ID
 *       - in: header
 *         name: Content-Type
 *         schema:
 *           type: string
 *           example: application/json
 *         required: true
 *         description: The MIME type of the request.
 *     responses:
 *       204:
 *         description: Class deleted successfully.
 *       401:
 *         description: Unauthorized - Access denied. No token provided.
 *       403:
 *         description: Forbidden - Access denied. Invalid token.
 *       404:
 *         description: Class not found.
 *       415:
 *         description: Unsupported Media Type - Server accepts only application/json data.
 */

router.delete('/:id', authorize, (req, res) => {
    const classIndex = classes.findIndex(c => c.id === req.params.id);

    if (classIndex === -1) {
        return res.status(404).send("Class not found"); // 404 - Not Found
    }

    classes.splice(classIndex, 1);

    res.status(204).send(); // 204 - No Content
});

/**
 * @swagger
 * /classes:
 *   post:
 *     summary: Create a new class
 *     tags: [Classes]
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
 *               - subjects
 *             properties:
 *               name:
 *                 type: string
 *               subjects:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Class created successfully.
 *       400:
 *         description: Missing required fields.
 *       401:
 *         description: Access denied. No token provided.
 *       403:
 *         description: Access denied. Invalid token.
 */
router.post('/', authorize, (req, res) => {
    const { name, subjects } = req.body;

    if (!name || !subjects) {
        return res.status(400).send("Bad Request: Missing required fields"); // 400 - Bad Request
    }

    const newId = (classes.length + 1).toString();

    const newClass = { id: newId, name, subjects };
    classes.push(newClass);

    res.status(201).json(newClass);  // 201 - Created
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

/**
 * @swagger
 * /classes/{id}:
 *   put:
 *     summary: Fully update a class
 *     tags: [Classes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The class ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - subjects
 *             properties:
 *               name:
 *                 type: string
 *               subjects:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Class updated successfully.
 *       400:
 *         description: Missing required fields.
 *       404:
 *         description: Class not found.
 *       401:
 *         description: Access denied. No token provided.
 *       403:
 *         description: Access denied. Invalid token.
 */
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

/**
 * @swagger
 * /classes/{id}:
 *   patch:
 *     summary: Partially update a class
 *     tags: [Classes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The class ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               subjects:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Class updated successfully.
 *       404:
 *         description: Class not found.
 *       401:
 *         description: Access denied. No token provided.
 *       403:
 *         description: Access denied. Invalid token.
 */
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