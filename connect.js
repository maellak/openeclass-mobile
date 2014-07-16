function ilv__Connect () {
    var ilv__wsite = "http://snf-538265.vm.okeanos.grnet.gr";  // afisse to stin grammi 10
    this._ilv__login = ilv__wsite+"/modules/rest/login";
    this._ilv__courses = ilv__wsite+"/modules/rest/courses";
    this._ilv__user = "admin";
    this._ilv__passwd = "apostolos";
}


ilv__Connect.prototype.ilv__getStatecallback = function(data) {
    this.ilv__access_token = data.access_token;
    this.ilv__status = data.status;
    //alert(this.ilv__status);
}

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
            alert(JSON.stringify(result));
            subject._token=result.access_token;
            subject.getCourses();
        },
        error:function(xhr,status,error){
            alert(status);
        }
    });
}


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
            alert(result[0].title);
            //var _token=result.access_token;
        },
        error:function(xhr,status,error){
            alert(status);
        }
    });
}
