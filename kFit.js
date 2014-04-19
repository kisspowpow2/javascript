/**
 * version 1.1.1
 * 
 * date 2013.5.6
 * 
 * @author kisspowpow
 */

function kFit () { };
kFit.browser;
kFit.timer = 0;
kFit.target;
kFit.minWidth;
kFit.minHeight;
kFit.nowWidth;
kFit.nowHeight;

kFit.init = function (target, minWidth, minHeight) {
	kFit.target = target;
	kFit.minWidth = minWidth;
	kFit.minHeight = minHeight;
	kFit.start();
	$(function () { kFit.detectScreen(); });
}

kFit.start = function() {
	if (typeof kFit.target == "undefined") return;
	if (typeof kFit.minWidth == "undefined") return;
	if (typeof kFit.minHeight == "undefined") return;
	kFit.detectBrowser();
	clearInterval(kFit.timer);
	kFit.timer = setInterval(kFit.detectScreen, 200);
	$(window).resize(kFit.detectScreen);
}

kFit.stop = function() {
	clearInterval(kFit.timer);
}

kFit.detectBrowser = function() {
	var ua = navigator.userAgent;
	if (ua.match(/MSIE 7/i)) kFit.browser = "ie7";
	else if (ua.match(/MSIE 8/i)) kFit.browser = "ie8";
	else if (ua.match(/MSIE 9/i)) kFit.browser = "ie9";
	else if (ua.match(/MSIE 10/i)) kFit.browser = "ie10";
	else if (ua.match(/rv:11\.0/i)) kFit.browser = "ie11";
	else if (ua.match(/Firefox/i)) kFit.browser = "ff";
	else if (ua.match(/Chrome/i)) kFit.browser = "chrome";
}

kFit.detectScreen = function() {
	if (typeof $ == "undefined") return;
	
	if ($(window).width() < kFit.minWidth) {
		kFit.nowWidth = kFit.minWidth;
	} else {
		kFit.nowWidth = "100%";
	}
	
	if ($(window).height() < kFit.minHeight) {
		kFit.nowHeight = kFit.minHeight;
	} else {
		kFit.detectHeight();
	}
	
	kFit.detectOverflow();
}

kFit.detectHeight = function() {
	if (kFit.browser == "ff") {
		kFit.nowHeight = $(window).height() - 4;
	} else {
		kFit.nowHeight = "100%";
	}
}

kFit.detectOverflow = function() {
	$(kFit.target).css("width", kFit.nowWidth);
	$(kFit.target).css("height", kFit.nowHeight);
	
	if (kFit.browser == "ff") return; //avoid ff reload flash;
	if (kFit.nowWidth == "100%" && kFit.nowHeight == "100%") {
		$("html").css("overflow", "hidden");
		$(kFit.target).css("overflow", "hidden");
		
		if (kFit.browser == "ie7") {
			$("html").css("overflow", "hidden");
		}
		else if (kFit.browser == "ie8") {
			$(kFit.target).css('height', $(window).height());
		}
		else if (kFit.browser == "ie9") {
			$(kFit.target).css('height', $(window).height());
		}
		else if (kFit.browser == "ie10") { 
			$(kFit.target).css('height', $(window).height());
		}
		else if (kFit.browser == "ie11") { 
			$(kFit.target).css('height', $(window).height());
		}
	}
	else 
	{
		$("html").css("overflow", "");
		$(kFit.target).css("overflow", "visible");
	}
}