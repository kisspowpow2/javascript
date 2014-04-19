/*
*
*
*/

$(initial)

/*
if (typeof window.console == "undefined")
{
	window.console = {};
	window.console.log = function() {};
}
*/

function initial()
{
	WL.init({
		client_id: "00000000440BC97D",
		// redirect_uri: "http://skydrive.18design.com/",
		scope: kLive.scope
	});
	
	//WL.ui({ name: "signin", element: "signin" });

	//WL.Event.subscribe("auth.login", kLive.onLogin);
	//WL.Event.subscribe("auth.logout", kLive.onLogout);
	//WL.Event.subscribe("auth.sessionChange", kLive.onSessionChange);
	//WL.Event.subscribe("auth.statusChange", kLive.onStatusChange);
	//WL.Event.subscribe("wl.log", kLive.onLog);
}


//
//
function kLive()
{
	//kLive is class
}

kLive.scope = ["wl.basic", "wl.emails", "wl.photos", "wl.skydrive", "wl.skydrive_update", "wl.contacts_skydrive", "wl.contacts_photos"];
//kLive.scope = ["wl.signin", "wl.basic", "wl.emails", "wl.photos", "wl.skydrive", "wl.skydrive_update", "wl.contacts_skydrive", "wl.contacts_photos", "wl.contacts_skydrive_update"];
kLive.userID;
kLive.userName;
kLive.userEmail;
kLive.access_token;
kLive.authentication_token;
kLive.method;
kLive.callback;
kLive.data;


//
//
kLive.onLogin = function(response) 
{
	var session = WL.getSession();
	if (session.error) 
	{
		getParams(session.error);
	}
	else 
	{
		// console.log("--- sign in ---");
		kLive.access_token = session.access_token;
		kLive.authentication = session.authentication_token;
		
		if (typeof kLive.method == "function")
		{
			kLive.method(kLive.access_token);
			kLive.method = null;
		}
	}
}
kLive.onLogout = function(response)
{
	// console.log("--- sign out ---");
	getParams(response);
	//console.log(" ");
}
kLive.onSessionChange = function(response)
{
	// console.log("--- session change ---");
	getParams(response);
	//console.log(" ");
}
kLive.onStatusChange = function(response)
{
	// console.log("status change: " + response.status);
	//connected / unknow
}
kLive.onLog = function(response)
{
	// console.log("--- wl log ---");
	// console.log(response);
	if (response == "WL.login: The popup is closed without receiving consent.") {
		//if (typeof kLive.callback == "function") kLive.callback("denied");
		//kLive.method = null;
		//alert('denied');
	} else if (response == "WL.login: The user has denied access to the scopes requested by the client application.") {
		//if (typeof kLive.callback == "function") kLive.callback("denied");
		//kLive.method = null;
	}
	// console.log("--- wl log end ---");
}


//
//
kLive.getLoginStatus = function(method, callback, data)
{
	if (WL.getSession() == null)
	{
		kLive.login(method, callback, data);
	}
	else
	{
		if (typeof method == "function") 
		{
			method(callback, data);
		}
	}
}

kLive.login = function(method, callback, data)
{
	if (typeof method == "function") kLive.method = method;
	else kLive.method = null;
	
	if (typeof callback == "function") kLive.callback = method;
	else kLive.callback = null;
	
	if (typeof data != "undefined") kLive.data = data;
	else kLive.data = null;
	
	WL.login({ scope: kLive.scope }, function(response)
	{
		kLive.access_token = session.access_token;
		kLive.authentication = session.authentication_token;
		//console.log(kLive.access_token);
		//console.log(kLive.authentication);
		if (typeof method == "function") method(callback, data);
	});
}

kLive.logout = function()
{
	// logout
	WL.logout();
}


kLive.getToken = function ()
{
	if (typeof kLive.acess_token == "undefined")
	{
		if (WL.getSession() == null) return "";
		else kLive.access_token = WL.getSession().access_token;
	}
	return kLive.access_token;
}

//--------------------------------------------
kLive.getProfile = function(callback, data)
{
	kLive.getLoginStatus(kLive.getProfileCB, callback, data);
}
kLive.getProfileCB = function(callback, data)
{
	WL.api({
		path: "me",
		method: "GET"
	},
	function (response)
	{
		//getParams(response);
		kLive.userID = response.id;
		kLive.userName = response.name;
		kLive.userEmail = response.emails.account;
		
		var user = {};
		user.userID = kLive.userID;
		user.userName = kLive.userName;
		user.userEmail = kLive.userEmail;
		if (typeof callback == "function") callback(user);
	});
}

