/**
 * version 1.4.5
 * 
 * date 2013.9.3
 * 
 * @author kisspowpow
 */

 // constructor 
 // @param imageArray : path Array 
 // @param name : loader name
function kImageLoader(imageArray, name) {
	if (typeof imageArray != "object" || typeof imageArray.length == "undefined") {
		console.log("source must be array");
		return;
	}
	typeof name == "string" ? this.name = name : this.name = "";
	
	this.imageData = [];
	this.sourceArray = imageArray;
	this.total = imageArray.length;
}
kImageLoader.prototype.name = "";
kImageLoader.prototype.sourceArray = [];
kImageLoader.prototype.total = 0;
kImageLoader.prototype.loaded = 0;
kImageLoader.prototype.error = 0;
kImageLoader.prototype.imageData = [];

// instance method : start load
kImageLoader.prototype.startLoad = function () {
	for (var i = 0; i < this.total; i++) {
		var imageURL = this.sourceArray[i];
		this.load(imageURL);
	}
}

// instance method : add image path
kImageLoader.prototype.load = function (imageURL) {
	var image = new Image();
	image.onload = this.onload;
	image.onerror = this.onerror;
	image.onabort = this.onabort;
	image.loader = this;
	image.src = imageURL;
	
	this.imageData.push(image);
}

// instance method : unload and release all images
kImageLoader.prototype.unload = function () {
	var total = this.imageData.length;
	for (var i = 0; i < total; i++) {
		var image = this.imageData[i];
		image.src = "";
		image = null;
	}
}

// private method
kImageLoader.prototype.onload = function () {
	var event = { target: this.loader };
	
	this.onload = this.onerror = this.onabort = null;
	this.success = true;
	this.loader.loaded++;
	this.loader.onProgress(event);
	if (this.loader.loaded + this.loader.error == this.loader.total) {
		this.loader.onComplete(event);
	}

	//this.loader.info();
}

// private method
kImageLoader.prototype.onerror = function (error) {
	console.log("load fail: ", this.src);
	this.success = false;
	this.loader.error++;
	if (this.loader.loaded + this.loader.error == this.loader.total) {
		var event = { target: this.loader };
		this.loader.onComplete(event);
	}

	//this.loader.info();
}

// private method
kImageLoader.prototype.onabort = function () {
	console.log("load abort: ", this.src);
	this.success = false;
	this.loader.error++;
	if (this.loader.loaded + this.loader.error == this.loader.total) {
		var event = { target: this.loader };
		this.loader.onComplete(event);
	}

	//this.loader.info();
}


// instance method : on load progress
// var loader = kImageLoader();
// loader.onProgress = function (event) { };
kImageLoader.prototype.onProgress = function (event) {

}


// instance method : on load complete
// var loader = kImageLoader();
// loader.onComplete = function (event) { };
kImageLoader.prototype.onComplete = function (event) {
	
}


// instance method : show total and loaded now
kImageLoader.prototype.info = function () {
	//console.log("total: " + this.loader.total + "  loaded: " + this.loader.loaded + "  error: " + this.loader.error);
	console.log("total: " + this.total + "  loaded: " + this.loaded + "  error: " + this.error);
}