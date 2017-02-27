  var date = new Date();
  var d = date.getDate();
  var m = date.getMonth();
  var y = date.getFullYear();

  var calendar = $('#calendar').fullCalendar({
      allDaySlot: false,
      displayEventTime: false,
      defaultView: 'agendaDay',
      minTime: "08:00:00",
      maxTime: "21:00:00",
      height: 800,
      dayNames:['','','','','','',''],
      header: {
          left: 'prev,next today',
          center: 'title',
          right: 'month,agendaWeek,agendaDay'
      },
      /*viewDisplay: function (view) {
          var h;
          if (view.name == "month") {
              h = NaN;
          } else {
              h = 2500; // high enough to avoid scrollbars
          }

          $('#calendar').fullCalendar('option', 'contentHeight', h);
      },*/
      loading: function (is_loading, view) {
          if (!is_loading) { //false when event loading ends
              var all_day_height = parseInt($('#' + calendarid + ' .fc-all-day th.fc-axis').height());
              if (!isNaN(all_day_height)) {
                  $('#' + calendarid).fullCalendar('option', 'contentHeight', all_day_height + agendaHeight);
              }

          }
      },
      eventRender: function (event, element, view) {
          $('.fc-view-agendaDay > div > div').css('overflow-y', 'hidden');
          element.css("width", '100px');
          element.css("height", '50px');
          element.title = event.patient;
          //var nextEventLeft = element.offset().left + element.width() + 100;
          //element.parent().children().eq(element.index() + 1).css('left', nextEventLeft);

      },
      eventClick: function (calEvent, jsEvent, view) {
          $('#patientName').text(calEvent.patient);
          $('#department').text(calEvent.dept_name);
          $('#age').text(calEvent.age | 45);
          $('#gender').text(calEvent.gender || 'male');
          var date = new Date(calEvent.startdate);

          var month = date.getMonth() + 1;
          var day = date.getDate();
          var hour = date.getHours();
          var min = date.getMinutes();
          var sec = date.getSeconds();
          month = (month < 10 ? "0" : "") + month;
          day = (day < 10 ? "0" : "") + day;
          hour = (hour < 10 ? "0" : "") + hour;
          min = (min < 10 ? "0" : "") + min;
          sec = (sec < 10 ? "0" : "") + sec;
          var ampm;
          if (hour <= 12) {
              ampm = "AM";
          } else {
              ampm = "PM";
          }
          $('#starttime').text(hour + ":" + min+" "+ampm);
          $('#aptDetail').modal("show");

      },
      selectable: true,
      selectHelper: true,
      year: y,
      month: m,
      date: d,
      slotMinutes: 15,
      events: []

  });


  var addApt = function (apt) {
      apt.title = apt.patient;
      apt.start = new Date(apt.startdate);
      apt.end = new Date(apt.enddate);
      switch (apt.dept_name.toLowerCase()) {
          case "ophthalmology":
              apt.color = "#f48042";
              break;
          case "neurology":
              apt.color = "#0a97af";
              break;
          case "gynaecology":
              apt.color = "#f97000";
              break;
          case "microbiology":
              apt.color = "#ea8ce2";
              break;
          case "orthopedics":
              apt.color = "#7c5e3e";
              break;
          case "urology":
              apt.color = "#e0d257";
              break;

      }
      calendar.fullCalendar('renderEvent', apt, true);
  }

  $.ajax({
      url: "/opd/apts",
      success: function (results) {
          //console.log(results);
          results.forEach(function (apt) {
              addApt(apt);
          })
      }
  });


  var drawAptGraph = function (data) {

      var data = [{
                  y: 'Neurology',
                  a: 20
              },
              {
                  y: 'Microbiology',
                  a: 33
              },
              {
                  y: 'Urology',
                  a: 15
              },
               {
                  y: 'Gynaecology',
                  a: 25
              }

          ],
          config = {
              data: data,
              xkey: 'y',
              ykeys: ['a'],
              labels: ['# of appointments'],
              barColors: ['#73ba71']
          };
      config.element = 'apt-type-graph';
      Morris.Bar(config);


  }
  drawAptGraph();

  var socket = io();

  socket.on('newApt', function (data) {
      var totalPatients = $('#totalPatients').text();
      totalPatients++;
      $('#totalPatients').text(totalPatients);
      if (data.gender == "female") {
          var totalFemales = $('#totalFemales').text();
          totalFemales++;
          $('#totalFemales').text(totalFemales);
      } else {
          var totalMales = $('#totalMales').text();
          totalMales++;
          $('#totalMales').text(totalMales);
      }
      addApt(data);
  });