//--------------------------------------------
kLive.createFolder = function(callback, data)
{
	//if (WL.getSession() == null) return;
	kLive.getLoginStatus(kLive.createFolderCB, callback, data);
}
kLive.createFolderCB = function(callback, data)
{
	data.name = "SkyDrive 穿梭時空找驚喜"
	data.description = "Hold住青春時光 歡樂隨時分享";
	data.type = "album"; // folder
	WL.api(
	{ 
		path: "me/skydrive",
		method: "POST",
		body: 
		{ 
			name: data.name,
			description: data.description
		},
		type: data.type
	}, 
	function (response) 
	{
		if (typeof callback == "function")
		{
			if (response.error) callback("error")
			else callback(response.id);
		}
		//getParams(response);
	});
}

//--------------------------------------------
kLive.searchFolder = function(callback, data)
{
	kLive.getLoginStatus(kLive.searchFolderCB, callback, data);
}
kLive.searchFolderCB = function(callback, data)
{
	data.name = "SkyDrive 穿梭時空找驚喜";
	WL.api(
	{
		path: "me/skydrive/files",
		method: "GET"
	},
	function (response)
	{
		var albums = response.data;
		var total = albums.length;
		for (var i = 0; i < total; i++)
		{
			if (albums[i].name == data.name)
			{
				if (typeof callback == "function")
				{
					callback(albums[i].id);
					//console.log(albums[i].id);
					return;
				}
			}
		}
		// no folder
		if (typeof callback == "function")
		{
			callback("null");
		}
	})
}


//================================================================
var flash;
kLiveFlash = function() 
{
	//kLiveFlash is class
}

kLiveFlash.call = function(method, callback, data)
{
	flash = document.getElementById("flash");
	
	kLiveFlash[callback] = function(response)
	{
		flash[callback](response);
	}
	
	kLive.getLoginStatus(kLive[method], kLiveFlash[callback], data);
}


///////////////////////////////
kLiveFlash.login = function(callback)
{
	
	if (WL.getSession() != null)
	{
		flash[callback](WL.getSession().access_token);
	}
	else
	{
		//kLive.callback = flash[callback];
		kLiveFlash[callback] = function(response)
		{
			flash[callback](response);
		}
		kLive.callback = kLiveFlash[callback];
		kLive.login();
	}
}

kLiveFlash.getID = function(callback)
{
	if (WL.getSession() == null) return;
	flash = document.getElementById("flash");
	
	WL.api(
	{
		path: "me",
		method:"get"
	},
	function(response) 
	{
		flash[callback](response.id);
	})
}

kLiveFlash.getAlbumID = function(callback, name)
{
	if (WL.getSession() == null) return;
	flash = document.getElementById("flash");
	
	kLiveFlash[callback] = function(response)
	{
		flash[callback](response);
	}
	kLive.searchFolder(kLiveFlash[callback], name);
}

kLiveFlash.createAlbum = function(callback, name)
{
	if (WL.getSession() == null) return;
	flash = document.getElementById("flash");
	
	kLiveFlash[callback] = function(response)
	{
		flash[callback](response);
	}
	
	kLive.createFolder(kLiveFlash[callback], name);
}

kLiveFlash.uploaded = function(albumID, picID, picSource)
{
	alert("upload success");
	//*//
	var url = "https://skydrive.live.com/?";
	var id = albumID.split(".")[2];
	var cid = id.match(/[^!]+/i)
	aID = id;
	// console.log(albumID);
	// console.log(id);
	// console.log(cid);
	
	//window.open(url + "cid=" + cid + "&id=" + id, "_self");
	//*/
}


//
//
//

function upload()
{
	var url = "https://apis.live.net/v5.0/folder.ed334da70361c37d.ED334DA70361C37D!142/files?access_token=" + WL.getSession().access_token;
	//$("#access_tokenTxt")[0].value = WL.getSession().access_token;
	//$("#uploadForm")[0].action = "upload.php";
	$("#uploadForm")[0].action = url;
	$("#uploadForm").submit();
}


function debug()
{
	var url = "https://apis.live.net/v5.0/folder.ed334da70361c37d.ED334DA70361C37D!153/files?access_token=" + WL.getSession().access_token;
	$("#uploadForm")[0].action = url;
	$("#uploadForm").submit();
}


var aID;
function checkPhoto()
{
	var param = $("#photoURL").attr("value");
	if (param.indexOf(aID) != -1) alert("有");
	else alert("去死吧");
}