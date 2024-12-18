require('dotenv').config();

const Hapi = require('@hapi/hapi');
const routes = require('../server/routes');
const loadModel = require('../services/loadModel');
const InputError = require('../exceptions/InputError');

async function startServer() {
    try {
        const server = Hapi.server({
            port: process.env.PORT || 3000,
            host: '0.0.0.0',
            routes: {
                cors: {
                    origin: ['*'],
                },
            },
        });

        // Load your model
        const model = await loadModel();
        server.app.model = model;

        // Set up routes
        server.route(routes);

        // Error handling for payload limits and other errors
        server.ext('onPreResponse', function (request, h) {
            const response = request.response;

            // Respon Limit size File
            if (response.isBoom && response.output.statusCode === 413) {
                const newResponse = h.response({
                    status: 'fail',
                    message: 'Payload content length greater than maximum allowed: 1000000',
                });
                newResponse.code(413);
                return newResponse;
            }

            if (response instanceof InputError || response.isBoom) {
                const statusCode = response instanceof InputError ? response.statusCode : response.output.statusCode;
                const newResponse = h.response({
                    status: 'fail',
                    message: 'Terjadi kesalahan dalam melakukan prediksi',
                });
                newResponse.code(parseInt(statusCode));
                return newResponse;
            }

            return h.continue;
        });

        // Start the Hapi server
        await server.start();
        console.log(`Server started at: ${server.info.uri}`);
    } catch (error) {
        console.error('Error starting server:', error);
        process.exit(1);
    }
}

startServer();
