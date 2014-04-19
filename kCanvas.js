/**
 * version 1.5.0
 * 
 * date 2014.2.12
 * 
 * @author kisspowpow
 */

function kCanvas () { };
kCanvas.radian = Math.PI / 180;
kCanvas.degree = 180 / Math.PI;

kCanvas.prototype.target = null;
kCanvas.prototype.canvas = undefined;
kCanvas.prototype.ctx = undefined;
kCanvas.prototype.tree = [];
kCanvas.prototype.width = 0;
kCanvas.prototype.height = 0;
kCanvas.prototype.pressdown = false;
kCanvas.prototype.currentTarget = null;
kCanvas.prototype.renderMode = false;
kCanvas.prototype.timer = 0;
kCanvas.prototype.delay = 33;//83(fps12);//55(fps18);//41(fps24);//33(fps30);//16;(fps60)
kCanvas.prototype.angle = 0;
kCanvas.prototype.translateX = 0;
kCanvas.prototype.translateY = 0;
kCanvas.prototype.transform = new CanvasTransform();
kCanvas.prototype.scale = 1;
kCanvas.prototype.offsetX = 0;
kCanvas.prototype.offsetY = 0;
kCanvas.prototype.globalStroke = false;
kCanvas.prototype.lineWidth = 1;
kCanvas.prototype.lineDash = [];
kCanvas.prototype.strokeStyle = "#000000";
kCanvas.prototype.useAnimation = true;
kCanvas.prototype.requestAnimationFrame = 0; //window.requestAnimationFrame id


kCanvas.prototype.init = function (canvas, width, height) {
	this.canvas = canvas;
	this.ctx = canvas.getContext("2d");
	this.width = width;
	this.height = height;
	this.target = this;
	
	this.ctx.lineWidth = this.lineWidth;
	this.ctx.setLineDash ? this.ctx.setLineDash(this.lineDash) : this.ctx.mozDash = this.lineDash;
	this.ctx.strokeStyle = this.strokeStyle;
}


kCanvas.prototype.initMouseEvent = function() {
	var kcanvas = this;

	this.canvas.onmousemove = function (event) { kcanvas.onMouseMove(event); };
	this.canvas.onmousedown = function (event) { kcanvas.onMouseDown(event); };
	this.canvas.onmouseup = function (event) { kcanvas.onMouseUp(event); };
}

kCanvas.prototype.onMouseMove = function (event) {
	console.log("mouse move");
	//var mouseX = event.pageX - $(this).offset().left;
	//var mouseY = event.pageY - $(this).offset().top;
}
kCanvas.prototype.onMouseDown = function (event) {
	console.log("mouse down");
	//var mouseX = event.pageX - $(this).offset().left;
	//var mouseY = event.pageY - $(this).offset().top;
}
kCanvas.prototype.onMouseUp = function (event) {
	console.log("mouse up");
	//var mouseX = event.pageX - $(this).offset().left;
	//var mouseY = event.pageY - $(this).offset().top;
}



kCanvas.prototype.initTouchEvent = function () {
	if (!this.canvas.addEventListener) return;
	var kcanvas = this;
	this.canvas.addEventListener("touchstart", function (event) { kcanvas.onTouchStart(event); });
	this.canvas.addEventListener("touchmove", function (event) { kcanvas.onTouchMove(event); });
	this.canvas.addEventListener("touchend", function (event) {	kcanvas.onTouchEnd(event); });
}

kCanvas.prototype.onTouchStart = function (pageX, pageY) {
	console.log("touch start");
	//var touch = event.touches[0] || event.changedTouches[0];
	//var touchX = touch.pageX - $(event.target).offset().left;
	//var touchY = touch.pageY - $(event.target).offset().top;
}
kCanvas.prototype.onTouchMove = function (pageX, pageY) {
	console.log("touch move");
	//var touch = event.touches[0] || event.changedTouches[0];
	//var touchX = touch.pageX - $(event.target).offset().left;
	//var touchY = touch.pageY - $(event.target).offset().top;
}
kCanvas.prototype.onTouchEnd = function (pageX, pageY) {
	console.log("touch end");
	//var touch = event.touches[0] || event.changedTouches[0];
	//var touchX = touch.pageX - $(event.target).offset().left;
	//var touchY = touch.pageY - $(event.target).offset().top;
}


