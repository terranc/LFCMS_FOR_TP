(function($){
	//日期联动菜单
	Cute.plugin.dateSelector = Cute.Class.create({
		initialize: function(yobj, mobj, dobj, options) {
			options = options || {};
			if (arguments.length == 0) return false;
			var y = $(yobj),
				m = $(mobj),
				d = $(dobj);
			if (y.length == 0) return;
			var newDate = new Date();
			var n = y[0].options.length;
			for (var i = n; i < 81 + n; i++) {
				y[0].options[i] = new Option(newDate.getFullYear() - 60 + i, newDate.getFullYear() - 60 + i);
			}
			if (arguments.length > 1) {
				if (m.length == 0) return;
				var n = m[0].options.length;
				for (var i = n,x=1; i < 12 + n; i++,x++) {
					m[0].options[i] = new Option(('0' + x).substr(-2),x);
				}
				y.change(function() { 
					if(this.value == '' || this.value == 0){
						m.find('option[value=0]')[0].selected = true;
					}
					m.change(); 
				});
				if (arguments.length > 2) {
					if (d.length == 0) return;
					m.change(function() {
						n = d.find('option[value=0]').length;
						remove_list = [];
						for (var i = n,x=1; i < 31 + n; i++,x++) {
							if(x <= new Date(y.val(), m.val(), 0).getDate()){
								if(d[0].options[i] == undefined)
									d[0].options[i] = new Option(('0' + x).substr(-2), x);
							}else{
								remove_list.push(i);
							}
						}
						for(var i = remove_list.length - 1; i>=0; i--){
							d[0].options.remove(remove_list[i]);
						}
						if(m.val() == '' || m.val() == 0){
							d.find('option[value=0]')[0].selected = true;
						}
						d.change();
					});
				}
			}
			if (options.value) {
				setTimeout(function() {
					y.find("option[value=" + options.value.year + "]").prop("selected", true).end().change();
					m.val(options.value.month).change();
					d.val(options.value.day).change();
				}, 0);
			}
		}
	});
})(jQuery);