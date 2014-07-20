function ilv__Connect() {
	this._ilv__wsite = "http://snf-538265.vm.okeanos.grnet.gr";
	// afisse to stin grammi 10
	this._ilv__login = this._ilv__wsite + "/modules/rest/login";
	this._ilv__courses = this._ilv__wsite + "/modules/rest/courses";
	this._ilv__courselist = "";
	this._ilv_action = "";
	this._ilv__token ="";
	this._ilv__enrolledcourse ="";

	if (!(localStorage.getItem("uname") === null)) {//Check if there is already a username saved in localStorage.uname
		$("#popupLogin #uname").val(localStorage.uname);
		//Fill in the #uname input field with the localStorage value
	}

	if (!(localStorage.getItem("pass") === null)) {//Check if there is already a username saved in localStorage.pass
		$("#popupLogin #pass").val(localStorage.pass);
		//Fill in the #pass input field with the localStorage value
	}
	
	if (!(localStorage.getItem("url") === null)) {//Check if there is already a username saved in localStorage.pass
		$("#popupLogin #url").val(localStorage.url);
		//Fill in the #pass input field with the localStorage value
	} else {
		localStorage.url = "http://snf-538265.vm.okeanos.grnet.gr";
		$("#popupLogin #url").val('http://snf-538265.vm.okeanos.grnet.gr');
	}

	var subject = this;
	$("#courses-btn").click(function() {
		subject._ilv_action = "courses";
	});

	$("#announcements-btn").click(function() {
	$("#page-title p span").html("Ανακοινώσεις");
		subject._ilv_action = "announcements";
		subject.getAnnouncements(null);
		
	});

	$("#forum-btn").click(function() {
		subject._ilv_action = "forums";
	});
	
	
	$(".ui-header .logo").click(function() {
		$("#page-title p span").html("Αρχική Σελίδα");
		$("#page-content").html('<p><span class="pt13">Η πλατφόρμα <strong>Open eClass</strong> είναι ένα ολοκληρωμένο Σύστημα Διαχείρισης Ηλεκτρονικών Μαθημάτων για την ηλεκτρονική οργάνωση, αποθήκευση και παρουσίαση του εκπαιδευτικού υλικού. Αποτελεί την πρόταση του Ακαδημαϊκού Διαδικτύου GUnet για την υποστήριξη των Υπηρεσιών Ασύγχρονης Τηλεκπαίδευσης. Βασική επιδίωξη της πλατφόρμας είναι η ενσωμάτωση των νέων τεχνολογιών και η εποικοδομητική χρήση του διαδικτύου στην εκπαιδευτική διαδικασία. Βασίζεται στη φιλοσοφία του λογισμικού ανοικτού κώδικα, υποστηρίζεται ενεργά από το GUnet και διανέμεται ελεύθερα.</span></p>');
	});


	$("#courses-list").on("click", "a", function() {
		var clickedCourse = $(this).attr("id").substring(7);
		//console.log(clickedCourse);
		if (subject._ilv_action == "courses") {
			$course = $.grep(subject._ilv__courselist, function(obj) {
			    return obj.code === clickedCourse;
			});
			console.log($course);
			subject._ilv__enrolledcourse=$course[0].title;
			$("#page-title p span").html($course[0].title);
			var courseDetails = "<dl>";
			courseDetails += "<dt>Διδάσκοντας</dt>";
			courseDetails += "<dd>" + $course[0].prof_names + "</dd>";
			courseDetails += "<dt>Γλώσσα</dt>";
			courseDetails += "<dd>" + $course[0].lang + "</dd>";
			courseDetails += "<dt>Λέξεις Κλειδιά</dt>";
			courseDetails += "<dd>" + $course[0].keywords + "</dd>";
			courseDetails += "<dt>Κωδικός Μαθήματος</dt>";
			courseDetails += "<dd>" + $course[0].code + "</dd>";
			courseDetails += "</dl>";
			courseDetails += '<div id="lesson-buttons" data-role="controlgroup" data-type="horizontal">'
								+'<a  id="ann-'+ $course[0].id+'"  href="" data-role="button">Ανακοινώσεις</a>'
								+'<a  id="doc-'+ $course[0].id+'"  href="" data-role="button">Αρχεία</a>'
								+'<a  id="for-'+ $course[0].id+'"  href="" data-role="button">Forum</a>'
								+'</div>';
			$("#page-content").html(courseDetails).trigger("create");
			$("#leftpanel1").panel( "close" );
		}
	});
	
	$("#page-content").on("click", "a", function() {
	        if( $(this).attr("id").substring(0,4)=="ann-"){	
				var clickedbutton = $(this).attr("id").substring(4);
				subject.getAnnouncements(clickedbutton);
			}	
			else if( $(this).attr("id").substring(0,4)=="doc-"){
				var clickedbutton = $(this).attr("id").substring(4);
				subject.getDocuments(clickedbutton);
				//alert("αρχεία");
			}
			else{
				var clickedbutton = $(this).attr("id").substring(4);
				//subject.getForum(clickedbutton);
				alert("forum");
			}
		
		
	});

	$("#popupLogin #submit").click(function(event) {
		subject._ilv__user = $("#popupLogin #uname").val();
		subject._ilv__passwd = $("#popupLogin #pass").val();
		subject._ilv__wsite = $("#popupLogin #url").val();
		event.preventDefault();
		// Prevent the form submission
		localStorage.uname = subject._ilv__user;
		//Save the username to localStorage
		localStorage.pass = subject._ilv__passwd;
		//Save the password to localStorage
		subject.login();
		$.mobile.loading('hide');
		//Hide the jQuery mobile loader that automatically appears
         	$("#popupLogin").popup("close");
	});

};