kCanvas.prototype.initPointerEvent = function () {
	if (!this.canvas.addEventListener) return;
	var kcanvas = this;

	$(window).css("-ms-touch-action", "none");
	this.canvas.addEventListener("MSPointerDown", function (event) { kcanvas.onMSPointerDown(event); });
	this.canvas.addEventListener("MSPointerMove", function (event) { kcanvas.onMSPointerMove(event); });
	this.canvas.addEventListener("MSPointerUp", function (event) { kcanvas.onMSPointerUp(event); });
}
kCanvas.prototype.onMSPointerDown = function (event) {
	console.log("pointer down");
}
kCanvas.prototype.onMSPointerMove = function (event) {
	console.log("pointer move");
}
kCanvas.prototype.onMSPointerUp = function (event) {
	console.log("pointer up");
}



// ADD REMOVE
kCanvas.prototype.addObject = function(obj) {
	this.tree.push(obj);
	//obj.name += this.tree.length;
}

kCanvas.prototype.addObjectAt = function(obj, index) {
	if (index < 0 || index > this.tree.length) {
		//console.log("index error");
		return false;
	}
	this.tree.splice(index, 0, obj);
	//obj.name += index;
	return true;
}

kCanvas.prototype.removeObject = function(obj) {
	var id = this.tree.indexOf(obj);
	if (id == -1) {
		//console.log("kCanvas does not has the object");
		return false;
	}
	this.tree.splice(id, 1);
	return true;
}

kCanvas.prototype.setObjectIndex = function(obj, index) {
	var id = this.tree.indexOf(obj);
	if (id == -1) return;
	if (id == index) return;
	this.tree.splice(id, 1);
	this.tree.splice(index, 0, obj);
}

kCanvas.prototype.getObjectAt = function(id) {
	if (id < 0 || id > this.tree.length - 1) {
		return null;
	} else {
		return this.tree[id - 1];
	}
}

kCanvas.prototype.removeObjectAt = function (id) {
	if (id < 0 || id > this.tree.length - 1) {
		return null;
	} else {
		var obj = this.tree[id];
		this.removeObject(obj);
		return obj;
	}
}
//



kCanvas.prototype.show = function() {
	$(this.canvas).css("display", "block");
}

kCanvas.prototype.hide = function() {
	$(this.canvas).css("display", "none");
}



kCanvas.prototype.mouseTarget = function(mouseX, mouseY) {
	var num = this.tree.length;
	for (var i = num - 1; i >= 0; i--) {
		var obj = this.tree[i];
		if (obj.mouseTest(mouseX, mouseY)) {
			this.currentTarget = obj;
			//console.log(obj.name);
			return true;
		}
	}
	//console.log("no target");
	return false;
}

kCanvas.prototype.setTransform = function (scaleX, skewX, skewY, scaleY, tx, ty) {
	this.transform.a = scaleX;
	this.transform.b = skewX;
	this.transform.c = skewY;
	this.transform.d = scaleY;
	this.transform.e = tx;
	this.transform.f = ty;

	this.ctx.setTransform(scaleX, skewX, skewY, scaleY, tx, ty);
}

