/*!
 * jQuery toDictionary() plugin
 *
 * Version 1.2 (11 Apr 2011)
 *
 * Copyright (c) 2011 Robert Koritnik
 * Licensed under the terms of the MIT license
 * http://www.opensource.org/licenses/mit-license.php
 */

(function ($) {

	// #region String.prototype.format
	// add String prototype format function if it doesn't yet exist
	if ($.isFunction(String.prototype.format) === false) {
		String.prototype.format = function () {
			var s = this;
			var i = arguments.length;
			while (i--) {
				s = s.replace(new RegExp("\\{" + i + "\\}", "gim"), arguments[i]);
			}
			return s;
		};
	}
	// #endregion

	// #region Date.prototype.toISOString
	// add Date prototype toISOString function if it doesn't yet exist
	if ($.isFunction(Date.prototype.toISOString) === false) {
		Date.prototype.toISOString = function () {
			var pad = function (n, places) {
				n = n.toString();
				for (var i = n.length; i < places; i++) {
					n = "0" + n;
				}
				return n;
			};
			var d = this;
			return "{0}-{1}-{2}T{3}:{4}:{5}.{6}Z".format(
                d.getUTCFullYear(),
                pad(d.getUTCMonth() + 1, 2),
                pad(d.getUTCDate(), 2),
                pad(d.getUTCHours(), 2),
                pad(d.getUTCMinutes(), 2),
                pad(d.getUTCSeconds(), 2),
                pad(d.getUTCMilliseconds(), 3)
            );
		};
	}
	// #endregion

	var _flatten = function (input, output, prefix, includeNulls) {
		if ($.isPlainObject(input)) {
			for (var p in input) {
				if (includeNulls === true || typeof (input[p]) !== "undefined" && input[p] !== null) {
					_flatten(input[p], output, prefix.length > 0 ? prefix + "." + p : p, includeNulls);
				}
			}
		}
		else {
			if ($.isArray(input)) {
				$.each(input, function (index, value) {
					_flatten(value, output, "{0}[{1}]".format(prefix, index));
				});
				return;
			}
			if (!$.isFunction(input)) {
				if (input instanceof Date) {
					output.push({ name: prefix, value: input.toISOString() });
				}
				else {
					var val = typeof (input);
					switch (val) {
						case "boolean":
						case "number":
							val = input;
							break;
						case "object":
							// this property is null, because non-null objects are evaluated in first if branch
							if (includeNulls !== true) {
								return;
							}
						default:
							val = input || "";
					}
					output.push({ name: prefix, value: val });
				}
			}
		}
	};

	$.extend({
		toDictionary: function (data, prefix, includeNulls) {
			/// <summary>Flattens an arbitrary JSON object to a dictionary that Asp.net MVC default model binder understands.</summary>
			/// <param name="data" type="Object">Can either be a JSON object or a function that returns one.</data>
			/// <param name="prefix" type="String" Optional="true">Provide this parameter when you want the output names to be prefixed by something (ie. when flattening simple values).</param>
			/// <param name="includeNulls" type="Boolean" Optional="true">Set this to 'true' when you want null valued properties to be included in result (default is 'false').</param>

			// get data first if provided parameter is a function
			data = $.isFunction(data) ? data.call() : data;

			// is second argument "prefix" or "includeNulls"
			if (arguments.length === 2 && typeof (prefix) === "boolean") {
				includeNulls = prefix;
				prefix = "";
			}

			// set "includeNulls" default
			includeNulls = typeof (includeNulls) === "boolean" ? includeNulls : false;

			var result = [];
			_flatten(data, result, prefix || "", includeNulls);

			return result;
		}
	});
})(jQuery);