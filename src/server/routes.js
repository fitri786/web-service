const { postPredictHandler, getHistoriesHandler } = require('../server/handler');

const routes = [
  {
    path: '/predict/histories',
    method: 'GET',
    handler: getHistoriesHandler,
  },
  {
    path: '/predict',
    method: 'POST',
    handler: postPredictHandler,
    options: {
      payload: {
        multipart: true,
        allow: 'multipart/form-data'
        // maxSize: 1000000, 
      },
    },
  },
];

module.exports = routes;