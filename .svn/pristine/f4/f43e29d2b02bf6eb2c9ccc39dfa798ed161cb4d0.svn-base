var express = require('express');
var router = express.Router();
var analyticController = require('../controllers/analyticsController');

/* GET OPD page. */
router.get('/dashboard', function(req, res, next) {
    
    analyticController.renderAnlayticsDashboard(req, res, next);
 
});


module.exports = router;
