import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'School API',
            version: '1.0.0',
            description: 'API documentation for managing classes, students, subjects, and teachers.',
        },
        components: {
            securitySchemes: {
                customAuth: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'Authorization',
                    description: 'Provide the token (e.g., 123) to access the endpoints',
                },
            },
        },
        security: [
            {
                customAuth: [],
            },
        ],
    },
    apis: ['./routes/*.js'],
};


const swaggerSpec = swaggerJsdoc(options);
export default swaggerSpec;