ilv__Connect.prototype.ilv__getStatecallback = function(data) {

	this.ilv__access_token = data.access_token;
	this.ilv__status = data.status;
	//alert(this.ilv__status);
};

ilv__Connect.prototype.login = function() {
	var subject = this;
	var postdata = {
		"uname" : this._ilv__user,
		"pass" : this._ilv__passwd
	};
	$.ajax({
		url : this._ilv__login,
		type : "POST",
		crossDomain : true,
		data : JSON.stringify(postdata),
		contentType : "application/json; charset=utf-8",
		dataType : "json",
		success : function(result) {
			//alert(JSON.stringify(result));
			subject._ilv__token = result.access_token;
			//subject.getCourses();
		},
		error : function(xhr, status, error) {
			//alert(status);
		}
	});
};

ilv__Connect.prototype.getCourses = function() {
	var subject = this;
	//alert(this._token);
	var postdata = {
		"access_token" : this._ilv__token
	};
	$.ajax({
		url : this._ilv__courses,
		type : "GET",
		crossDomain : true,
		data : postdata,
		contentType : "application/json; charset=utf-8",
		dataType : "json",
		success : function(result) {
			subject._ilv__courselist = result;
			var coursesList = '<ul data-role="listview">';

			/*<li><a href="acura.html">Acura</a></li>
			 <li><a href="audi.html">Audi</a></li>
			 <li><a href="bmw.html">BMW</a></li>*/

			$.each(result, function(i, k) {
				coursesList += '<li>' + '<a id="course-' + k.code + '">' + k.title + '</a>' + '</li>';
			});
			coursesList += '</ul>';
			//$("#courseList").html(coursesList);
			$("#courses-list").html(coursesList);
			$("#courses-list ul").listview();
			//alert(result[0].title);
			//var _token=result.access_token;
		},
		error : function(xhr, status, error) {
			alert("Could not get courses");
		}
	});
};

/*
ilv__Connect.prototype.checkConnect = function() {
	var url = "http://snf-538265.vm.okeanos.grnet.gr/modules/rest/courses"
	$.ajax({
		url : url,
		crossDomain : true,
		type : 'GET',
		timeout : 5000,
		contentType : "application/json;charset=utf-8",
		success : function(data) {
			//alert("ok");
		},
		error : function(request) {
			// alert(request.responseText);
			// alert(request.status);
			if (request.status == 0) {
				//alert("papala");
			}

		}
	});
};
*/

