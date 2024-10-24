import express from 'express';
import studentsRoutes from './routes/students.js';
import teachersRoutes from './routes/teachers.js';
import subjectsRoutes from './routes/subjects.js';
import classesRoutes from './routes/classes.js';




const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send("School API!");
});

app.use('/students', studentsRoutes);
app.use('/teachers', teachersRoutes);
app.use('/subjects', subjectsRoutes);
app.use('/classes', classesRoutes);

app.listen(8989, () => {
    console.log("Started on  8989");
});
