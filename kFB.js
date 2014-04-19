/**
 * version 1.3.7
 * 
 * date 2013.12.16
 * 
 * @author kisspowpow
 */

//facebook 相關應用程式



var kFB = {};
kFB.appID = "174550779285310";
kFB.appID_local = "217921701660931";
kFB.online = false;
kFB.scope = "email, user_likes, user_photos, publish_actions"; //https://developers.facebook.com/docs/reference/login
kFB.accessToken = "";
kFB.userID = "";
kFB.userName = "";
kFB.gender = "";
kFB.email = "";

kFB.initFB = function () {
	var channelURL = location.href.match(/^.*\/\/.*\//) + "channel.htm";
	var appID = kFB.online ? kFB.appID : kFB.appID_local;

	FB.init({ appId: appID, status: true, cookie: true, xfbml: true, channelUrl: channelURL, oauth: true });
	//FB.XFBML.parse();
};

// only login
kFB.login = function (callback, data) {
	if (typeof callback != "function") {
		console.log("error: callback is not function");
		return;
	}

	FB.login(function (response) {
		if (response.authResponse) {
			kFB.accessToken = response.authResponse.accessToken;
			kFB.userID = response.authResponse.userID;
			callback(response.authResponse);
		} else {
			callback(0);
		}
	}, { scope: kFB.scope, display: "popup" });
};

// only check login status 
kFB.checkLoginStatus = function (callback, data) {
	if (typeof callback != "function") {
		console.log("error: callback is not function");
		return;
	}

	FB.getLoginStatus(function(response) {
		if (response.authResponse != null) {
			callback(response.authResponse);
		} else {
			callback(0);
		}
	});
};

// check login status
kFB.getLoginStatus = function (method, callback, data) {
	if (typeof callback != "function") {
		console.log("error: callback is not function");
		return;
	}
	if (typeof data != "undefined" && data.action == "login") {
		kFB.loginFB(method, callback, data);
		return;
	}
	FB.getLoginStatus(function (response) {
		if (response.authResponse != null) {
			kFB.accessToken = response.authResponse.accessToken;
			if (typeof method == "function") method(callback, data);
		} else {
			kFB.loginFB(method, callback, data);
		}
	});
};

// login facebook
kFB.loginFB = function (method, callback, data) {
	if (typeof callback != "function") {
		console.log("error: callback is not function");
		return;
	}
	FB.login(function (response) {
		if (response.authResponse) {
			kFB.accessToken = response.authResponse.accessToken;
			if (typeof method == "function") method(callback, data);
		} else {
			callback(0);
		}
	}, { scope: kFB.scope, display: "popup" });
};

// link and login facebook
kFB.linkLoginFB = function (type) {
	var display = "page"; //async, iframe, page, popup, touch, wap
	if (type && type.match(/^async$|^iframe$|^page$|^popup$|^touch$|^wap$/i)) display = type;
	var website = location.href;
	//var website = location.href.replace(location.hash, "").replace(location.search, "");
	var scope = kFB.scope.replace(/\s/g, "");
	var appID = kFB.online ? kFB.appID : kFB.appID_local;
	var url = "https://www.facebook.com/dialog/oauth?client_id=" + appID;
	url += "&redirect_uri=" + website;
	url += "&scope=" + scope;
	url += "&response_type=" + "token"; //code
	url += "&display=" + display;
	window.location.href = url;
};


// get user profile
kFB.getUser = function () {
	var user = {};
	user.accessToken = kFB.accessToken;
	user.userID = kFB.userID;
	user.userName = kFB.userName;
	user.gender = kFB.gender;
	user.email = kFB.email;
	return user;
}
kFB.getProfile = function (callback, data) {
	if (typeof callback != "function") {
		console.log("error: callback is not function");
		return;
	}
	if (kFB.userID != "" && kFB.userName != "") {
		var user = kFB.getUser();
		callback(user);
		return;
	}
	kFB.getLoginStatus(kFB.getProfileCB, callback, data);
};
kFB.getProfileCB = function (callback, data) {
	if (typeof callback != "function") {
		console.log("error: callback is not function");
		return;
	}
	FB.api("/me", "GET", {}, function (response) {
		kFB.userID = response.id;
		kFB.userName = response.name;
		kFB.gender = response.gender;
		kFB.email = response.email;
		var user = kFB.getUser();
		callback(user);
	});
};

// get user photo
kFB.getPhoto = function (callback, data) {
	kFB.getLoginStatus(kFB.getPhotoCB, callback, data);
};
kFB.getPhotoCB = function (callback, data) {
	if (typeof callback != "function") {
		console.log("error: callback is not function");
		return;
	}
	if (!data) data = { type: "square" };
	else if (!data.type) data.type = "square";
	else if (!data.type.match(/^large$|^normal$|^small$|^square$/i)) data.type = "square";
	FB.api("/me/picture", "GET", data, function (response) {
		var url = response.data.url;
		callback(url);
	});
};

// get user cover photo
kFB.getCoverPhoto = function (callback, data) {
	kFB.getLoginStatus(kFB.getCoverPhotoCB, callback, data);
}
kFB.getCoverPhotoCB = function (callback, data) {
	if (typeof callback != "function") {
		console.log("error: callback is not function");
		return;
	}
	FB.api("/me", "GET", { fields: "cover" }, function (response) {
		//console.log(response.cover) //response.cover = { id, source, offset_y } 
		var url = response.cover.source;
		callback(url);
	});
}

// post by background
kFB.postByBackground = function (callback, data) {
	kFB.getLoginStatus(kFB.postByBackgroundCB, callback, data);
};
kFB.postByBackgroundCB = function (callback, data) {
	if (typeof callback != "function") {
		console.log("error: callback is not function");
		return;
	}
	if (!data) {
		console.log("error: data is missing");
		return;
	}

	var appID = kFB.online ? kFB.appID : kFB.appID_local;
	var params = {
		name: data.name,
		message : data.message,
		caption : data.caption,
		description: data.description,
		link : data.link,
		picture: data.picture,
		//type: "swf",
		//source: "https://18design.com/pv3d/fb/wcar.swf",
		//actions: [{ name: '立即玩', link: 'https://apps.facebook.com/metrocard/' }],
		application: appID
	};
	FB.api("/me/feed", "POST", params, function (response) {
		if (!response) return;
		if (response.error) {
			if (typeof callback == "function") callback(-1);
			//console.log(response.error.message);
		} else {
			if (typeof callback == "function") {
				//callback(1);
				callback(response.id);
			}
		}
	});
};


//---------------------------------- ui start ----------------------------------
// use ui stream publish
kFB.postByWindow = function (callback, data) {
	kFB.getLoginStatus(kFB.postByWindowCB, callback, data);
};
kFB.postByWindowCB = function (callback, data) {
	if (typeof callback != "function") {
		console.log("error: callback is not function");
		return;
	}
	if (!data) {
		console.log("error: data is missing");
		return;
	}
	var params = {
		display: "popup", //"popup", "dialog", "iframe", "touch", "async", "hidden", or "none"
		method: "feed",
		name: data.name,
		caption: data.caption,
		description: data.description,
		picture: data.picture,
		link: data.link
	};
	FB.ui(params, function(response) {
		if (response && response.post_id) {
			if (typeof callback == "function") callback(response.post_id);
		} else {
			if (typeof callback == "function") callback(-1);
		}
	});
};

// send request (must in canvas)  // fql: https://developers.facebook.com/docs/reference/fql/apprequest/
// kFB.sendRequest(function(r) { console.log(r) }, { list: ["848609403"]});
kFB.sendRequest = function (callback, data) {
	kFB.getLoginStatus(kFB.sendRequestCB, callback, data);
};
kFB.sendRequestCB = function (callback, data) {
	if (typeof callback != "function") {
		console.log("error: callback is not function");
		return;
	}
	if (!data) {
		console.log("error: data is missing");
		return;
	}
	if (typeof data.list != "object") {
		console.log("error: data list must be array");
		return;
	}
	
	var params = {};
	params.method = "apprequests";
	params.message = data.message;
	params.display = "dialog"; //"popup", "dialog", "iframe", "touch", "async", "hidden", or "none";
	params.to = data.list.join(",");
	
	FB.ui(params, function (response) {
		callback(response);
	});
}

// send request group (must in canvas)
kFB.sendRequestGroup = function (callback, data) {
	kFB.getLoginStatus(kFB.sendRequestGroupCB, callback, data);
};
kFB.sendRequestGroupCB = function (callback, data) {
	if (typeof callback != "function") {
		console.log("error: callback is not function");
		return;
	}
	if (!data) {
		console.log("error: data is missing");
		return;
	}
	
	var params = {};
	params.method = "apprequests";
	params.title = data.title;
	params.message = data.message;
	params.max_recipients = data.limit;
	params.display = "dialog"; //"popup", "dialog", "iframe", "touch", "async", "hidden", or "none"
	
	FB.ui(params, function (response) {
		callback(response);
	});
}

// send a message to friend
kFB.sendMessage = function(callback, data) {
	kFB.getLoginStatus(kFB.sendMessageCB, callback, data);
};
kFB.sendMessageCB = function(callback, data) {
	if (typeof callback != "function") {
		console.log("error: callback is not function");
		return;
	}
	if (!data) {
		console.log("error: data is missing");
		return;
	}
	var params = {
		method: "send", 
		name: data.name,
		display: "popup",  //"popup", "dialog", "iframe", "touch", "async", "hidden", or "none"
		to: data.id,
		link: data.link,
		picture: data.picture, 
		description: data.description 
	};
	FB.ui(params, function(response) {
		callback(response); // null or []
	});
};
//---------------------------------- ui end ----------------------------------

// get friends
kFB.getFriends = function (callback, data) {
	kFB.getLoginStatus(kFB.getFriendsCB, callback, data);
};
kFB.getFriendsCB = function (callback, data) {
	if (typeof callback != "function") {
		console.log("error: callback is not function");
		return;
	}
	FB.api("/me/friends", "GET", { fields: "name, id, picture" }, function (response) {
		var friendsData = response.data;
		/*for (var i = 0; i < friendData.length; i++) {
			var obj = friendData[i];
			console.log(obj.name, obj.id, obj.picture.data.url);
		}//*/
		callback(friendsData);
	});
};

// get mutual friends   @data.id
kFB.getMutualFriends = function (callback, data) {
	kFB.getLoginStatus(kFB.getMutualFriendsCB, callback, data);
};
kFB.getMutualFriendsCB = function (callback, data) {
	if (typeof callback != "function") {
		console.log("error: callback is not function");
		return;
	}
	if (!data || !data.id) {
		console.log("error: data is missing");
		return;
	}
	FB.api("/me/mutualfriends/" + data.id, "GET", { fields: "name, id, picture" }, function (response) {
		// [ { id, name, picture.data.url } ]
		callback(response.data);
	});
};


// get user photo  @data.id  @data.type
kFB.getUserPhoto = function (callback, data) {
	kFB.getLoginStatus(kFB.getUserPhotoCB, callback, data);
};
kFB.getUserPhotoCB = function (callback, data) {
	if (typeof callback != "function") {
		console.log("error: callback is not function");
		return;
	}
	if (!data || !data.id) {
		console.log("error: data is missing");
		return;
	}
	else if (!data.type) data.type = "large";
	else if (!data.type.match(/^large$|^normal$|^small$|^square$/i)) data.type = "large";

	FB.api(data.id + "/picture", "GET", { type: data.type }, function (response) {
		callback(response.data.url);
	});
};

// check user like  @data.id
kFB.checkLike = function (callback, data) {
	kFB.getLoginStatus(kFB.checkLikeCB, callback, data);
};
kFB.checkLikeCB = function (callback, data) {
	if (typeof callback != "function") {
		console.log("error: callback is not function");
		return;
	}
	if (!data || !data.id) {
		console.log("error: data is missing");
		return;
	}
	FB.api("me/likes", "GET", { limit: 500 }, function (response) {
		var num = response.data.length;
		for (var i = 0; i < num; i++) {
			if (response.data[i].id == data.id) {
				callback(1);
				return;
			}
		}
		callback(-1);
	});
};

// get user albums
kFB.getAlbums = function(callback, data) {
	kFB.getLoginStatus(kFB.getAlbumsCB, callback, data);
};
kFB.getAlbumsCB = function(callback, data) {
	if (typeof callback != "function") {
		console.log("error: callback is not function");
		return;
	}
	FB.api("me/albums", "GET", { limit: 150, fields: "id, name, cover_photo" }, function (response) {
		// [{ id, name, cover_photo, created_time }...]
		var list = response.data;
		callback(list);
	});
};

// get photos by album id
kFB.getAlbumPhoto = function(callback, data) {
	kFB.getLoginStatus(kFB.getAlbumPhotoCB, callback, data);
};
kFB.getAlbumPhotoCB = function(callback, data) {
	if (typeof callback != "function") {
		console.log("error: callback is not function");
		return;
	}
	if (!data || !data.id) {
		console.log("error: data is missing");
		return;
	}
	FB.api("/" + data.id + "/photos", "GET", { limit: 300, fields: "id, name, picture, source" }, function (response) {
		// [{ id, name, picture, source, created_time }...]
		var list = response.data;
		callback(list);
	});
};

// create album
kFB.createAlbum = function (callback, data) {
	kFB.getLoginStatus(kFB.createAlbumCB, callback, data);
};
kFB.createAlbumCB = function (callback, data) {
	if (typeof callback != "function") {
		console.log("error: callback is not function");
		return;
	}
	if (!data || !data.name) {
		console.log("error: data is missing");
		return;
	}
	FB.api("me/albums", "POST", data, function (response) {
		if (response.error) {
			callback(-1);
		} else {
			callback(response);
		}
	});
};


// upload photo
kFB.uploadPhoto = function (callback, data) {
	kFB.getLoginStatus(kFB.uploadPhotoCB, callback, data);
}
kFB.uploadPhotoCB = function (callback, data) {
	if (typeof callback != "function") {
		console.log("error: callback is not function");
		return;
	}
	if (!data || !data.id || !data.url) {
		console.log("Error: data is missing");
		return;
	}
	if (!data.message) data.message = "";
	FB.api("/" + data.id + "/photos", "POST", { message: data.message, url: data.url }, function (response) {
		// { id: "12345", post_id: "12345" }
		callback(response);
	});
}


// get photo source by photo id
kFB.getPhotoSource = function(callback, data) {
	kFB.getLoginStatus(kFB.getPhotoSourceCB, callback, data);
};
kFB.getPhotoSourceCB = function(callback, data) {
	if (typeof callback != "function") {
		console.log("error: callback is not function");
		return;
	}
	if (!data || !data.id) {
		console.log("error: data is missing");
		return;
	}
	data.fields = "id, name, picture, source";
	FB.api("/" + data.id, "GET", { fields: data.fields }, function (response) {
		// id picture source created_time
		callback(response);  
	});
};


// get feed    @id number skip
kFB.getFeed = function (callback, data) {
	kFB.getLoginStatus(kFB.getFeedCB, callback, data);
};
kFB.getFeedCB = function (callback, data) {
	if (typeof callback != "function") {
		console.log("error: callback is not function");
		return;
	}
	if (!data || !data.id) {
		data = { id: "me", number: 25, skip: 0 };
	}

	FB.api("/" + data.id + "/feed", "GET",  { limit: data.number, offset: data.skip }, function (response) {
		var data = response.data;
		callback(data);
	});
};


// get feed by date  @since until
kFB.getFeedDate = function (callback, data) {
	kFB.getLoginStatus(kFB.getFeedDateCB, callback, data);
}
kFB.getFeedDateCB = function (callback, data) {
	if (typeof callback != "function") {
		console.log("error: callback is not function");
		return;
	}
	if (!data || !data.since || !data.until) {
		console.log("error: data is missing");
		return;
	}
	FB.api("me/feed", "GET", {
		since: data.since, //'2012-03-22',
		until: data.until, //'2012-03-22 23:59:59',
		limit: 100
	}, function (response) {
		callback(response);
	});
}


// checkins    @message  placeID  latitude  longitude
kFB.checkins = function (callback, data) {
	kFB.getLoginStatus(kFB.checkinsCB, callback, data);
};
kFB.checkinsCB = function (callback, data) {
	if (typeof callback != "function") {
		console.log("error: callback is not function");
		return;
	}
	if (!data || !data.message || !data.placeID || !data.latitude || !data.longitude) {
		console.log("error: data is missing");
		return;
	}
	//FB.api("/me/checkins", "post", 
	//	{ message: "oh ya", place : 366738543369062, coordinates: { latitude:25.042949276103,  longitude: 121.50553857879 } }, 
	//		function(r) { getParams(r); getParams(r.error) });
	FB.api("/me/checkins", "POST", {
		message: data.message,
		place: data.placeID,
		coordinates: {
			latitude: data.latitude,
			longitude: data.longitude
		}
	}, function (response) {
		callback(response);
	});
};


// get likes count     @url
kFB.getLikes = function(callback, data) {
	kFB.getLoginStatus(kFB.getLikesCB, callback, data);
};
kFB.getLikesCB = function(callback, data) {
	if (typeof callback != "function") {
		console.log("error: callback is not function");
		return;
	}
	if (!data || !data.url) {
		console.log("error: data is missing");
		return;
	}
	FB.api({
		method: "fql.query",
		query: "SELECT like_count FROM link_stat WHERE url='" + data.url + "'"
	}, function (response) {
		//console.log(response[0].like_count);
		callback(response[0].like_count);
	});
};


// get birthday people current month
kFB.getBirthdayPeople = function(callback, data) {
	kFB.getLoginStatus(kFB.getBirthdayPeopleCB, callback, data);
};
kFB.getBirthdayPeopleCB = function(callback, data) {
	if (typeof callback != "function") {
		console.log("error: callback is not function");
		return;
	}
	if (!data) {
		console.log("error: data is missing");
		return;
	}
	FB.api("me/friends", "GET", { fields: "id, name, birthday, picture", type: "square" }, function (response) {
		var nowMonth = new Date().getMonth() + 1;
		var list = [];
		var total = response.data.length;
		for (var i = 0; i < total; i++) {
			if (response.data[i].birthday) {
				var month = Math.floor(response.data[i].birthday.match(/\d{2}/)[0]);
				if (month == nowMonth) list.push(response.data[i]);
			}
		}
		callback(list);
	});
};

// get tag photo
kFB.getTagPhoto = function(callback, data) {
	kFB.getLoginStatus(kFB.getTagPhotoCB, callback, data);
};
kFB.getTagPhotoCB = function (callback, data) {
	if (typeof callback != "function") {
		console.log("error: callback is not function");
		return;
	}
	if (!data || !data.id) {
		console.log("error: data is missing");
		return;
	}
	data.number = 50;
	FB.api("me/photos", "GET", { limit: data.number }, function (response) {
		var total = response.data.length;
		for (var i = 0; i < total ; i++) {
			var tags = response.data[i].tags.data.length;
			for (var j = 0; j < tags; j++) {
				if (response.data[i].tags.data[j].id == data.id) {
					callback(response.data[i]);
					return;
				}
			}
		}
		callback(null);
	});
};

// get tag photo and checkin
kFB.getTagPhotoCheckin = function(callback, data) {
	kFB.getLoginStatus(kFB.getTagPhotoCheckinCB, callback, data);
};
kFB.getTagPhotoCheckinCB = function(callback, data) {
	if (typeof callback != "function") {
		console.log("error: callback is not function");
		return;
	}
	if (!data || !data.id) {
		console.log("error: data is missing");
		return;
	}
	data.number = 50;
	FB.api("me/photos", "GET", { limit: data.number }, function (response) {
		var total = response.data.length;
		for (var i = 0; i < total ; i++) {
			if (typeof response.data[i].place == "undefined") continue;
			var tags = response.data[i].tags.data.length;
			for (var j = 0; j < tags; j++) {
				if (response.data[i].tags.data[j].id == data.id) {
					if (typeof callback == "function") {
						callback(response.data[i]);
						return;
					}
				}
			}
		}
		callback(null);
	});
};

// get tag with checkin
kFB.getTagCheckin = function(callback, data) {
	kFB.getLoginStatus(kFB.getTagCheckinCB, callback, data);
};
kFB.getTagCheckinCB = function(callback, data) {
	if (typeof callback != "function") {
		console.log("error: callback is not function");
		return;
	}
	if (!data || !data.id) {
		console.log("error: data is missing");
		return;
	}
	FB.api("me/checkins", "GET", {}, function (response) {
		var total = response.data.length;
		for (var i = 0; i < total ; i++) {
			if (typeof response.data[i].tags == "undefined") continue;
			var tags = response.data[i].tags.data.length;
			for (var j = 0; j < tags; j++) {
				if (response.data[i].tags.data[j].id == data.id) {
					if (typeof callback == "function") {
						callback(response.data[i]);
						return;
					}
				}
			}
		}
		callback(null);
	});
};


//get tag target post 
kFB.getTargetPost = function(callback, data) {
	kFB.getLoginStatus(kFB.getTargetPostCB, callback, data);
};
kFB.getTargetPostCB = function(callback, data) {
	if (typeof callback != "function") {
		console.log("error: callback is not function");
		return;
	}
	if (!data || !data.id) {
		console.log("error: data is missing");
		return;
	}
	data.number = 25;
	FB.api("me/posts", "GET", { limit: data.number }, function (response) { 
		var total = response.data.length;
		for (var i = 0; i < total; i++) { 
			var obj = response.data[i];
			var message = "";
			if (obj.type == "status") { 
				if (obj.story) {
					message = obj.story.match(/[^"]+/i)[0];
				} else {
					message = obj.message;
				}

				if (kFB.getTargetPostAnalysis(obj, "status", data)) {
					callback(message);
					return;
				}
			}
		}
		callback("");
	});
};
kFB.getTargetPostAnalysis = function(obj, type, data) {
	if (type == "status" && obj.message_tags) {
		for (var arg in obj.message_tags) {
			//console.log(obj.message_tags[arg][0].id);
			if (obj.message_tags[arg][0].id == data.id) {
				return true;
			}
		}
	} else if (type == "status" && obj.story_tags) {
		for (var arg in obj.story_tags) {
			//console.log(obj.story_tags[arg][0].id);
			if (obj.story_tags[arg][0].id == data.id) {
				return true;
			}
		}
	}
	return false;
};


// tag Photo @photo_id   list : [{ tag_uid, x, y }...]
kFB.tagPhoto = function(callback, data) {
	kFB.getLoginStatus(kFB.tagPhotoCB, callback, data);
};
kFB.tagPhotoCB = function (callback, data) {
	if (typeof callback != "function") {
		console.log("error: callback is not function");
		return;
	}
	if (!data || !data.id || !data.list) {
		console.log("error: data is missing");
		return;
	}
	FB.api(data.id + "/tags", "POST", { 
		//tags: [ { tag_uid:750958229, x: 30, y: 30},{ tag_uid: 100002437274381, x: 50, y: 50 } ]
		tags: data.list
	}, function(response) {
		callback(response);
	});
};

/* Facebook plugins */
// set facebook comments box width
// $('.fb-comments iframe,.fb-comments span:first-child').css("width", 550);


// =================================================================
// flash call and callback
var flash;

var kFlash = {};
kFlash.call = function (method, callback, data) {
	//console.log("flash call", method, callback);
	try {
		flash = document.getElementById("flash");
	} catch (error) {
		console.log(error);
	}

	kFlash[callback] = function (data) {
		try {
			flash[callback](data);
		} catch (error) {
			console.log(error);
		}
	};

	kFB[method](kFlash[callback], data);
};
kFlash.accessToken = function () { return kFB.accessToken; };
kFlash.getUser = function () { return kFB.getUser(); };
kFlash.userName = function() { return kFB.userName; };
kFlash.userID = function() { return kFB.userID; };
kFlash.gender = function() { return kFB.gender; };




$(kFB.initFB);