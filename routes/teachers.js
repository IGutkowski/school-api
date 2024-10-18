import express from 'express';


const router = express.Router();

export const teachers = [
    { id: '1', name: 'John Smith', gender: 'male', subject: 'Mathematics' },
    { id: '2', name: 'Jane Doe', gender: 'female', subject: 'Physics' },
    { id: '3', name: 'Albert Johnson', gender: 'male', subject: 'Chemistry' },
    { id: '4', name: 'Emily Davis', gender: 'female', subject: 'Biology' },
    { id: '5', name: 'Michael Brown', gender: 'male', subject: 'History' },
];

router.get('/', (req, res) => {
    res.json(teachers);
});

router.get('/:id', (req, res) => {
    const teacher = teachers.find(t => t.id === req.params.id);
    if (teacher) {
        res.json(teacher);
    } else {
        res.status(404).send("Teacher not found");
    }
});

export default router;