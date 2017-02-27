exports.renderAnlayticsDashboard = function (req, res, next) {

  var data = {}
  
  res.render('analytics', {
    data: data,
    title: 'QuickBot',
    partials: {
      header: 'header',
      footer: 'footer',
    }
  });
}

exports.getAppoinments = function (req, res, next) {
  var deptName = req.params.deptType;
  var dateApp = req.params.aptDate;
  var actualDate = new Date();
  var minDate = new Date(actualDate.getFullYear(), actualDate.getMonth(), actualDate.getDate() - 1);
  var maxDate = new Date(actualDate.getFullYear(), actualDate.getMonth(), actualDate.getDate() + 1);
  appointments.find({
    "startdate": {
      $gt: new Date(minDate)
    },
    "enddate": {
      $lt: new Date(maxDate)
    }
  }, function (err, data) {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(data);
    }
  })

}