<?php
namespace app\home\controller;
use app\common\wechat\Material;

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

    public function articleDemo () {
        $data = [
            'title' => 'test1',
            'thumb_media_id' => 'lvu-Y-bENiM0bLMLnFpoX9DLbkDrezAVqN_VawYpt3o',
            'author' => 'DeadSoul',
            'digest' => 'This is a test message',
            'show_cover_pic' => 0,
            'content' => '<p style="padding-left: 30px;">因为urlopen返回的是一个文件对象，所以我们可以通过read()等文件读取方法来操作里面的内容</p>
<p style="padding-left: 30px;">除此之外，urllib提供了三个附加方法geturl(),getcode().info()</p>
<p style="padding-left: 30px;">geturl()：这个方法返回的是最后所访问的url，比如</p><img src="public/upload/20160720/571ee9e36a7df678b2d5ff8bdaa768b1.jpg"><img src="public/upload/20160720/fa3a62889c9fa66060115caf4666d97f.jpg">',
            'content_source_url' => 'http://www.baidu.com'
        ];


        $material = new Material();
        $res = $material->articlePush($data);
        //多图文消息用法$res = $material->articlePush([$data,$data,.....]);

        dump($res);
        return '';
    }
}