const predictClassification = require('../services/inferenceService');
const crypto = require('crypto');
const storeData = require('../services/storeData');
const { Firestore } = require('@google-cloud/firestore');

async function postPredictHandler(request, h) {
  const { image } = request.payload;
  const { model } = request.server.app;

 
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  const data = {
    id,
    result: null,
    suggestion: null,
    createdAt,
  };

  
  const { result, suggestion } = await predictClassification(model, image);
  data.result = result;
  data.suggestion = suggestion;

  await storeData(id, data);

  
  const response = h.response({
    status: 'success',
    message: 'Model is predicted successfully',
    data,
  });
  response.code(201);
  return response;
}

async function getHistoriesHandler(request, h) {
  const db = new Firestore();
  const predictCollection = db.collection('prediction');
  const predictSnapshot = await predictCollection.get();

  const data = predictSnapshot.docs.map(doc => ({
    id: doc.id,
    history: doc.data(),
  }));

  return h.response({
    status: 'success',
    data,
  }).code(200);
}

module.exports = { postPredictHandler, getHistoriesHandler };