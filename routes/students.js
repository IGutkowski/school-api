import express from 'express';
import { classes } from './classes.js';
import { authorize } from '../auth.js';
import { contentType } from '../contentType.js';
import { cache } from '../cache.js';
import { security } from '../security.js';

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

/**
 * @swagger
 * components:
 *   schemas:
 *     Student:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier of the student.
 *         name:
 *           type: string
 *           description: Name of the student.
 *         age:
 *           type: integer
 *           description: Age of the student.
 *         gender:
 *           type: string
 *           enum: [male, female, other]
 *           description: Gender of the student.
 *         class:
 *           type: object
 *           $ref: '#/components/schemas/Class'
 *         grades:
 *           type: object
 *           additionalProperties:
 *             type: array
 *             items:
 *               type: integer
 *           description: Grades of the student.
 *         absences:
 *           type: object
 *           additionalProperties:
 *             type: integer
 *           description: Absences of the student.
 */

/**
 * @swagger
 * /students:
 *   get:
 *     summary: Retrieve all students
 *     tags: [Students]
 *     responses:
 *       200:
 *         description: A list of students.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Student'
 *       404:
 *         description: No students found.
 */
router.get('/', (req, res) => {
    if (students.length === 0) {
        return res.status(404).send("No students found"); // 404 - Not Found
    }

    const studentsWithLinks = students.map(student => ({
        ...student,
        _links: {
            main: { href: `${req.protocol}://${req.get('host')}/`, method: 'GET' },
            self: { href: `${req.protocol}://${req.get('host')}/students/${student.id}`, method: 'GET' },
            updatePartial: { href: `${req.protocol}://${req.get('host')}/students/${student.id}`, method: 'PATCH' },
            updateFull: { href: `${req.protocol}://${req.get('host')}/students/${student.id}`, method: 'PUT' },
            delete: { href: `${req.protocol}://${req.get('host')}/students/${student.id}`, method: 'DELETE' },
            allStudents: { href: `${req.protocol}://${req.get('host')}/students`, method: 'GET' }
        }
    }));

    res.status(200).json(studentsWithLinks); // 200 - OK
});


/**
 * @swagger
 * /students/{id}:
 *   get:
 *     summary: Retrieve a specific student by ID
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The student ID
 *     responses:
 *       200:
 *         description: Student data retrieved.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       404:
 *         description: Student not found.
 */
router.get('/:id', cache, (req, res) => {
    const student = students.find(s => s.id === req.params.id);

    if (student) {
        const studentWithLinks = {
            ...student,
            _links: {
                main: { href: `${req.protocol}://${req.get('host')}/`, method: 'GET' },
                self: { href: `${req.protocol}://${req.get('host')}/students/${student.id}`, method: 'GET' },
                updatePartial: { href: `${req.protocol}://${req.get('host')}/students/${student.id}`, method: 'PATCH' },
                updateFull: { href: `${req.protocol}://${req.get('host')}/students/${student.id}`, method: 'PUT' },
                delete: { href: `${req.protocol}://${req.get('host')}/students/${student.id}`, method: 'DELETE' },
                allStudents: { href: `${req.protocol}://${req.get('host')}/students`, method: 'GET' }
            }
        };
        res.status(200).json(studentWithLinks); // 200 - OK
    } else {
        res.status(404).send("Student not found"); // 404 - Not Found
    }
});


/**
 * @swagger
 * /students:
 *   post:
 *     summary: Create a new student
 *     tags: [Students]
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
 *               - age
 *               - gender
 *               - classId
 *             properties:
 *               name:
 *                 type: string
 *               age:
 *                 type: integer
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *               classId:
 *                 type: string
 *               grades:
 *                 type: object
 *                 additionalProperties:
 *                   type: array
 *                   items:
 *                     type: integer
 *               absences:
 *                 type: object
 *                 additionalProperties:
 *                   type: integer
 *     responses:
 *       201:
 *         description: Student created successfully.
 *       400:
 *         description: Bad Request - Missing required fields.
 *       401:
 *         description: Unauthorized - Access denied. No token provided.
 *       403:
 *         description: Forbidden - Access denied. Invalid token.
 *       415:
 *         description: Unsupported Media Type - Server accepts only application/json data.
 */

router.post('/', authorize, (req, res) => {
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

/**
 * @swagger
 * /students/{id}:
 *   put:
 *     summary: Fully update a student
 *     tags: [Students]
 *     security:
 *       - customAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The student ID
 *       - in: header
 *         name: Content-Type
 *         schema:
 *           type: string
 *           example: application/json
 *         required: true
 *         description: The MIME type of the request.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - age
 *               - gender
 *               - classId
 *             properties:
 *               name:
 *                 type: string
 *               age:
 *                 type: integer
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *               classId:
 *                 type: string
 *               grades:
 *                 type: object
 *                 additionalProperties:
 *                   type: array
 *                   items:
 *                     type: integer
 *               absences:
 *                 type: object
 *                 additionalProperties:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Student updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       400:
 *         description: Bad Request - Missing required fields.
 *       401:
 *         description: Unauthorized - Access denied. No token provided.
 *       403:
 *         description: Forbidden - Access denied. Invalid token.
 *       404:
 *         description: Student not found.
 *       415:
 *         description: Unsupported Media Type - Server accepts only application/json data.
 */


router.put('/:id', authorize, (req, res) => {
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

/**
 * @swagger
 * /students/{id}:
 *   patch:
 *     summary: Partially update a student
 *     tags: [Students]
 *     security:
 *       - customAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The student ID
 *       - in: header
 *         name: Content-Type
 *         schema:
 *           type: string
 *           example: application/json
 *         required: true
 *         description: The MIME type of the request.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               age:
 *                 type: integer
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *               classId:
 *                 type: string
 *               grades:
 *                 type: object
 *                 additionalProperties:
 *                   type: array
 *                   items:
 *                     type: integer
 *               absences:
 *                 type: object
 *                 additionalProperties:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Student updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       401:
 *         description: Unauthorized - Access denied. No token provided.
 *       403:
 *         description: Forbidden - Access denied. Invalid token.
 *       404:
 *         description: Student not found.
 *       415:
 *         description: Unsupported Media Type - Server accepts only application/json data.
 */
router.patch('/:id', authorize, (req, res) => {
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

/**
 * @swagger
 * /students/{id}:
 *   delete:
 *     summary: Delete a student
 *     tags: [Students]
 *     security:
 *       - customAuth: []  # Reference to the security scheme
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The student ID
 *       - in: header
 *         name: Content-Type
 *         schema:
 *           type: string
 *           example: application/json
 *         required: true
 *         description: The MIME type of the request.
 *     responses:
 *       204:
 *         description: Student deleted successfully.
 *       401:
 *         description: Unauthorized - Access denied. No token provided.
 *       403:
 *         description: Forbidden - Access denied. Invalid token.
 *       404:
 *         description: Student not found.
 *       415:
 *         description: Unsupported Media Type - Server accepts only application/json data.
 */
router.delete('/:id', authorize, (req, res) => {
    const studentIndex = students.findIndex(s => s.id === req.params.id);

    if (studentIndex === -1) {
        return res.status(404).send("Student not found"); // 404 - Not Found
    }

    students.splice(studentIndex, 1);
    res.status(204).send(); // 204 - No Content
});

export default router;
