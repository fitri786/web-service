class ClientError extends Error {
    name = 'ClientError';
  
    constructor(message, statusCode = 400) {
      super(message);
      this.statusCode = statusCode;
    }
  }
  
  module.exports = ClientError;
  
