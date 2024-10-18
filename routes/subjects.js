import express from 'express';


const router = express.Router();

export const subjects = [
    { id: '1', name: 'Mathematics', teacher: { id: '1', name: 'John Smith' } },
    { id: '2', name: 'Physics', teacher: { id: '2', name: 'Jane Doe' } },
    { id: '3', name: 'Chemistry', teacher: { id: '3', name: 'Albert Johnson' } },
    { id: '4', name: 'Biology', teacher: { id: '4', name: 'Emily Davis' } },
    { id: '5', name: 'History', teacher: { id: '5', name: 'Michael Brown' } },
];

router.get('/', (req, res) => {
    res.json(subjects);
});

router.get('/:id', (req, res) => {
    const subject = subjects.find(s => s.id === req.params.id);
    if (subject) {
        res.json(subject);
    } else {
        res.status(404).send("Subject not found");
    }

});

export default router;
