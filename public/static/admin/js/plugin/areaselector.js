(function(){
	Cute.plugin.areaSelector = Cute.Class.create({
		initialize: function(data, pobj, cobj, aobj, options) {
			options = options || {};
			if (arguments.length == 0) return false;
			var pobj = $(pobj);
			var cobj = $(cobj);
			var aobj = $(aobj);
			var n = pobj[0].options.length;
			$.each(data, function(i, item) {
				pobj[0].options[n] = new Option(item.name, item.id);
				n++;
			});
			if (cobj.length > 0) {
				pobj.change(function() {
					if (this.value == "") {
						cobj.hide();
						aobj.hide();
						return false;
					}
					cobj.find("option[value!=]").remove();
					cobj.toggle(data['p_'+this.value]['city'] != null);
					var n = cobj[0].options.length;
					$.each(data['p_'+this.value]['city'], function(i, item) {
						cobj[0].options[n] = new Option(item.name, item.id);
						n++;
					});
					if (options.value && options.value.city_id && parseInt(options.value.city_id) > 0) {
						cobj.find("option[value=" + options.value.city_id + "]")[0].selected = true;
					}else{
						cobj.find("option[value!=]:first")[0].selected = true;
					}
					options.value.city_id = null;
					cobj.change();
				});
				if (aobj.length > 0) {
				 	cobj.change(function() {
				 		aobj.find("option[value!=]").remove();
				 		aobj.toggle(data['p_'+pobj.val()]['city']['c_'+this.value]['area'] != null);
						var n = aobj[0].options.length;
						$.each(data['p_'+pobj.val()]['city']['c_'+this.value]['area'], function(i, item) {
							aobj[0].options[n] = new Option(item.name, item.id);
							n++;
						});
						if (options.value && options.value.area_id && parseInt(options.value.area_id) > 0){
							aobj.find("option[value=" + options.value.area_id + "]")[0].selected = true;
						}else{
							aobj.find("option[value!=]:first")[0].selected = true;
						}
						options.value.area_id = null;
						aobj.change();
				 	});
				}
			}
			if (options.value && options.value.province_id && parseInt(options.value.province_id) > 0) {
				pobj.find("option[value=" + options.value.province_id + "]")[0].selected = true;
				pobj.change();
			}
		}
	});
})();