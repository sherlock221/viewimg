$(document).ready(function() {
	

$("pre.htmlCode").snippet("html",{style:"whitengrey"});
    // Finds <pre> elements with the class "htmlCode"
    // and snippet highlights the HTML code within.
$("pre.styles").snippet("css",{style:"whitengrey"});
    // Finds <pre> elements with the class "styles"
    // and snippet highlights the CSS code within
    // using the "greenlcd" styling.
$("pre.js").snippet("javascript",{style:"rand01"});
    // Finds <pre> elements with the class "js"
    // and snippet highlights the JAVASCRIPT code within
    // using a random style from the selection of 39
    // with a transparent background



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