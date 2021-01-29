//THE CUSTOM ERROR HANDLER CLASS

class appError extends Error {
  constructor(message) {
    super(message);

    this.statusCode = 400;

    this.status = 'error';

    this.data = null;
  }
}

//exporting the class

module.exports = appError;
