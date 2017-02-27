var express = require('express');
var router = express.Router();
var opdController = require('../controllers/opdController');

/* GET OPD page. */
router.get('/dashboard', function(req, res, next) {
    
    opdController.renderOpdDashboard(req, res, next);
 
});

router.get('/apts', function(req, res, next) {
    
    opdController.getAppoinments(req, res, next);
 
});




module.exports = router;
