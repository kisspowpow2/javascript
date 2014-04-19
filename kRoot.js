/**
 * version 1.4.5
 *
 * date 2014.1.28
 *
 * @author kisspowpow
 */

var Root = {};
//Device const
Root.IPHONE = "iPhone";
Root.IPAD = "iPad";
Root.ANDROID = "Android";
Root.ANDROIDTABLET = "AndroidTablet";
Root.WINDOWSPHONE = "WindowsPhone";
Root.PC = "PC";
//Browser const
Root.IE6 = "IE6";
Root.IE7 = "IE7";
Root.IE8 = "IE8";
Root.IE9 = "IE9";
Root.IE10 = "IE10";
Root.IE11 = "IE11";
Root.CHROME = "Chrome";
Root.FIREFOX = "FF";
Root.SAFARI = "Safari";
Root.OPERA = "Opera";
//System const
Root.MICROSOFT = "microsoft";
Root.APPLE = "apple";
Root.GOOGLE = "google";
//User info
Root.browser = "";
Root.device = "";
Root.mobile = false;
Root.system = "";
Root.target = window;
Root.pointer = false;

Root.detectBrowser = function () {
	var userAgent = navigator.userAgent;
	if (/iPhone/i.test(userAgent)) {
		Root.browser = Root.SAFARI;
		Root.device = Root.IPHONE;
		Root.system = Root.APPLE;
		Root.mobile = true;
	}
	else if (/iPad/i.test(userAgent)) {
		Root.browser = Root.SAFARI;
		Root.device = Root.IPAD;
		Root.system = Root.APPLE;
		Root.mobile = true;
	}
	else if (/Android/i.test(userAgent) && /mobile/i.test(userAgent)) {
		Root.browser = Root.CHROME;
		Root.device = Root.ANDROID;
		Root.system = Root.GOOGLE;
		Root.mobile = true;
	}
	else if (/Android/i.test(userAgent)) {
		Root.browser = Root.CHROME;
		Root.device = Root.ANDROIDTABLET;
		Root.system = Root.GOOGLE;
		Root.mobile = true;
	}
	else if (/Windows Phone/i.test(userAgent) && /rv:11/i.test(userAgent)) {
		Root.browser = Root.IE11;
		Root.device = Root.WINDOWSPHONE;
		Root.System = Root.MICROSOFT;
		Root.mobile = true;
	}
	else if (/Windows Phone/i.test(userAgent) && /MSIE 10/i.test(userAgent)) {
		Root.browser = Root.IE10;
		Root.device = Root.WINDOWSPHONE;
		Root.System = Root.MICROSOFT;
		Root.mobile = true;
	}
	else if (/Windows Phone/i.test(userAgent) && /MSIE 9/i.test(userAgent)) {
		Root.browser = Root.IE9;
		Root.device = Root.WINDOWSPHONE;
		Root.system = Root.MICROSOFT;
		Root.mobile = false;
	}
	else if (/MSIE 6/i.test(userAgent)) {
		Root.browser = Root.IE6;
		Root.device = Root.PC;
		Root.system = Root.MICROSOFT;
		Root.mobile = false;
	}
	else if (/MSIE 7/i.test(userAgent)) {
		Root.browser = Root.IE7;
		Root.device = Root.PC;
		Root.system = Root.MICROSOFT;
		Root.mobile = false;
	}
	else if (/MSIE 8/i.test(userAgent)) {
		Root.browser = Root.IE8;
		Root.device = Root.PC;
		Root.system = Root.MICROSOFT;
		Root.mobile = false;
	}
	else if (/MSIE 9/i.test(userAgent)) {
		Root.browser = Root.IE9;
		Root.device = Root.PC;
		Root.system = Root.MICROSOFT;
		Root.mobile = false;
	}
	else if (/MSIE 10/i.test(userAgent)) {
		Root.browser = Root.IE10;
		Root.device = Root.PC;
		Root.system = Root.MICROSOFT;
		Root.mobile = false;
	}
	else if (/rv:11/i.test(userAgent)) {
		Root.browser = Root.IE11;
		Root.device = Root.PC;
		Root.system = Root.MICROSOFT;
		Root.mobile = false;
	}
	else if (/Firefox/i.test(userAgent)) {
		Root.browser = Root.FIREFOX;
		Root.device = Root.PC;
		Root.system = Root.PC;
		Root.mobile = false;
	}
	else if (/Chrome/i.test(userAgent)) {
		Root.browser = Root.CHROME;
		Root.device = Root.PC;
		Root.system = Root.MICROSOFT;
		Root.mobile = false;
	}

	if (Root.browser == Root.IE10 && userAgent.match(/Touch/i)) {
		Root.pointer = true;
	}
	if (Root.browser == Root.IE11 && userAgent.match(/Touch/i)) {
		Root.pointer = true;
	}
}


// -----------------------------------------------------------------------------------------------------------
Root.cookieData = {};
Root.setCookie = function (name, value, minutes) {
	if (minutes) {
		var date = new Date();
		date.setTime(date.getTime() + (minutes * 60 * 1000));
		var expires = "";
		expires = "" + date.toGMTString();
	} else {
		var expires = "";
	}
	document.cookie = name + "=" + encodeURIComponent(value) + "; expires=" + expires;
}

Root.getCookie = function (name) {
	var cookie = document.cookie;
	var pairs = cookie.split(";");
	var cookieData = {};
	for (var i = 0; i < pairs.length; i++) {
		var group = pairs[i].split("=");
		var attr = group[0].replace(/^[\s]*|[\s]*$/g, "");
		var value = group[1];
		cookieData[attr] = value;
	}
	Root.cookieData = cookieData;
	return decodeURIComponent(cookieData[name]);
}

Root.deleteCookie = function (name) {
	Root.setCookie(name, "", -60 * 24);
}



// --------------------------------------------------------------------------------
Root.titleCase = function (string) {
	return string.replace(/\w\S*/g, function (input) { return input.charAt(0).toUpperCase() + input.substr(1).toLowerCase(); });
}


Root.getParams = function () {
	var data = {};
	var url = location.search;
	var paramString = url;
	var paramArray = paramString.split("&");
	var total = paramArray.length;

	for (var i = 0; i < total; i++) {
		var pair = paramArray[i];
		var key = requestGet.getName(pair);
		var value = requestGet.getValue(pair);
		data[key] = value;
	}

	return data;
}

Root.getKey = function (string) {
	var key = string.match(/^[^=]+/i)[0];
	return key;
}

Root.getValue = function (string) {
	var value = string.match(/[^=]+$/i)[0];
	return value;
}