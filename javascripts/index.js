$(document).ready(function() {
	
$("pre.htmlCode").snippet("html",{style:"whitengrey"});
$("pre.styles").snippet("css",{style:"whitengrey"});
$("pre.js").snippet("javascript",{style:"rand01"});


	var file = $("#myfile");

	
	file.viewimg({
		targetDiv : $("#localImag"),
		sizingMethod : "scale",
		errorDiv : $("#error")
	});

    $("#try").click(function(){
        file.change();
    });
	
	$("#sendMe").click(function(){
		
		var userEmail = $.trim($("[name='userEmail']").val());
		var userContent = $.trim($("[name='userContent']").val());
		
		if(userEmail == "" || userContent ==""){
			return;
		}
		
		// send;
		$.post("/feed/addFeedBack.x",{userEmail:userEmail,userContent:userContent},function(data){
				if(data == "1"){
					alert("发送成功!");
				}
				else if(data == "2"){
					alert("邮箱和反馈内容 俩个都要填啊!");
				}
				else if(data == "-1"){
					alert("服务器出了点问题,请换个时间在试一试");
				}
				else if(data == "3"){
					alert("邮件没有发到sherlock手里! 请再试一试")
				}
		});
	});
	

});