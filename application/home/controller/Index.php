<?php
namespace app\home\controller;
use think\Request;
use think\Session;

/**
* 首页
*/
class Index extends Base
{
	
	function index(){
		$data['str'] = 'Hello world!';
		$data['hash'] = gen_password('123123');
		return view('',$data);
	}

	function test () {
        if (empty(cookie('userInfo'))) {
            return oauthRedirect();
        } else {
            dump(cookie('userInfo'));
            return '123';
        }
    }
}