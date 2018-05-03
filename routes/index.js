var express = require('express');
var router = express.Router();

var context_array = [];
var number = 0;
var context = null;

/* GET home page. */
router.get('/',function(req, res, next) {
    context_array = [];
    number = 0;
    context = null;
    if(!conversation) {
        console.log("Conversation non initialisée");
        res.render('error');
    } else {
        console.log("Conversation initialisée");
        res.render('index', { conversation: conversation});
    }
});

router.post('/',function(req, res, next) {
    //console.log(req.body.input);
    //console.log(context);
    conversation.message({
        input: { text: req.body.input},
        context: context_array[context_array.length-1] ,
        workspace_id: '635a4d6e-022d-4e16-88d6-4844c2cdcc99'
    }, function(err, response) {
        if (err) {
           console.error(err);
       } else {
            console.log(response);
            var rep = response.output.text;
            /*SAVE CONTEXT*/
            context = response.context;
            context_array[number] = response.context;
            //console.log(context_array);
            number++;
            /*SAVE CONTEXT*/
            res.send(rep);
        }
    });
});

module.exports = router;
