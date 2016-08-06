//分页控件
Cute.ui.pager = Cute.Class.create({
	initialize: function(obj, options) {
		this.element = $(obj);
		this.opt = $.extend({
			pageindex: 0,
			pagesize: 10,
			totalcount: -1,
			pagecount: 0,
			currpagetotal: -1,
			type: "numeric", //text
			total: false,
			skip: false,
			breakpage: 5,
			ajaxload: false,
			ajaxcallback: $.noop
		}, options || {});
		this._init();
		return this;
	},
	_init: function() {
		var _this = this;
		//无totalcount时，且currpagetotal有值时暂只支持type="text"展示模式
		if (this.opt.totalcount == -1 && this.opt.currpagetotal) {
			this.opt.type = "text";
		}
		if (_this.opt.pageindex < 1) _this.opt.pageindex = 1;
		if (_this.opt.totalcount > -1) {
			_this.opt.pagecount = Math.ceil(_this.opt.totalcount / _this.opt.pagesize);
			if (_this.opt.pageindex > _this.opt.pagecount) _this.opt.pageindex = _this.opt.pagecount;
		} else {
			_this.opt.pagecount = 99999;
		}
		_ellipsis = [false, false];
		var _html = [];
		if(_this.opt.pagecount <= 1)
			_this.element.hide();
		else
			_this.element.show();
		if (_this.opt.pagecount > 1 || _this.opt.total)
			_html.push('<div class="pager ' + (_this.opt.type == "numeric" ? "pager_numeric" : "") + '">\n');
		if (_this.opt.total) {
			_html.push('<div class="p_options">');
			_html.push('<span class="p_ptotal">' + _this.opt.pageindex + '页/' + _this.opt.pagecount + '页</span>\n');
			_html.push('<span class="p_total">共' + _this.opt.totalcount + '条</span>\n');
			_html.push('</div>');
		}
		_html.push('<span class="page_contorl">');
		if (_this.opt.type == "text") {
			if (_this.opt.pageindex > 1) {
				if (_this.opt.pagecount < 9999) _html.push('<a class="p_start" href="' + _this._getUrl(1) + '">首页</a>\n');
				_html.push('<a class="prev ir" rel="' + _this._getPageIndex(_this.opt.pageindex - 1) + '" href="' + _this._getUrl(_this.opt.pageindex - 1) + '">上一页</a>\n');
			}
			if (_this.opt.pageindex < _this.opt.pagecount) {
				if (_this.opt.currpagetotal == -1 || _this.opt.currpagetotal >= _this.opt.pagesize) {
					_html.push('<a class="next ir" rel="' + _this._getPageIndex(_this.opt.pageindex + 1) + '" href="' + _this._getUrl(_this.opt.pageindex + 1) + '">下一页</a>\n');
				}
				if (_this.opt.pagecount < 9999) _html.push('<a class="p_end" href="' + _this._getUrl(_this.opt.pagecount) + '">尾页</a>\n');
			}
		}
		if (_this.opt.type == "numeric") {
			if (_this.opt.pageindex > 1) {	//第一页
				_html.push('<a class="prev ir" rel="' + _this._getPageIndex(_this.opt.pageindex - 1) + '" href="' + _this._getUrl(_this.opt.pageindex - 1) + '">上页</a>\n');
			}
			var _page = Cute.Array.unique([1, _this.opt.pagecount, _this.opt.pageindex]);
			var m = Math.floor(_this.opt.breakpage / 2) + 3 - _page.length;
			for (var i = 1; i <= m; i++) {
				_page.push(_this.opt.pageindex + (_this.opt.pageindex + i < _this.opt.pagecount ? i : 0));
				_page.push(_this.opt.pageindex - (_this.opt.pageindex - i < 1 ? 0 : i));
			}
			_page = Cute.Array.unique(_page.sort(function sortNumber(a, b) {
				return a - b;
			}));
			var title = "";
			Cute.log(_page, "_page");
			$.each(_page, function(i, item) {
				if (this.opt.pageindex == item) {
					_html.push('<a class="number current" rel="' + this._getPageIndex(item) + '" href="' + this._getUrl(item) + '">' + item + '</a>\n');
				} else {
					if (item == 1) {
						title = "首页";
					} else if (item == _this.opt.pagecount) {
						title = "尾页";
					} else {
						title = "第" + item + "页";
					}
					Cute.log(this.opt.pageindex, "pageindex");
					Cute.log(this.opt.pagecount, "pagecount");
					Cute.log(this.opt.breakpage, "breakpage");
					Cute.log(item, "item");
					Cute.log(_ellipsis, "_ellipsis");
					if (this.opt.pagecount == item && _ellipsis[1] == false && this.opt.pageindex < this.opt.pagecount - Math.floor(this.opt.breakpage / 2) - 1) {
						_html.push('...\n');
						_ellipsis[1] = true;
					}
					_html.push('<a class="number" rel="' + this._getPageIndex(item) + '" href="' + this._getUrl(item) + '" title="' + title + '">' + item + '</a>\n');
					if (_ellipsis[0] == false && this.opt.pageindex > Math.floor(this.opt.breakpage / 2) + 2) {
						_html.push('...\n');
						_ellipsis[0] = true;
					}
				}
			} .bind(_this));
			if (_this.opt.pageindex < _this.opt.pagecount) {
				_html.push('<a class="next ir" rel="' + _this._getPageIndex(_this.opt.pageindex + 1) + '" href="' + _this._getUrl(_this.opt.pageindex + 1) + '">下页</a>\n');
			}
			_html.push('</span>');
			if (_this.opt.skip) {
				_html.push('<div class="p_skip">跳转到:');
				_html.push('<input type="text" class="p_text" maxlength="8" onclick="this.select()" size="3" name="page" value="' + _this.opt.pageindex + '" />');
				if (this.opt.ajaxload) {
					_html.push('<button class="p_btn">GO</button>');
				} else {
					_html.push('<button class="p_btn" onclick="location.href=\'' + _this._getUrl() + '\'">GO</button>');
				}
				_html.push('</div>');
			}
			Cute.params.set({ "p": _this.opt.pageindex });
		}
		if (_this.opt.pagecount > 1 || _this.opt.total) {
			_html.push('</div>');
		}
		_this.element.html(_html.join(""));
		if (_this.opt.ajaxload) {
			$(".page_contorl a", _this.element).click(function() {
				_this.element.html("数据加载中...");
				_this.opt.pageindex = parseInt($(this).attr("rel"));
				_this.opt.ajaxcallback(_this, _this.opt.pageindex);
				_this._init();
				return false;
			});
		}
	},
	_getUrl: function(page) {
		if (this.opt.ajaxload) {
			return "javascript:void(0);";
		} else {
			var _url = location.pathname + "?";
			if (page && page.constructor == Number) {
				page = this._getPageIndex(page);
				return _url + Cute.params.set({
					p: page
				}).serialize() + location.hash;
			}
			return _url + location.hash;
		}
	},
	_getPageIndex: function(page) {
		if (page && page.constructor == Number) {
			if (page <= 0) page = 1;
			return page;
		}
		return 1;
	}
});