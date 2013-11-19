$(document).ready(function() {
	$('pre code').each(function(i, e) {
		hljs.highlightBlock(e)
	});

	var file = $("#myfile");

	
	file.viewimg({
		targetDiv : $("#localImag"),
		sizingMethod : "scale",
		errorDiv : $("#error")
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