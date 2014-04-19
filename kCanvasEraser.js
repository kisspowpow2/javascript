/**
 * version 1.0.0
 * 
 * date 2013.3.27
 * 
 * @author kisspowpow
 */

CompositeMode = {};
CompositeMode.SOURCE_OVER = "source-over";
CompositeMode.SOURCE_IN = "source-in";
CompositeMode.SOURCE_OUT = "source-out";
CompositeMode.SOURCE_ATOP = "source-atop";
CompositeMode.DESTINATION_OVER = "destination-over";
CompositeMode.DESTINATION_OUT = "destination-out";
CompositeMode.DESTINATION_ATOP = "destination-atop";
CompositeMode.LIGHTER = "lighter";
CompositeMode.DARKER = "darker";
CompositeMode.XOR = "xor";
CompositeMode.COPY = "copy";

function kCanvasEraser() { };
kCanvasEraser.prototype.canvas = null;
kCanvasEraser.prototype.ctx = null;
kCanvasEraser.prototype.image = null;
kCanvasEraser.prototype.ox = 0;
kCanvasEraser.prototype.oy = 0;
kCanvasEraser.prototype.ow = 0;
kCanvasEraser.prototype.oh = 0;
kCanvasEraser.prototype.stroke = 30;
kCanvasEraser.prototype.width = 0;
kCanvasEraser.prototype.height = 0;
kCanvasEraser.prototype.erasing = false;


kCanvasEraser.prototype.init = function (canvas, width, height) {
	var eraser = this;
	this.canvas = canvas;
	this.ctx = this.canvas.getContext("2d");
	this.width = width;
	this.height = height;

	this.canvas.eraser = eraser;
	this.canvas.onmousedown = eraser.onMouseDown;
	this.canvas.onmousemove = eraser.onMouseMove;
	this.canvas.onmouseup = eraser.onMouseUp;
}

kCanvasEraser.prototype.setPhoto = function (image, x, y, width, height) {
	this.image = image;
	this.ox = x;
	this.oy = y;
	this.ow = width;
	this.oh = height;

	this.ctx.globalCompositeOperation = CompositeMode.SOURCE_OVER;
	this.ctx.drawImage(image, x, y, width, height);
}

kCanvasEraser.prototype.reset = function () {
	this.ctx.globalCompositeOperation = CompositeMode.SOURCE_OVER;
	this.ctx.drawImage(this.image, this.ox, this.oy, this.ow, this.oh);
}


kCanvasEraser.prototype.onMouseDown = function (event) {
	event.preventDefault();
	this.eraser.erasing = true;
	var x = event.offsetX ? event.offsetX : event.layerX;
	var y = event.offsetY ? event.offsetY : event.layerY;
	this.eraser.eraseStart(x, y);
}

kCanvasEraser.prototype.onMouseMove = function (event) {
	if (!this.eraser.erasing) return;
	var x = event.offsetX ? event.offsetX : event.layerX;
	var y = event.offsetY ? event.offsetY : event.layerY;
	this.eraser.eraseMove(x, y);
}

kCanvasEraser.prototype.onMouseUp = function (event) {
	if (!this.eraser.erasing) return;
	this.eraser.erasing = false;
	var x = event.offsetX ? event.offsetX : event.layerX;
	var y = event.offsetY ? event.offsetY : event.layerY;
	this.eraser.eraseEnd(x, y);
}



kCanvasEraser.prototype.eraseStart = function (x, y) {
	this.ctx.globalCompositeOperation = CompositeMode.DESTINATION_OUT;
	this.ctx.beginPath();
	this.ctx.arc(x, y, this.stroke, 0, Math.PI * 2, true);
	this.ctx.fill();
}

kCanvasEraser.prototype.eraseMove = function (x, y) {
	this.ctx.beginPath();
	this.ctx.arc(x, y, this.stroke, 0, Math.PI * 2, true);
	this.ctx.fill();
}

kCanvasEraser.prototype.eraseEnd = function (x, y) {
	this.ctx.beginPath();
	this.ctx.arc(x, y, this.stroke, 0, Math.PI * 2, true);
	this.ctx.fill();
}