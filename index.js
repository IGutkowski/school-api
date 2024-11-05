import express from 'express';
import studentsRoutes from './routes/students.js';
import teachersRoutes from './routes/teachers.js';
import subjectsRoutes from './routes/subjects.js';
import classesRoutes from './routes/classes.js';
import cors from 'cors';




const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.json({
        message: "Welcome to the School API!",
        _links: {
            allStudents: { href: `${req.protocol}://${req.get('host')}/students`, method: 'GET' },
            allClasses: { href: `${req.protocol}://${req.get('host')}/classes`, method: 'GET' },
            allTeachers: { href: `${req.protocol}://${req.get('host')}/teachers`, method: 'GET' },
            allSubjects: { href: `${req.protocol}://${req.get('host')}/subjects`, method: 'GET' }
        }
    });
});


app.use('/students', studentsRoutes);
app.use('/teachers', teachersRoutes);
app.use('/subjects', subjectsRoutes);
app.use('/classes', classesRoutes);

app.listen(8989, () => {
    console.log("Started on  8989");
});