kCanvas.prototype.setObjectTransform = function (obj) {
	var degree = obj.rotation * kCanvas.radian;
	var sx = obj.scaleX;
	var sy = obj.scaleY;
	var tx = obj.x;
	var ty = obj.y;
	/*var sx = obj.scaleX * this.scale;
	var sy = obj.scaleY * this.scale;
	var tx = obj.x + this.offsetX;
	var ty = obj.y + this.offsetY;*/

	// a   b   e
	// c   d   f
	// 0   0   1

	// scale			// rotate								// translate
	// sx  0   0		// Math.cos(dg)  -Math.sin(dg)  0		// 1  0  tx
	// 0   sy  0		// Math.sin(dg)  Math.cos(dg)   0		// 0  1  ty
	// 0   0   1		// 0             0              1		// 0  0  1
	

	var ra = sx * Math.cos(degree);
	var rb = sx * -Math.sin(degree);
	var re = 0; //tx;
	
	var rc = sy * Math.sin(degree);
	var rd = sy * Math.cos(degree);
	var rf = 0; //ty;

	var a = ra * 1;
	var b = rb * 1;
	var e = 1 * tx;

	var c = rc * 1;
	var d = rd * 1;
	var f = 1 * ty;

	this.ctx.setTransform(a, b, c, d, e, f);
	this.ctx.translate(-obj.centerX, -obj.centerY);
}

kCanvas.prototype.rotate = function (degree) {
	this.angle = degree;
	this.ctx.rotate(this.angle * Math.PI / 180);
	return this.angle;
}

kCanvas.prototype.reset = function () {
	this.ctx.rotate(-this.angle * Math.PI / 180);
	this.ctx.setTransform(1, 0, 0, 1, 0, 0);
	this.ctx.translate(0, 0);
	this.ctx.globalAlpha = 1;
	//#
	//this.ctx.lineWidth = 1;
	//this.ctx.strokeStyle = "#000000";
	//this.ctx.setLineDash([]);
	this.angle = 0;
}

kCanvas.prototype.clear = function () {
	this.ctx.clearRect(0, 0, this.width, this.height);
}

kCanvas.prototype.render = function () {
	//console.log("render");
	this.reset();
	this.clear();
	this.onRender();
	var num = this.tree.length;

	for (var i = 0; i < num; i++) {
		var obj = this.tree[i];
		if (!obj.visible) continue;
		if (obj.alpha == 0) continue;

		if (obj.type == "img") {
			obj.onRender();
			this.setObjectTransform(obj);
			this.ctx.globalAlpha = obj.alpha;
			this.ctx.drawImage(obj.src, 0, 0, obj.width, obj.height);
			this.reset();


		} else if (obj.type == "rect") {
			this.angle = obj.rotation;
			this.setObjectTransform(obj);
			this.ctx.globalAlpha = obj.alpha;
			this.ctx.beginPath();

			if (obj.stroke != null) {
				this.globalStroke == false ? this.ctx.lineWidth = obj.stroke.lineWidth : null;
				this.globalStroke == false ? this.ctx.strokeStyle = obj.stroke.strokeStyle : null;
				if (this.globalStroke == false) {
					this.ctx.setLineDash ? this.ctx.setLineDash(obj.stroke.lineDash) : this.ctx.mozDash = obj.stroke.lineDash;
				}
				this.ctx.rect(0, 0, obj.width, obj.height);
				this.ctx.stroke();
			}

			if (obj.color != "") {
				this.ctx.fillStyle = obj.color;
				this.ctx.fillRect(0, 0, obj.width, obj.height);
			}

			this.ctx.closePath();
			this.reset();


		} else if (obj.type == "line") {
			this.angle = obj.rotation;
			this.setObjectTransform(obj);
			this.ctx.globalAlpha = obj.alpha;
			this.ctx.beginPath();

			for (var j = 0; j < obj.points.length; j++) {
				var point = obj.points[j];
				this.ctx.lineTo(point.x, point.y);
			}

			this.ctx.closePath();

			if (obj.stroke != null) {
				this.ctx.lineCap = obj.lineCap;
				this.globalStroke == false ? this.ctx.lineWidth = obj.stroke.lineWidth : null;
				this.globalStroke == false ? this.ctx.strokeStyle = obj.stroke.strokeStyle : null;
				if (this.globalStroke == false) {
					this.ctx.setLineDash ? this.ctx.setLineDash(obj.stroke.lineDash) : this.ctx.mozDash = obj.stroke.lineDash;
				}
				this.ctx.stroke();
			}

			if (obj.color != "") {
				this.ctx.fillStyle = obj.color;
				this.ctx.fill();
			}

			this.reset();


		} else if (obj.type == "circle") {
			this.angle = obj.rotation;
			this.setObjectTransform(obj);
			this.ctx.globalAlpha = obj.alpha;

			this.ctx.beginPath();
			this.ctx.arc(0, 0, obj.radius, obj.startAngle, obj.endAngle, obj.anticlockwise);
			this.ctx.closePath();

			if (obj.stroke != null) {
				this.globalStroke == false ? this.ctx.lineWidth = obj.stroke.lineWidth : null;
				this.globalStroke == false ? this.ctx.strokeStyle = obj.stroke.strokeStyle : null;
				if (this.globalStroke == false) {
					this.ctx.setLineDash ? this.ctx.setLineDash(obj.stroke.lineDash) : this.ctx.mozDash = obj.stroke.lineDash;
				}
				this.ctx.stroke();
			}
			if (obj.color != "") {
				this.ctx.fillStyle = obj.color;
				this.ctx.fill();
			}
			this.reset();


		} else if (obj.type == "text") {
			this.ctx.globalAlpha = obj.alpha;
			this.ctx.textBaseline = "top";
			this.ctx.fillStyle = obj.color;
			this.ctx.font = obj.font;
			this.ctx.fillText(obj.text, obj.x, obj.y, obj.maxWidth);
			this.reset();


		} else if (obj.type == "movie") {
			obj.render();
			this.setObjectTransform(obj);
			this.ctx.globalAlpha = obj.alpha;
			this.ctx.drawImage(obj.src, 0, 0, obj.width, obj.height);
			this.reset();
		}
	}

	// draw end
}

