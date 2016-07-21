<?php
/**
 * Created by PhpStorm.
 * User: DeadSoul
 * Date: 2016/7/21
 */

namespace app\common\wechat;

use EasyWeChat\Core\Exception;
use EasyWeChat\Foundation\Application;
use EasyWeChat\Message\Article;

Class Material {

    private $app;
    private $material;

    public function __construct () {
        $config = config('wechat');
        $this->app = new Application($config);
        $this->material = $this->app->material;
    }

    /**
     * @param $path
     * @return array ['media_id','url']
     * 用于上传图片
     */
    public function imagePush ($path) {
        try {
            $res = $this->material->uploadImage($path);

            $return = [
                'status'   => 0,
                'media_id' => $res->media_id,
                'url'      => $res->url
            ];

        } catch (Exception $e) {
            $errCode = $e->getCode();
            $error   = new Error($errCode);

            $return = [
                'status'  => $errCode,
                'message' => $error->getMsg()
            ];
        }

        return $return;
    }

    /**
     * @param $data
     * @return array
     * 符合格式的数组
     */
    public function articlePush ($data) {
        $article = $this->articleHandle($data);
        $res = $this->material->uploadArticle($article);
        $return = [
            'status'   => 0,
            'media_id' => $res->media_id
        ];


        return $return;
    }

    public function materialDel ($media_id) {
        try {
            $this->material->delete($media_id);

            $return = ['status' => 0];
        } catch (Exception $e) {
            $errCode = $e->getCode();
            $error   = new Error($errCode);

            $return = [
                'status'  => $errCode,
                'message' => $error->getMsg()
            ];
        }

        return $return;
    }

    private function articleHandle ($data) {
        if (!empty($data ['title'])) {
            $data ['content'] = $this->contentHandle($data ['content']);

            return new Article($data);
        } else {
            $i = 0;
            $return = [];
            foreach ($data as $value) {
                $value ['content'] = $this->contentHandle($value ['content']);
                $return [$i] = new Article($value);
                $i++;
            }
            return $return;
        }
    }

    private function contentHandle ($content) {
        preg_match_all('/src=[\"|\']((.*).(gif|jpg|jpeg|bmp|png))/isU',$content,$match);
        $imageList = array_unique($match [1]);
        foreach ($imageList as $value) {
            $url = $this->articleImagePush($value);

            $content = str_replace($value,$url,$content);
        }

        return $content;
    }

    private function articleImagePush ($path) {
        $res = $this->material->uploadArticleImage($path);
        $url = $res->url;

        return $url;
    }

    public function articlePreview ($media_id, $weChatAccount) {
        try {
            $this->app->broadcast->previewNewsByName($media_id, $weChatAccount);

            $return = ['status' => 0];
        } catch (Exception $e) {
            $errCode = $e->getCode();
            $error   = new Error($errCode);

            $return = [
                'status'  => $errCode,
                'message' => $error->getMsg()
            ];
        }

        return $return;
    }

}