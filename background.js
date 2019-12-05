/*
 *
 *	Extension which detects XSS - whole script injection.
 *
 *	Author	: Ravi, Arun Babu
 *	Date 	: 08/29/2016
 *
 *	
 */

function notifyUser() {
	chrome.notifications.create("warn",{
		type:"basic",
		iconUrl:"icon.png",
		title:"Request blocked!",
		message:"A web request was blocked due to XSS related content!"
	},function(id){/*just an empty callback function*/});
}

chrome.webRequest.onBeforeRequest.addListener(function (details) {
	 //console.log(details.url); //comment it

	var params = [];

	//var script_start_re = /.*<(\s|\+)*script((\s|\+)?>)|((\s|\+)[^>]*>)/mi; //multiline case insensitive
	//var script_end_re = /<(\s|\+)*\/(\s|\+)*script((\s|\+)?>)|((\s|\+)[^>]*>)/mi;
	var script_start_re = /.*<(\s|\+)*script(((\s|\+)?>)|((\s|\+)[^>]*>))(.*?)<(\s|\+)*\/(\s|\+)*script\s*>/mi; //multiline case insensitive

	if(details.method == "POST") {
		// console.log("POST");
		if("requestBody" in details && "formData" in details.requestBody){
			// console.log(details.requestBody.formData);
			params = details.requestBody.formData;
		}
	} else if(details.method == "GET") {
		// console.log("GET");
		if("url" in details){
			var g = details.url.split('?');
			if(g.length > 1) {
				var p = g[1].split('&');
				for (var i = p.length - 1; i >= 0; i--) {
					var pair = p[i].split('=');
					if(pair.length > 1)
						params[pair[0]] = {0:pair[1]};
					else params[pair[0]] = {0:""};
				}
			}
		}
	}

	for(var i in params) {
		// console.log(params[i][0]);
		var val = params[i][0];		
		var decoded_value = decodeURIComponent(val);
		console.log(decoded_value);

		if(script_start_re.test(decoded_value)) {
				console.log('found script!');

				var blockingResponse = {cancel: true }; //cancel the request
				notifyUser();
				return blockingResponse;
		}
	};
}, 
{urls: ["<all_urls>"]}, ["blocking","requestBody"]);