kCanvas.prototype.startRender = function () {
	if (this.renderMode) return;
	console.log("start render");
	var kcanvas = this;

	if (window.requestAnimationFrame && kcanvas.useAnimation) {
		kcanvas.requestAnimationFrame = window.requestAnimationFrame(function () { kcanvas.render(); });

	} else {
		this.timer = setInterval(function () {
			kcanvas.render();
		}, this.delay);
	}

	this.renderMode = true;
}

kCanvas.prototype.stopRender = function() {
	if (! this.renderMode) return;
	//console.log("stop render");

	if (window.requestAnimationFrame && this.useAnimation) {
		window.cancelAnimationFrame(this.requestAnimationFrame);
	} else {
		clearInterval(this.timer);
	}

	this.renderMode = false;
}


//------------- Event
kCanvas.prototype.onRender = function () {
	//console.log(this);
}


//---------------------------------------------------------------------------------------------------------------------
// CanvasTransform @param (scaleX, skewX, skewY, scaleY, tx, ty)
function CanvasTransform(scaleX, skewX, skewY, scaleY, tx, ty) {
	if (!ValueCheck(scaleX)) scaleX = 1;
	if (!ValueCheck(skewX)) skewX = 0;
	if (!ValueCheck(skewY)) skewY = 0;
	if (!ValueCheck(scaleY)) scaleY = 1;
	if (!ValueCheck(tx)) tx = 0;
	if (!ValueCheck(ty)) ty = 0;
	this.a = scaleX;
	this.b = skewX;
	this.c = skewY;
	this.d = scaleY;
	this.e = tx;
	this.f = ty;
}
CanvasTransform.prototype.a = 1;
CanvasTransform.prototype.b = 0;
CanvasTransform.prototype.c = 0;
CanvasTransform.prototype.d = 1;
CanvasTransform.prototype.e = 0;
CanvasTransform.prototype.f = 0;


//---------------------------------------------------------------------------------------------------------------------
// Canvas Line Option [Cap.Butt, Cap.Round, Cap.Square]
CanvasLineOption = {};
CanvasLineOption.Cap = {};
CanvasLineOption.Cap.Butt = "butt";
CanvasLineOption.Cap.Round = "round";
CanvasLineOption.Cap.Square = "square";

