$(document).ready(function() {
    var stream = null;

    var audioElement = null;

    $("#node-red-label").click(function() {
        window.open('https://' + window.location.hostname + "/red", '_blank');
    });

    $chatInput = $('#chat-input');
    $loader = $('.loader');
    $micButton = $('.chat-window--microphone-button');

    var isNodeJs = function() {
        return true;
    };

    var converseUrl = function() {
        return '/conversejs';
    };


    function sendRequest() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(onGotWeatherSuccess, onGotWeatherFailed);
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    }

    var getSTTToken = $.ajax('/api/speech-to-text/token');
    var getTTSToken = $.ajax('/api/text-to-speech/token');

    var deactivateMicButton = $micButton.removeClass.bind($micButton, 'active');

    function record() {
        getSTTToken.then(function(token) {
            $micButton.addClass('active');

            stream = WatsonSpeech.SpeechToText.recognizeMicrophone({
                token: token,
                continuous: false,
                outputElement: $chatInput[0],
                content_type: 'audio/wav',
                keepMicrophone: navigator.userAgent.indexOf('Firefox') > 0
            });

            stream.promise().then(function() {
                    $micButton.addClass('chat-window--microphone-button');
                    console.log('Microphone opened');
                    $micButton.addClass('normal');
                    converse($chatInput.val());
                })
                .then(function(error) {
                    $micButton.addClass('normal');
                    console.log('Microphone closed');
                    deactivateMicButton;
                })
                .catch(function(error) {
                    $micButton.addClass('normal');
                    console.log('catch micrphone');
                    deactivateMicButton;
                })
        });
    }

    function stopRecording() {
        $micButton.addClass('normal');
        if (stream) {
            try {
                stream.stop;
            } catch (err) {
                console.log("Error in stopRecording() " + err);
            }
        }
    }

    function text2Speech(data) {
        getTTSToken.then(function(token) {
            WatsonSpeech.TextToSpeech.synthesize({
                text: data,
                token: token
            });
        });
    }

    $micButton.mousedown(function() {
        $micButton.removeClass('normal').addClass('active');
        if (isNodeJs()) {
            record();
        } else {}

    });

    $micButton.mouseup(function() {
        $micButton.addClass('normal');
        if (isNodeJs()) {
            stopRecording();
        } else {}
    });

    $loader.hide();

    $("#send_message").click(function() {
        var msg = $('#chat-input').val();
		$('#chat-input').val('');
		var conversation = $('#conversation');
        conversation.append(buildUserConversation(msg));
		var height = conversation[0].scrollHeight;
		conversation.scrollTop(height);
        converse("hello", { "text" : msg });
    });

    function formatDate(date, format, utc) {
        var MMMM = ["\x00", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var MMM = ["\x01", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        var dddd = ["\x02", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        var ddd = ["\x03", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        function ii(i, len) {
            var s = i + "";
            len = len || 2;
            while (s.length < len) s = "0" + s;
            return s;
        }

        var y = utc ? date.getUTCFullYear() : date.getFullYear();
        format = format.replace(/(^|[^\\])yyyy+/g, "$1" + y);
        format = format.replace(/(^|[^\\])yy/g, "$1" + y.toString().substr(2, 2));
        format = format.replace(/(^|[^\\])y/g, "$1" + y);

        var M = (utc ? date.getUTCMonth() : date.getMonth()) + 1;
        format = format.replace(/(^|[^\\])MMMM+/g, "$1" + MMMM[0]);
        format = format.replace(/(^|[^\\])MMM/g, "$1" + MMM[0]);
        format = format.replace(/(^|[^\\])MM/g, "$1" + ii(M));
        format = format.replace(/(^|[^\\])M/g, "$1" + M);

        var d = utc ? date.getUTCDate() : date.getDate();
        format = format.replace(/(^|[^\\])dddd+/g, "$1" + dddd[0]);
        format = format.replace(/(^|[^\\])ddd/g, "$1" + ddd[0]);
        format = format.replace(/(^|[^\\])dd/g, "$1" + ii(d));
        format = format.replace(/(^|[^\\])d/g, "$1" + d);

        var H = utc ? date.getUTCHours() : date.getHours();
        format = format.replace(/(^|[^\\])HH+/g, "$1" + ii(H));
        format = format.replace(/(^|[^\\])H/g, "$1" + H);

        var h = H > 12 ? H - 12 : H == 0 ? 12 : H;
        format = format.replace(/(^|[^\\])hh+/g, "$1" + ii(h));
        format = format.replace(/(^|[^\\])h/g, "$1" + h);

        var m = utc ? date.getUTCMinutes() : date.getMinutes();
        format = format.replace(/(^|[^\\])mm+/g, "$1" + ii(m));
        format = format.replace(/(^|[^\\])m/g, "$1" + m);

        var s = utc ? date.getUTCSeconds() : date.getSeconds();
        format = format.replace(/(^|[^\\])ss+/g, "$1" + ii(s));
        format = format.replace(/(^|[^\\])s/g, "$1" + s);

        var f = utc ? date.getUTCMilliseconds() : date.getMilliseconds();
        format = format.replace(/(^|[^\\])fff+/g, "$1" + ii(f, 3));
        f = Math.round(f / 10);
        format = format.replace(/(^|[^\\])ff/g, "$1" + ii(f));
        f = Math.round(f / 10);
        format = format.replace(/(^|[^\\])f/g, "$1" + f);

        var T = H < 12 ? "AM" : "PM";
        format = format.replace(/(^|[^\\])TT+/g, "$1" + T);
        format = format.replace(/(^|[^\\])T/g, "$1" + T.charAt(0));

        var t = T.toLowerCase();
        format = format.replace(/(^|[^\\])tt+/g, "$1" + t);
        format = format.replace(/(^|[^\\])t/g, "$1" + t.charAt(0));

        var tz = -date.getTimezoneOffset();
        var K = utc || !tz ? "Z" : tz > 0 ? "+" : "-";
        if (!utc) {
            tz = Math.abs(tz);
            var tzHrs = Math.floor(tz / 60);
            var tzMin = tz % 60;
            K += ii(tzHrs) + ":" + ii(tzMin);
        }
        format = format.replace(/(^|[^\\])K/g, "$1" + K);

        var day = (utc ? date.getUTCDay() : date.getDay()) + 1;
        format = format.replace(new RegExp(dddd[0], "g"), dddd[day]);
        format = format.replace(new RegExp(ddd[0], "g"), ddd[day]);

        format = format.replace(new RegExp(MMMM[0], "g"), MMMM[M]);
        format = format.replace(new RegExp(MMM[0], "g"), MMM[M]);

        format = format.replace(/\\(.)/g, "$1");

        return format;
    };

    var buildUserConversation = function(response) {
        var date = new Date();
        var time = formatDate(date, "HH:mmtt");
        var string = '<div class="message message-sent message-with-avatar">' +
            '    <div class="message-text">' + response +
            '        <div class="message-date">' + time + '</div>' +
            '    </div>' +
            '    <div style="background-image:url(/img/patient_profile_photo.jpg)" class="message-avatar"></div>' +
            '</div>'

        return string;

    }
	
    var buildConversation = function(response, word_match, data) {
        var date = new Date();
        var time = formatDate(date, "HH:mmtt");
        
		var string = '<div class="message message-received message-with-avatar">' +
            '    <div class="message-name">QuickAid Bot</div>' +
            '    <div class="message-text">' + response;
			
		if(word_match == 'checkSlot_'){
			string = string + '        <div style="border-top: 1px solid #000; margin: 10px 0 0 0; padding: 10px 0 5px 0; font-size: 10px;"><div class="" style="font-size: 16px;">1:00 pm : Dr. Nitin</div><div style="font-size: 16px;">2:30 pm : Dr. Snehal</div><div style="font-size: 16px;">3:00 pm : Dr. Megha</div></div>';
		}
			
        string = string + '        <div class="message-date">' + time + '</div>';
			
		if(word_match == 'dispatch'){
            string = string + '        <div style="border-top: 1px solid #000; margin: 10px 0 0 0; padding: 10px 0 5px 0; font-size: 10px; text-align: center;"><a href="#" data-popup=".popup-video-call" class="open-popup" id="vchat"><i class="f7-icons">videocam_round_fill</i></a></div>';
		}
		
        string = string + '    </div>' +
            '    <div style="background-image:url(img/quickaid_profile_photo.png" class="message-avatar"></div>' +
            '</div>';

        return string;
    }
	
	var appointment_dept, db_date, appointment_time;
	
	var performAction = function(response) {
		if(response.indexOf('dispatch') !== -1){ // Ambulance
			$.post({
				url: '/bookambulance',
				data: { 'user_id' : 1 },
				dataType: 'json',
				success: function(data) {
				
					var conversation = $("#conversation");
					conversation.append(buildConversation(response, 'dispatch', ''));
					var height = conversation[0].scrollHeight;
					conversation.scrollTop(height);
				},
				error: function(err) {
					$loader.hide();
				}
			});
		}else if(response.indexOf('checkSlot_') !== -1){ // Appointment Time
			var actualResponse = response.split('checkSlot_')[0];
			var botVar = response.split('checkSlot_')[1];
			appointment_dept = botVar.split('_')[1];
			db_date = botVar.split('_')[0];
			
			/*
			$.get({
				url: '/appointment/' + $.trim(appointment_dept) + '/' + $.trim(db_date),
				dataType: 'json',
				success: function(data) {
					var conversation = $("#conversation");
					conversation.append(buildConversation(actualResponse, 'checkSlot_', data));
					var height = conversation[0].scrollHeight;
					conversation.scrollTop(height);
				},
				error: function(err) {
					$loader.hide();
				}
			});
			*/
			
			var conversation = $("#conversation");
			conversation.append(buildConversation(actualResponse, 'checkSlot_', ''));
			var height = conversation[0].scrollHeight;
			conversation.scrollTop(height);
		}else{
			var conversation = $("#conversation");
			conversation.append(buildConversation(response, '', ''));
			var height = conversation[0].scrollHeight;
			conversation.scrollTop(height);
		}
	}

    var converse = function(userText, payload) {
		// Introduce a delay (Currently, the delay is set to 1 second)
		setTimeout(function(){ 
			$.post({
				url: converseUrl(),
				data: payload,
				dataType: 'json',
				success: function(data) {
					performAction(data);

				

					if (audioElement) {
						audioElement.pause();
						if ((audioElement.currentTime !== 0) &&
							(audioElement.currentTime > 0 && audioElement.currentTime < audioElement.duration)) {
							audioElement.currentTime = 0;
						}
						audioElement = null;
					}
					
					data = data.split('checkSlot_')[0];

					getTTSToken.then(function(token) {
						audioElement = WatsonSpeech.TextToSpeech.synthesize({
							text: data,
							token: token
						});
					});
				},
				error: function(err) {
					$loader.hide();
				}
			});
		}, 1000);
    };

    var emergencyScreenSelection = false;

    /* ===== Custom Events ===== */
    $$('.message_textarea').on('keyup', function() {
        var message = $$(this);
        if (message.val() && message.val() !== '') {
            console.log('valid');
            $$('.speak-message').hide();
            $$('.send-message').show();
        } else {
            $$('.send-message').hide();
            $$('.speak-message').show();
        }
    });

    $$('.talk-to-quickaid').on('click', function() {
        myApp.showTab('#tab2');
    });

    $$('#tab2').on('tab:show', function() {
		if (emergencyScreenSelection) {
            converse("hello", {
                "text": emergencyScreenSelection
            });
            emergencyScreenSelection = false;
        } else {
            converse("hello", {
                "text": "hi"
            });
        }
    });

    $$('.card').on('click', function() {
        emergencyScreenSelection = $$(this).find('.card-content-inner').text();
        myApp.showTab('#tab2');
    });
	
	$(document).on('click','#vchat',function(event){
		//alert("hi");
		//event.preventDefault()
		//document.getElementById('111').value="function";
		myElement=document.getElementById('#start');
		$('myElement').trigger('click');
		
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.onreadystatechange = function() { 
			if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
				data = xmlHttp.responseText;
			
			//document.getElementById('111').value="function inside";
			//alert(data);
			document.getElementById('videoValues').innerHTML =data;
				
			apiKey = document.getElementById('apiKey').value;
			sessionId = document.getElementById('sessionId').value;
			token = document.getElementById('token').value;
			//document.getElementById('111').value=apiKey;
			//$$.("#myPublisherDiv").append("<p>asdf</p>");
			
			TB.setLogLevel(TB.DEBUG);

			// Initialize session, set up event listeners, and connect
			var session = OT.initSession(apiKey, sessionId); 
			session.on({ 
				streamCreated: function(event) { 
				  session.subscribe(event.stream, "videos", {insertMode: 'append'}); 
				} 
			}); 
			session.connect(token, function(error) {
			  if (error) {
				console.log( error );
			  } else {
				// Create publisher and start streaming into the session
				session.publish('myPublisherDiv', {width: 320, height: 240}); 
			  }
			});
			//session.disconnect();
		}
		xmlHttp.open("GET","https://quick-aid-videochat.herokuapp.com/" , true); // true for asynchronous 
		xmlHttp.send(null);
		
		
		
		
		
		
		//callVideoChat();					
	});
	

	

	
	
});