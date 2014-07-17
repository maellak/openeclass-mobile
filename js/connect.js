
function ilv__Connect () {
  var ilv__wsite = "http://snf-538265.vm.okeanos.grnet.gr";  // afisse to stin grammi 10
  this._ilv__login = ilv__wsite+"/modules/rest/login";	
  this._ilv__courses = ilv__wsite+"/modules/rest/courses";

  
  if (!(localStorage.getItem("uname") === null)) { //Check if there is already a username saved in localStorage.uname
  	$("#loginForm #uname").val(localStorage.uname);//Fill in the #uname input field with the localStorage value
  }
    
  if (!(localStorage.getItem("pass") === null)) { //Check if there is already a username saved in localStorage.pass
  	$("#loginForm #pass").val(localStorage.pass); //Fill in the #pass input field with the localStorage value

  }
  
  var subject = this;
  $("#loginForm #submit").click(function(event) {
  	subject._ilv__user = $("#loginForm #uname").val();
    subject._ilv__passwd = $("#loginForm #pass").val();
  	event.preventDefault(); // Prevent the form submission
  	localStorage.uname = subject._ilv__user; //Save the username to localStorage
    localStorage.pass = subject._ilv__passwd;   //Save the password to localStorage
    subject.login();
    $.mobile.loading('hide'); //Hide the jQuery mobile loader that automatically appears
  });

};


ilv__Connect.prototype.ilv__getStatecallback = function(data) {  
   
   	this.ilv__access_token = data.access_token;
   	this.ilv__status = data.status;
//alert(this.ilv__status);
};

 ilv__Connect.prototype.login = function() {  
   var subject = this;
var postdata = 
		{ "uname": this._ilv__user ,
               	"pass": this._ilv__passwd }
               ;
 $.ajax({
        url: this._ilv__login,
        type: "POST",
        crossDomain: true,
   	data: JSON.stringify(postdata) ,
    	contentType: "application/json; charset=utf-8",
        dataType: "json",
        success:function(result){
            //alert(JSON.stringify(result));
            subject._token=result.access_token;
	    subject.getCourses();
        },
        error:function(xhr,status,error){
            //alert(status);
        }
    });
	}; 


 ilv__Connect.prototype.getCourses = function() {  
   var subject = this;
alert(this._token);
var postdata = 
		{ "access_token": this._token } ;
 $.ajax({
        url: this._ilv__courses,
        type: "GET",
        crossDomain: true,
   	data: postdata,
    	contentType: "application/json; charset=utf-8",
        dataType: "json",
        success:function(result){
            //alert(result[0].title);
            //var _token=result.access_token;
        },
        error:function(xhr,status,error){
            alert(status);
        }
    });
};

ilv__Connect.prototype.checkConnect = function() {
   var subject = this;
   //periptossi 1
   $.ajaxSetup({
       timeout: 1, // Microseconds, for the laughs.  Guaranteed timeout.
       error: function(request, status, maybe_an_exception_object) {
       if(status == 'timeout')
               alert("Internet connection is down!");
       }
       });


//periptossi 2
/*
   online = window.navigator.onLine;
   if (navigator.onLine) {
      alert('you are online');
   } else {
      alert('you are offline');
   }
*/
};