// Canvas Stroke Object @param (lineWidth, lineDash = [5,3], strokeStyle = "#000000")
function CanvasStrokeObject(_lineWidth, _lineDash, _strokeStyle) {
	typeof _lineWidth == "undefined" ? this.lineWidth = 1 : this.lineWidth = _lineWidth;
	typeof _lineDash == "undefined" ? this.lineDash = [] : this.lineDash = _lineDash;
	typeof _strokeStyle == "undefined" ? this.strokeStyle = "#000000" : this.strokeStyle = _strokeStyle;
};
CanvasStrokeObject.prototype.lineWidth = 1;
CanvasStrokeObject.prototype.strokeStyle = "#000000";
CanvasStrokeObject.prototype.lineDash = [];


//---------------------------------------------------------------------------------------------------------------------
// Canvas Basic Object for extends
function CanvasBasicObject() { }
CanvasBasicObject.prototype.alpha = 1;
CanvasBasicObject.prototype.x = 0;
CanvasBasicObject.prototype.y = 0;
CanvasBasicObject.prototype.width = 100;
CanvasBasicObject.prototype.height = 100;
CanvasBasicObject.prototype.type = "basic";
CanvasBasicObject.prototype.name = "";
CanvasBasicObject.prototype.visible = true;
CanvasBasicObject.prototype.centerX = 0;
CanvasBasicObject.prototype.centerY = 0;
CanvasBasicObject.prototype.rotation = 0;
CanvasBasicObject.prototype.scaleX = 1;
CanvasBasicObject.prototype.scaleY = 1;
CanvasBasicObject.prototype.interactive = false;
CanvasBasicObject.prototype.stroke = null;

