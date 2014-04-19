/**
 * version 1.3.2
 * 
 * date 2013.1.22
 * 
 * @author kisspowpow
 */

function kCalculator() {};
kCalculator.RADIAN = Math.PI / 180;
kCalculator.ANGLE = 180 / Math.PI;

kCalculator.getDistance = function(x1, y1, x2, y2)
{
	var distance = Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
	return distance;
}

kCalculator.getAngle = function(ox, oy, tx, ty)
{
	var degree = 180 / Math.PI;
	var angle;
	var radians;
	var xSide = tx - ox;
	var ySide = ty - oy;
	
	radians = Math.atan2(ySide, xSide);
	angle = radians * degree;
	angle < 0 ? angle += 360 : null;
	return angle;
}

kCalculator.getAnglePoint = function(angle, radius, x, y)
{
	typeof x == "undefined" ? x = 0 : null;
	typeof y == "undefined" ? y = 0 : null;
	var point = {};
	var radian = Math.PI / 180;
	var cx = Math.cos(angle * radian);
	var cy = Math.sin(angle * radian);
	
	point.x = cx * radius + x;
	point.y = cy * radius + y;
	return point;
}

kCalculator.toRadian = function(angle)
{
	var radian = angle * kCalculator.RADIAN;
	return radian;
}

kCalculator.toAngle = function(radian)
{
	var angle = radian * kCalculator.ANGLE;
	return angle;
}