
ko.observableArray.fn.pushAll = function (valuesToPush) {
	var array = this();
	for (var i = 0, j = valuesToPush.length; i < j; i++)
		array.push(valuesToPush[i]);
	this.valueHasMutated();
	return array;
};