Do(function(){
	$(document).on('click.uc', '.confirm', function(e){
		if(!confirm($(this).attr('title'))){
			e.preventDefault();
			e.stopPropagation();
		}
	}).on('click.uc', '.check_all:checkbox', function(e){
		$(this).closest($(this).data('wrap') || 'form').find(':checkbox:not(:disabled)').not(this).prop('checked', this.checked);
		if($(this).is(':checked')){
			$(':checkbox').next('i').addClass('fa-check');
		}else{
			$(':checkbox').next('i').removeClass('fa-check');
		};
	}).on('change','input.checkbox',function(){
		$(this).closest('label.checkbox').toggleClass('checked', $(this).is(':checked'));
	});
	if(!navigator.maxTouchPoints) {
		Do('datepicker', function(){
			$( ".text_date").datepicker($(this).attr('data-options'));
		});
    }
	$('.sidebar .menu dt').on('click', function(e){
		if($(this).hasClass('expand')){
			// $(this).next('dd').slideUp(function(){
				$(this).removeClass('expand');
			// });
		}else{
			// $(this).next('dd').slideDown(function(){
				$(this).addClass('expand');
			// });
		}
	});
	$('.tabs a').on('click', function(){
		if($(this).data('link')) return true;
		$(this).addClass('curr').siblings('a').removeClass('curr');
		location.hash = '#tab_' + $(this).index();
		$('.tabs_content').eq($(this).index()).show().siblings('.tabs_content').hide();
	});
	if(location.hash){
		$('.tabs a').eq(location.hash.replace('#tab_','')).click();
	}
	var form_submit = function(e){
		e && e.preventDefault();
		var url, data, method, options;
		var that = this;
		var form = $(this);
		if($(this).hasClass('confirm')) {
			e.stopPropagation();
            if(!confirm($(this).attr('title') || '确认要执行该操作吗?')){
                return false;
            }
        }
		if(form.get(0).nodeName=='A'){
			method = 'get';
			url = form.attr('href');
		}else{
	        url = form.get(0).action;
	        data = form.serialize();
	        method = form.get(0).method.toLowerCase();
	        enctype = form.get(0).enctype;
	        if(enctype == 'multipart/form-data'){
	        	options = {
	        		processData: false,
	        		contentType: false
	        	};
	        	data = new FormData(form.get(0));
	        }
        }
        return Cute.api[method](url, data, function(json){
        	if(json.status > 0){
        		new Cute.ui.dialog().suggest(json.info);
        		setTimeout(function(){
        			location.href = json.url;
        		},1500);
        	}else{
        		new Cute.ui.dialog().alert(json.info);
        	}
        },false,true,options || {});
	};
	$('a.ajax_form').on('click', form_submit);
    $(document).on('submit','form.ajax_form:not(.nice-validator[novalidate])', form_submit);
    $('form:not([novalidate])').validator({
    	timely: 2,
        valid: function(form) {
        	var me = this;
        	if($(form).data('preventDefault')){
        		return false;
        	}
        	me.holdSubmit();
            if($(form).hasClass('ajax_form')){
                form_submit.call(form).then(function(json){
                	if(json.status < 1)
        				me.holdSubmit(false);
                });
            }else{
            	form.submit();
            }
        }
    }).trigger("showmsg", ["tip"]);
    var loadingLite = $('<div class="loading_lite" id="loading-lite" style="display:none">加载中...</div>').appendTo(document.body);
	$(document).ajaxSend(function(e, xhr, settings, exception) {
	    if (settings.type == "POST") {
	        loadingLite.html('提交中...').addClass("loading_lite_post").html('提交中...');
	        this.mask = this.mask || $('<div class="mask_layout"></div>').appendTo(document.body);
	    }
	    loadingLite.show();
	}).ajaxSuccess(function(e, xhr, settings, exception) {
	    if (this.mask) {
	        this.mask.remove();
	        this.mask = null;
	    }
	    loadingLite.html('加载中...').removeClass("loading_lite_post").hide();
	}).ajaxError(function(e, xhr, settings, exception) {
	    if (this.mask) {
	        this.mask.remove();
	        this.mask = null;
	    }
	    loadingLite.html('发生异常').show().delay(3000).fadeOut(1500, function(){
	        $(this).html('加载中...');
	    });
	});

});