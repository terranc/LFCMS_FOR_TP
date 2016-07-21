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
     * 用于上传图片
     *
     * @param $path
     *
     * @return array ['media_id','url']
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
     * 用于将文章推送至微信服务器
     *
     * @param $data
     *
     * @return array
     */
    public function articlePush ($data) {
        try {
            $article = $this->articleHandle($data);
            $res = $this->material->uploadArticle($article);
            $return = [
                'status' => 0,
                'media_id' => $res->media_id
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
     * 根据media_id删除永久素材
     *
     * @param $media_id
     *
     * @return array
     */
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

    /**
     * 用于图文消息的更新
     *
     * @param string $media_id  已经上传的图文消息的media_id
     * @param array $data
     * @param int $index 多图文消息时，需要更新的图文消息所在位置，从0开始
     *
     * @return array
     */
    public function articleUpdate ($media_id, $data, $index = 0) {
        try {
            $article = $this->articleHandle($data);
            $this->material->updateArticle($media_id, $article, $index);
            $return = [
                'status'   => 0,
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
     * 用于统计已经上传的所有素材的数量
     *
     * @return array
     */
    public function materialCount () {
        try {
            $res = $this->material->stats();

            $return = [
                'voice' => $res->voice_count,
                'video' => $res->video_count,
                'image' => $res->image_count,
                'news'  => $res->news_count
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
     * 图文消息处理
     *
     * @param $data
     * @return array|Article
     */
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

    /**
     * 用于处理图文消息内容中的图片，正则匹配img标签中的图片，并上传至微信服务器后替换
     *
     * @param $content
     * @return mixed
     */
    private function contentHandle ($content) {
        preg_match_all('/src=[\"|\']((.*).(gif|jpg|jpeg|bmp|png))/isU',$content,$match);
        $imageList = array_unique($match [1]);
        foreach ($imageList as $value) {
            $url = $this->articleImagePush($value);

            $content = str_replace($value,$url,$content);
        }

        return $content;
    }

    /**
     * 用于图文消息内部的图片上传，返回url
     *
     * @param $path
     * @return string 图片的url，用于替换
     */
    private function articleImagePush ($path) {
        $res = $this->material->uploadArticleImage($path);
        $url = $res->url;

        return $url;
    }

    /**
     * 用于图文消息的预览,通过option控制是openid还是预览人微信账号
     * option留空时为微信账号，非0时为openid
     *
     * @param $media_id
     * @param $user
     * @param int $option
     * @return array
     */
    public function articlePreview ($media_id, $user, $option = 0) {
        try {
            if ($option == 0) {
                $this->app->broadcast->previewNewsByName($media_id, $user);
            } else {
                $this->app->broadcast->previewNews($media_id, $user);
            }

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