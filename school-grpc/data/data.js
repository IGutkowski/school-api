export let teachers = [
    { id: '1', name: 'John Smith', gender: 'male', subject: 'Mathematics' },
    { id: '2', name: 'Jane Doe', gender: 'female', subject: 'Physics' },
    { id: '3', name: 'Albert Johnson', gender: 'male', subject: 'Chemistry' },
    { id: '4', name: 'Emily Davis', gender: 'female', subject: 'Biology' },
    { id: '5', name: 'Michael Brown', gender: 'male', subject: 'History' },
];

export let subjects = [
    {
        id: '1',
        name: 'Mathematics',
        teacher: { id: '1', name: 'John Smith', gender: 'male', subject: 'Mathematics' },
    },
    {
        id: '2',
        name: 'Physics',
        teacher: { id: '2', name: 'Jane Doe', gender: 'female', subject: 'Physics' },
    },
    {
        id: '3',
        name: 'Chemistry',
        teacher: { id: '3', name: 'Albert Johnson', gender: 'male', subject: 'Chemistry' },
    },
    {
        id: '4',
        name: 'Biology',
        teacher: { id: '4', name: 'Emily Davis', gender: 'female', subject: 'Biology' },
    },
    {
        id: '5',
        name: 'History',
        teacher: { id: '5', name: 'Michael Brown', gender: 'male', subject: 'History' },
    },
];

export let classes = [
    {
        id: '1',
        name: 'Class 1',
        subjects: [],
    },
    {
        id: '2',
        name: 'Class 2',
        subjects: [],
    },
    {
        id: '3',
        name: 'Class 3',
        subjects: [],
    },
];

classes[0].subjects = [subjects[0], subjects[1]];
classes[1].subjects = [subjects[2], subjects[3]];
classes[2].subjects = [subjects[4]];

export let students = [
    {
        id: '1',
        name: 'Alice Green',
        age: 15,
        gender: 'female',
        classInfo: classes[0],
        grades: [
            { subjectId: '1', scores: [4, 5, 3] },
            { subjectId: '2', scores: [5, 3, 4] },
        ],
        absences: [
            { subjectId: '1', count: 3 },
            { subjectId: '2', count: 1 },
        ],
    },
    {
        id: '2',
        name: 'Bob White',
        age: 16,
        gender: 'male',
        classInfo: classes[1],
        grades: [
            { subjectId: '3', scores: [3, 4] },
            { subjectId: '4', scores: [5, 4] },
        ],
        absences: [
            { subjectId: '3', count: 1 },
            { subjectId: '4', count: 3 },
        ],
    },
    {
        id: '3',
        name: 'Charlie Black',
        age: 17,
        gender: 'male',
        classInfo: classes[2],
        grades: [
            { subjectId: '5', scores: [4, 5] },
        ],
        absences: [
            { subjectId: '5', count: 2 },
        ],
    },
    {
        id: '4',
        name: 'Diana Blue',
        age: 15,
        gender: 'female',
        classInfo: classes[0],
        grades: [
            { subjectId: '1', scores: [3, 4, 4] },
            { subjectId: '2', scores: [4, 5, 3] },
        ],
        absences: [
            { subjectId: '1', count: 1 },
            { subjectId: '2', count: 2 },
        ],
    },
    {
        id: '5',
        name: 'Evan Red',
        age: 16,
        gender: 'other',
        classInfo: classes[1],
        grades: [
            { subjectId: '3', scores: [2, 3, 3] },
            { subjectId: '4', scores: [4, 4] },
        ],
        absences: [
            { subjectId: '3', count: 2 },
            { subjectId: '4', count: 1 },
        ],
    },
];
