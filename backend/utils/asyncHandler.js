module.exports = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
//module allows others files to import and use this function

//fn is about the function you want to execute

//request , response and pass to control to the next middleware

//this is a fn wraps its result in a promise

//if the promise rejects ... passes the error to Express by calling
//next(error)