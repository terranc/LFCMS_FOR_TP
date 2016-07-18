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
        if (empty(session('userInfo'))) {
            return oauthRedirect();
        } else {
            dump(session('userInfo'));
            return '123';
        }
    }
}