//---------------------------------------------------------------------------------------------------------------------
// Canvas Rect instance @param (x, y, width, height, color = "#000000")
function CanvasRectObject(x, y, width, height, color) {
	if (typeof x == "undefined") x = 0;
	if (typeof y == "undefined") y = 0;
	if (typeof width == "undefined") width = 10;
	if (typeof height == "undefined") height = 10;
	if (!color.match(/^#[0-9 A-F]{6}$/i) && color != "") color = "#000000";

	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.color = color;
	this.type = "rect";
};
CanvasRectObject.prototype = new CanvasBasicObject();
CanvasRectObject.prototype.color = "#000000";


//---------------------------------------------------------------------------------------------------------------------
// Canvas Line instance @param (x, y, points = [{x:0, y:0}, {x:10, y:10}], color = "#000000")
function CanvasLineObject(x, y, points, color) {
	if (typeof x == "undefined") x = 0;
	if (typeof y == "undefined") y = 0;
	if (!color.match(/^#[0-9 A-F]{6}$/i) && color != "") color = "#000000";

	this.x = x;
	this.y = y;
	this.points = points;
	this.color = color;
	this.type = "line";
}
CanvasLineObject.prototype = new CanvasBasicObject();
CanvasLineObject.prototype.points = [];
CanvasLineObject.prototype.color = "#000000";
CanvasLineObject.prototype.lineCap = CanvasLineOption.Cap.Butt;


//---------------------------------------------------------------------------------------------------------------------
// Canvas Circle instance @param (x, y, radius, startAngle, endAngle, anticlockwise = true, color = "#000000")
function CanvasCircleObject(x, y, radius, startAngle, endAngle, anticlockwise, color) {
	if (!ValueCheck(x)) x = 0;
	if (!ValueCheck(y)) y = 0;
	if (!ValueCheck(radius)) radius = 100;
	if (!ValueCheck(startAngle)) startAngle = 0;
	if (!ValueCheck(endAngle)) endAngle = 0;
	if (!ValueCheck(anticlockwise)) anticlockwise = true;
	if (!ValueCheck(color) && !color.match(/^#[0-9 A-F]{6}$/i) && color != "") color = "#000000";
	this.x = x;
	this.y = y;
	this.radius = radius;
	this.startAngle = startAngle * (Math.PI / 180);
	this.endAngle = endAngle * (Math.PI / 180);
	this.anticlockwise = anticlockwise;
	this.type = "circle";
	this.color = color;
}
CanvasCircleObject.prototype = new CanvasBasicObject();
CanvasCircleObject.prototype.radius = 10;
CanvasCircleObject.prototype.startAngle = 0;
CanvasCircleObject.prototype.endAngle = 360;
CanvasCircleObject.prototype.anticlockwise = true;
CanvasCircleObject.prototype.mode = "fill";
CanvasCircleObject.prototype.color = "#000000";

//---------------------------------------------------------------------------------------------------------------------
// Canvas Text instance @param (text, x, y, maxWidth, color)
function CanvasTextObject(text, x, y, maxWidth, color) {
	if (!ValueCheck(text)) text = "";
	if (!ValueCheck(x)) x = 0;
	if (!ValueCheck(y)) y = 0;
	if (!ValueCheck(maxWidth)) maxWidth = 150;
	if (ValueCheck(color) && !color.match(/^#[0-9 A-F]{6}$/i)) color = "#000000";

	this.text = text;
	this.x = x;
	this.y = y;
	this.maxWidth = maxWidth;
	this.color = color;
	this.font = "24px Arial";
	this.type = "text";
}
CanvasTextObject.prototype.alpha = 1;
CanvasTextObject.prototype.text = "";
CanvasTextObject.prototype.x = 0;
CanvasTextObject.prototype.y = 0;
CanvasTextObject.prototype.maxWidth = 100;
CanvasTextObject.prototype.font = "24px Arial";
CanvasTextObject.prototype.type = "text";
CanvasTextObject.prototype.visible = true;


//---------------------------------------------------------------------------------------------------------------------
// Canvas Image instance @param (x, y, width, height)
function CanvasImageObject(x, y, width, height) {
	if (typeof x == "undefined") x = 0;
	if (typeof y == "undefined") y = 0;
	if (typeof width == "undefined") width = 100;
	if (typeof height == "undefined") height = 100;
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.mouseX = 0;
	this.mouseY = 0;
	this.src;
	this.type = "img";
}
CanvasImageObject.prototype = new CanvasBasicObject();
CanvasImageObject.prototype.src = {};
CanvasImageObject.prototype.mouseX = 0;
CanvasImageObject.prototype.mouseY = 0;

CanvasImageObject.prototype.detectEvent = function(mouseX, mouseY) {
	if (mouseX < this.x || mouseX > this.x + this.width) {
		return false;
	}
	if (mouseY < this.y || mouseY > this.y + this.height) {
		return false;
	}
	this.mouseX = mouseX;
	this.mouseY = mouseY;
	return true;
}
CanvasImageObject.prototype.onDown = function () { };
CanvasImageObject.prototype.onOver = function () { };
CanvasImageObject.prototype.onOut = function () { };
CanvasImageObject.prototype.onUp = function () { };
CanvasImageObject.prototype.onRender = function () { };


//---------------------------------------------------------------------------------------------------------------------
// Canvas Sequence Image @param(x, y, width, height)
function CanvasMovieObject(x, y, width, height) {
	if (typeof x == "undefined") x = 0;
	if (typeof y == "undefined") y = 0;
	if (typeof width == "undefined") width = 100;
	if (typeof height == "undefined") height = 100;
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.type = "movie";
}

CanvasMovieObject.prototype = new CanvasBasicObject();
CanvasMovieObject.prototype.mouseX = 0;
CanvasMovieObject.prototype.mouseY = 0;
CanvasMovieObject.prototype.tree = [];
CanvasMovieObject.prototype.src = null;
CanvasMovieObject.prototype.currentFrame = 0;
CanvasMovieObject.prototype.totalFrame = 0;
CanvasMovieObject.prototype.loop = true;
CanvasMovieObject.prototype.status = "play"; //stop   //end

CanvasMovieObject.prototype.add = function (image) {
	this.tree.push(image);
	this.totalFrame = this.tree.length;
}
CanvasMovieObject.prototype.addAt = function (image, index) {
	var list = this.tree;
	if (index < 0 || index > this.tree.length) {
		//console.log("index error");
		return false;
	}
	this.tree.splice(index, 0, image);
	this.totalFrame = this.tree.length;
	return true;
}
CanvasMovieObject.prototype.addArray = function (imageArray) {
	if (typeof imageArray != "object" || typeof imageArray.length == "undefined") {
		console.log("source must be image array");
		return;
	}

	this.tree = imageArray.concat();
	this.totalFrame = this.tree.length;
}
CanvasMovieObject.prototype.remove = function (image) {
	var total = this.tree.length;
	for (var i = 0; i < total; i++) {
		if (this.tree[i] = image) {
			this.tree.splice(i, 1);
			this.totalFrame = this.tree.length;
			return true;
		}
	}
	return false;
}
CanvasMovieObject.prototype.removeAt = function (index) {
	if (index < 0 || index > this.tree.length - 1) {
		return false;
	}
	this.tree.splice(index, 1);
	this.totalFrame = this.tree.length;
	return true;
}
CanvasMovieObject.prototype.setImageIndex = function (image, index) {
	var total = this.tree.length;
	for (var i = 0; i < total; i++) {
		if (this.tree[i] == image) {
			if (i == index) return true;
			this.tree.splice(i, 1);
			this.tree.splice(index, 0, image);
			this.totalFrame = this.tree.length;
			return true;
		}
	}
	return false;
}
CanvasMovieObject.prototype.getImageAt = function (index) {
	if (index < 0 || index > this.tree.length - 1) {
		return null;
	}
	return this.tree[index];
}
CanvasMovieObject.prototype.render = function () {
	if (this.src == null) {
		this.src = this.tree[this.currentFrame];
		return;
	}
	
	if (this.status == "stop") {
		this.onRender();
		return;
	}

	if (this.status == "end") {
		this.onRender();
		return;
	}

	if (this.status == "reverse") {
		if (this.currentFrame > 0) {
			this.currentFrame--;
			this.onRender();
		}
		else if (this.loop) {
			this.currentFrame = this.totalFrame - 1;
			this.onRender();
		}
		else {
			this.currentFrame = 0;
			this.onRender();
			this.status = "stop";
		}
		return;
	}

	//if (this.status != "play") return;
	this.totalFrame = this.tree.length;

	if (this.currentFrame < this.totalFrame - 1) {
		this.currentFrame++;
		this.src = this.tree[this.currentFrame];
		this.onRender();
		return;
	}

	if (this.currentFrame == this.totalFrame - 1) {
		if (this.loop == false) {
			this.status = "end";
			this.onEnd();
			return;
		}

		else {
			this.currentFrame = 0;
			this.src = this.tree[this.currentFrame];
			this.onRender();
		}
	}
}
CanvasMovieObject.prototype.play = function () {
	this.visible = true;
	this.status = "play";
	if (this.currentFrame == this.totalFrame - 1) {
		this.currentFrame = 0;
	}
}
CanvasMovieObject.prototype.stop = function () {
	this.status = "stop";
}
CanvasMovieObject.prototype.reverse = function () {
	this.status = "reverse";
}
CanvasMovieObject.prototype.next = function () {
	this.currentFrame < this.totalFrame - 1 ? this.currentFrame++ : null;
}
CanvasMovieObject.prototype.prev = function () {
	this.currentFrame > 0 ? this.currentFrame-- : null;
}
CanvasMovieObject.prototype.detectEvent = function (mouseX, mouseY) {
	if (mouseX < this.x || mouseX > this.x + this.width) {
		return false;
	}
	if (mouseY < this.y || mouseY > this.y + this.height) {
		return false;
	}
	this.mouseX = mouseX;
	this.mouseY = mouseY;
	return true;
}
CanvasMovieObject.prototype.onOver = function () { };
CanvasMovieObject.prototype.onOut = function () { };
CanvasMovieObject.prototype.onDown = function () { };
CanvasMovieObject.prototype.onUp = function () { };
CanvasMovieObject.prototype.onRender = function () { };
CanvasMovieObject.prototype.onEnd = function () { };




//---------------------------------------------------------------------------------------------------------------------
// Check value is undefined
function ValueCheck(value) {
	if (typeof value == "undefined") return false;
	return true;
}