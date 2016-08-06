Do.add('md5', {
    path: '/static/admin/js/plugin/md5.js' + Do.getConfig('js_version'), 
    type:'js'
});
Do.add('flash', {
    path: '/static/admin/js/core/flash.js' + Do.getConfig('js_version'), 
    type:'js'
});
Do.add('select', {
    path: '/static/admin/js/ui/select.js' + Do.getConfig('js_version'), 
    type:'js'
});
Do.add('pager', {
    path: '/static/admin/js/ui/pager.js' + Do.getConfig('js_version'), 
    type:'js'
});
Do.add('editor', {
    path: '/static/admin/js/plugin/ueditor/ueditor.all.js' + Do.getConfig('js_version'), 
    type:'js',
    requires: ['/static/admin/js/plugin/ueditor/ueditor.config.js']
});
Do.add('tabs', {
    path: '/static/admin/js/ui/tabs.js' + Do.getConfig('js_version'), 
    type:'js'
});
Do.add('swfupload', {
    path: '/static/admin/js/plugin/swfupload/swfupload.js,js/plugin/swfupload/swfupload.queue.js' + Do.getConfig('js_version'), 
    type:'js'
});
Do.add('scroll', {
    path: '/static/admin/js/plugin/jquery.jscrollpane.js' + Do.getConfig('js_version'), 
    type:'js',
    requires: ['mousewheel']
});
Do.add('mousewheel', {
    path: '/static/admin/js/plugin/jquery.mousewheel.js' + Do.getConfig('js_version'), 
    type:'js'
});
Do.add('areaselector', {
    path: '/static/admin/js/plugin/areaselector.js' + Do.getConfig('js_version'), 
    type:'js'
});
Do.add('dateselector', {
    path: '/static/admin/js/plugin/dateselector.js' + Do.getConfig('js_version'), 
    type:'js'
});
Do.add('datalazyload', {
    path: '/static/admin/js/plugin/datalazyload.js' + Do.getConfig('js_version'), 
    type:'js',
    requires: ['scrollstop']
});
Do.add('scrollstop', {
    path: '/static/admin/js/plugin/jquery.scrollstop.js' + Do.getConfig('js_version'), 
    type:'js'
});
Do.add('jquery-ui', {
    path: '/static/admin/js/plugin/jquery-ui.js' + Do.getConfig('js_version'), 
    type:'js',
    requires: ['/static/admin/css/jquery-ui.css']
});
Do.add('datepicker', {
    path: '/static/admin/js/plugin/jquery-ui.js' + Do.getConfig('js_version'), 
    type:'js',
    requires: ['/static/admin/css/jquery-ui.css'],
    init:function(){
        $.datepicker.regional['zh-CN'] = {
            closeText: '关闭',
            prevText: '&#x3c;上月',
            nextText: '下月&#x3e;',
            currentText: '今天',
            monthNames: ['一月','二月','三月','四月','五月','六月',
            '七月','八月','九月','十月','十一月','十二月'],
            monthNamesShort:['1月','2月','3月','4月','5月','6月',
            '7月','8月','9月','10月','11月','12月'],
            dayNames: ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'],
            dayNamesShort: ['周日','周一','周二','周三','周四','周五','周六'],
            dayNamesMin: ['日','一','二','三','四','五','六'],
            weekHeader: '周',
            dateFormat: 'yy-mm-dd',
            yearRange: "1950:2020",     // 下拉列表中年份范围  
            firstDay: 0,
            isRTL: false,
            showOtherMonths: true,
            selectOtherMonths: true,
            changeYear: true,
            changeMonth: true,
            showMonthAfterYear: true, 
            showButtonPanel: true,          // 显示按钮面板  
            yearSuffix: ''};
        $.datepicker.setDefaults($.datepicker.regional['zh-CN']);
    }
});
Do.add('animatecolors', {
    path: '/static/admin/js/plugin/jquery.animate-colors.js' + Do.getConfig('js_version'), 
    type:'js'
});
Do.add('copy', {
    path: '/static/admin/js/plugin/ZeroClipboard.js' + Do.getConfig('js_version'),
    type:'js'
});
Do.add('waypoints',{
    path: '/static/admin/js/plugin/waypoints.js' + Do.getConfig('js_version'),
    type:'js'
});
Do.add('waypoints-sticky',{
    path: '/static/admin/js/plugin/waypoints-sticky.js' + Do.getConfig('js_version'),
    type:'js',
    requires: ['waypoints']
});
Do.add('placeholder',{
    path: '/static/admin/js/plugin/jquery.placeholder.js' + Do.getConfig('js_version'),
    type:'js',
    requires: ['/static/admin/css/jquery.placeholder.css']
});
Do.add('validator',{
    path:'/static/admin/js/plugin/validator/jquery.validator.js', 
    type:'js',
    init: function(){
        Cute.include('/static/admin/js/plugin/validator/zh-CN.js');
    }
});
Do.add('autoTextarea', {
    path: '/static/admin/js/plugin/jquery.autoTextarea.js' + Do.getConfig('js_version'), 
    type:'js'
});