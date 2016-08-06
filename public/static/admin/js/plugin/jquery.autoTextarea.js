(function($) {
	$.fn.extend({
		autoTextarea: function(options) {
			var that = this;
			this._options = {
				minHeight: 0,
				maxHeight: 1000
			}
			this.init = function() {
				$(this).on(("\v"=="v" ? 'propertychange': 'input') + ' focus', this.resetHeight);
			}
			this.resetHeight = function() {
				for (var p in options) {
					that._options[p] = options[p];
				}
				if (that._options.minHeight == 0) {
					that._options.minHeight = parseFloat($(this).outerHeight());
				}
				for (var p in that._options) {
					if ($(this).attr(p) == null) {
						$(this).attr(p, that._options[p]);
					}
				}
				var _minHeight = parseFloat($(this).attr("minHeight"));
				var _maxHeight = parseFloat($(this).attr("maxHeight"));
				if (!$.browser.msie) {
					$(this).css('height',0);
				}
				var h = parseFloat(this.scrollHeight);
				h = h < _minHeight ? _minHeight :
					h > _maxHeight ? _maxHeight : h;
				$(this).css('height',h).scrollTop(h);
				if (h >= _maxHeight) {
					$(this).css("overflow-y", "scroll");
				} else {
					$(this).css("overflow-y", "hidden");
				}
			}
			this.init();
			return this;
		}
	});
})(jQuery);