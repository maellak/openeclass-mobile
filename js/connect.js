function ilv__Connect() {
	this._ilv__wsite = "http://snf-538265.vm.okeanos.grnet.gr";
	// afisse to stin grammi 10
	this._ilv__login = this._ilv__wsite + "/modules/rest/login";
	this._ilv__courses = this._ilv__wsite + "/modules/rest/courses";
	this._ilv__courselist = "";
	this._ilv_action = "";
	this._ilv__token ="";

	if (!(localStorage.getItem("uname") === null)) {//Check if there is already a username saved in localStorage.uname
		$("#loginForm #uname").val(localStorage.uname);
		//Fill in the #uname input field with the localStorage value
	}

	if (!(localStorage.getItem("pass") === null)) {//Check if there is already a username saved in localStorage.pass
		$("#loginForm #pass").val(localStorage.pass);
		//Fill in the #pass input field with the localStorage value
	}

	var subject = this;
	$("#courses-btn").click(function() {
		subject._ilv_action = "courses";
	});

	$("#announcements-btn").click(function() {
		subject._ilv_action = "announcements";
		var announcements = subject.getAnnouncements(null);
		console.log(announcements);
	});

	$("#forum-btn").click(function() {
		subject._ilv_action = "forums";
	});


	$("#courses-list").on("click", "a", function() {
		var clickedCourse = $(this).attr("id").substring(7);
		//console.log(clickedCourse);
		if (subject._ilv_action == "courses") {
			$course = $.grep(subject._ilv__courselist, function(obj) {
			    return obj.code === clickedCourse;
			});
			console.log($course);
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
			$("#page-content").html(courseDetails);
			$("#leftpanel1").panel( "close" );
		}
	});

	$("#loginForm #submit").click(function(event) {
		subject._ilv__user = $("#loginForm #uname").val();
		subject._ilv__passwd = $("#loginForm #pass").val();
		event.preventDefault();
		// Prevent the form submission
		localStorage.uname = subject._ilv__user;
		//Save the username to localStorage
		localStorage.pass = subject._ilv__passwd;
		//Save the password to localStorage
		subject.login();
		$.mobile.loading('hide');
		//Hide the jQuery mobile loader that automatically appears
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
			return result;
		},
		error : function(xhr, status, error) {
			alert("Could not get announcements");
		}
	});
}; 