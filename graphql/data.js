export const students = [
    { id: '1', name: 'Alice Green', age: 15, gender: 'female', classId: '1', grades: { Mathematics: [4, 5, 3], Physics: [5, 3, 4] }, absences: { Mathematics: 3, Physics: 1 } },
    { id: '2', name: 'Bob White', age: 16, gender: 'male', classId: '2', grades: { Chemistry: [3, 4], Biology: [5, 4] }, absences: { Chemistry: 1, Biology: 3 } },
    { id: '3', name: 'Charlie Black', age: 14, gender: 'male', classId: '1', grades: { Mathematics: [4, 5, 3], Physics: [5, 3, 4] }, absences: { Mathematics: 3, Physics: 1 } },
    { id: '4', name: 'Diana Blue', age: 17, gender: 'female', classId: '3', grades: { History: [3, 4] }, absences: { History: 2 } },
    { id: '5', name: 'Evan Red', age: 15, gender: 'other', classId: '2', grades: { Chemistry: [2, 3], Biology: [3, 4] }, absences: { Chemistry: 1, Biology: 3 } },
    { id: '6', name: 'Fiona Yellow', age: 16, gender: 'female', classId: '3', grades: { History: [5, 4] }, absences: { History: 2 } },
    { id: '7', name: 'George Purple', age: 14, gender: 'male', classId: '1', grades: { Mathematics: [3, 4], Physics: [4, 3] }, absences: { Mathematics: 3, Physics: 1 } },
    { id: '8', name: 'Hannah Brown', age: 17, gender: 'female', classId: '2', grades: { Chemistry: [4, 5], Biology: [5, 3] }, absences: { Chemistry: 1, Biology: 3 } },
    { id: '9', name: 'Ian Gray', age: 15, gender: 'male', classId: '3', grades: { History: [3, 3] }, absences: { History: 2 } },
    { id: '10', name: 'Jack Orange', age: 16, gender: 'male', classId: '1', grades: { Mathematics: [4, 3], Physics: [3, 4] }, absences: { Mathematics: 3, Physics: 1 } },
];

export const teachers = [
    { id: '1', name: 'John Smith', gender: 'male', subjectId: '1' },
    { id: '2', name: 'Jane Doe', gender: 'female', subjectId: '2' },
    { id: '3', name: 'Albert Johnson', gender: 'male', subjectId: '3' },
    { id: '4', name: 'Emily Davis', gender: 'female', subjectId: '4' },
    { id: '5', name: 'Michael Brown', gender: 'male', subjectId: '5' },
];

export const subjects = [
    { id: '1', name: 'Mathematics', teacherId: '1' },
    { id: '2', name: 'Physics', teacherId: '2' },
    { id: '3', name: 'Chemistry', teacherId: '3' },
    { id: '4', name: 'Biology', teacherId: '4' },
    { id: '5', name: 'History', teacherId: '5' },
];

export const classes = [
    { id: '1', name: 'Class 1', subjectIds: ['1', '2'] },
    { id: '2', name: 'Class 2', subjectIds: ['3', '4'] },
    { id: '3', name: 'Class 3', subjectIds: ['5'] },
    { id: '2', name: 'Class 2', subjectIds: ['1'] },
];