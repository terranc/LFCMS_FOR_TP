<?php
/**
 * User: DeadSoul
 * Date: 2016/7/18
 */

namespace app\home\controller;

use EasyWeChat\Foundation\Application;
use think\Controller;

class Oauth extends Controller{

    public function oauthLogin () {
        //多公众号解决方案，根据token调取不同配置文件，进行授权回调
        $config = config('wechat');
        $app = new Application($config);

        $oauth = $app->oauth;
        $user  = $oauth->user();
        $user  = $user->toArray();

        cookie('userInfo',$user);

        if (cookie('callback_url')) {
            $this->redirect(cookie('callback_url'));
        } else {
            $this->redirect('Index/index'); //如果回调url为空，自动跳转至主页
        }
    }

}