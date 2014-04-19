/**
 * version 1.0.0
 * 
 * date 2013.1.28
 * 
 * @author kisspowpow
 */


function kRandomizer() {

}

kRandomizer.random = function (number) {
	return number * Math.random();
}

kRandomizer.randomInt = function (number) {
	return Math.floor(number * Math.random());
}

kRandomizer.lotto = function (times, from, end) {
	var total = end - from + 1;
	if (times > total) {
		return [];
	}
	
	var originalArray = [];
	for (var i = from; i <= end; i++) {
		originalArray.push(i);
	}
	
	var resultArray = [];
	for (var j = 0; j < times; j++) {
		var getNumber = Math.floor(Math.random() * originalArray.length);
		resultArray.push(originalArray[getNumber]);
		originalArray.splice(getNumber, 1);
	}
	
	return resultArray;
}

kRandomizer.arrayRandom = function (array) {
	var tempArray = [];
	var resultArray = [];
	tempArray = array.concat();
	for (var i = 0; i < tempArray.length; i++) {
		var getNumber = Math.floor(Math.random() * originalArray.length);
		resultArray.push(tempArray[getNumber]);
		tempArray.splice(getNumber, 1);
	}

	return resultArray;
}