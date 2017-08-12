const db = require('./db-config.js');
const routes = require('express').Router();
const controllers = require('./controllers');

routes.route('/helpDesk/login')
    .get(controllers.getQuestions)
    .post(controllers.postQuestion)
    .put(controllers.updateQuestion)
    .delete(controllers.deleteQuestion);

routes.route('/helpDesk/logout')


routes.route('/client')
.post(controllers.addClient)
.get(controllers.getClient)



//This is how the conroller file looks like
// const Question = require('./db/db-schema');

// exports.getQuestions = (req, res) => {
//     Question.find({}, (err, questions) => {
//         if (err) res.status(404).send(err);
//         else {
//             res.status(200).send(questions);
//         }
//     });
// };