ilv__Connect.prototype.getAnnouncements = function(course) {
	var subject = this;
	if (course === null) {
		var annUrl = subject._ilv__wsite + "/modules/rest/courses/announcements";
	} else {
		var annUrl = subject._ilv__wsite + "/modules/rest/courses/" + course + "/announcements";
	}
	//alert(this._token);
	var postdata = {
		"access_token" : subject._ilv__token
	};
	$.ajax({
		url : annUrl,
		type : "GET",
		crossDomain : true,
		data : postdata,
		contentType : "application/json; charset=utf-8",
		dataType : "json",
		success : function(result) {
			announcementList = '<div id="announcements">';
			$.each(result, function(i, k) {
				console.log(k);
				if (k.visible == null) {
					k.visible = 0;
				}
				
				datatheme = "b";
				if (k.visible ==1) {
					datatheme = "a";
				}
				
				
				if (course === null) {
					announcementList += '<div class="announcement-item" id="announcement-'+ k.id  + '" data-role="collapsible" data-theme="'+ datatheme +'" data-content-theme="a"><h4>' + k.title +'</h4><dt>Μάθημα</dt><dd>' +k.courseTitle+'</dd><dt>Ημερομηνία</dt><dd>' + k.date + '</dd><dt>Περιεχόμενο</dt><dd>' + k.content + '</dd></div>';
				} else {
					announcementList += '<div class="announcement-item" id="announcement-'+ k.id  + '" data-role="collapsible" data-theme="'+ datatheme +'" data-content-theme="a"><h4>' + k.title +'</h4><dt>Μάθημα</dt><dd>' +subject._ilv__enrolledcourse+'</dd><dt>Ημερομηνία</dt><dd>' + k.date + '</dd><dt>Περιεχόμενο</dt><dd>' + k.content + '</dd></div>';
		
				}
					});
			announcementList += "</div>";
			$("#page-content").html(announcementList).trigger("create");
			$("#page-content .announcement-item").collapsible({
				   expand: function(event, ui) {
				   	var clickedAnnouncement = $(this).attr("id").substring(13);
				   	//alert(clickedCourse);
				   	subject.sendAnnouncementRead(clickedAnnouncement);
				   	console.log(this);
				   	$(this).addClass("announcement-read");
				   }
				});
				
		},
		error : function(xhr, status, error) {
			alert("Could not get announcements");
		}
	});
};

ilv__Connect.prototype.sendAnnouncementRead = function(annID) {
	var subject = this;
	var annUrl = subject._ilv__wsite + "/modules/rest/courses/announcements/" + annID + "/read?access_token="+ subject._ilv__token;
	//alert (annUrl);
	var postdata = {
		//"access_token" : subject._ilv__token
	};
	$.ajax({
		url : annUrl,
		type : "POST",
		crossDomain : true,
		contentType : "application/json; charset=utf-8",
		dataType : "json",
		success : function(result) {

		},
		error : function(xhr, status, error) {
			alert("Could not mark announcement as read");
		}
	});
};

ilv__Connect.prototype.getDocuments = function(course) {
	var subject = this;
	var annUrl = subject._ilv__wsite + "/modules/rest/courses/" + course + "/documents";
	
	//alert(this._token);
	var postdata = {
		"access_token" : subject._ilv__token
	};
	$.ajax({
		url : annUrl,
		type : "GET",
		crossDomain : true,
		data : postdata,
		contentType : "application/json; charset=utf-8",
		dataType : "json",
		success : function(result) {
			documentList = '<div id="announcements">';
			$.each(result, function(i, k) {
				if (k.title) {
					documentList += '<div id="'+ k.id  + '" data-role="collapsible" data-theme="b" data-content-theme="a"><h4>' + k.title +'</h4><dt>Αρχείο</dt><dd>' +k.filename+'</dd><dt>Ημερομηνία</dt><dd>' + k.date + '</dd><dt>Δημιουργός</dt><dd>' + k.creator + '</dd><dt>Σχόλια</dt><dd>' + k.comment + '</dd><dt>Μεταφόρτωση</dt><dd><a href="#"  onclick="window.open(\'https://docs.google.com/viewer?url='+ subject._ilv__wsite+ '/' + k.path +'&embedded=true\', \'_blank\', \'location=yes\');">'+ k.path +'</a></dd></div>';
				}
					});
			documentList += "</div>";
			$("#page-content").html(documentList).trigger("create");
				
		},
		error : function(xhr, status, error) {
			alert("Could not get announcements");
		}
	});
};
