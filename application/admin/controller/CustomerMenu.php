<?php
/**
 * Created by PhpStorm.
 * User: DeadSoul
 * Date: 2016/7/19
 */

namespace app\admin\controller;

use EasyWeChat\Foundation\Application;

/**
 * Class CustomerMenu
 * @package app\admin\controller
 * 微信菜单相关操作
 */
class CustomerMenu {
    private $buttons = [];

    private $fatherIdList = [];

    private $location = [0,0,0];

    private $typeList = [
        1 => 'click',
        2 => 'view',
        3 => 'scancode_push',
        4 => 'scancode_waitmsg',
        5 => 'pic_sysphoto',
        6 => 'pic_photo_or_album',
        7 => 'pic_weixin',
        8 => 'location_select',
    ];

    /*数据库格式
    DROP TABLE IF EXISTS `menu`;
    CREATE TABLE `menu` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `menuName` varchar(20) CHARACTER SET utf8 NOT NULL,
    `menuType` varchar(2) CHARACTER SET utf8 DEFAULT NULL COMMENT '一级菜单可留空，二级必须\r\n1:click\r\n2:view\r\n3:scancode_push\r\n4:scancode_waitmsg\r\n5:pic_sysphoto\r\n6:pic_photo_or_album\r\n7:pic_weixin\r\n8:locaiton_select',
    `menuContent` varchar(255) CHARACTER SET utf8 DEFAULT NULL COMMENT '一级菜单可留空，二级必填\r\nview时候为url其他时候为key',
    `fatherNode` int(11) NOT NULL DEFAULT '0' COMMENT '为0时为一级目录，否则为二级目录',
    `sort` int(11) NOT NULL DEFAULT '0' COMMENT '排序，从大到小\r\n一级菜单，从左到右\r\n二级菜单，从上到下',
    PRIMARY KEY (`id`)
    )*/

    /**
     * @return string
     * 调用demo，需要推送的idList为示例，可以根据前端checkbox获取id列表
     */
    public function menuPush () {
        $this->menuGrip([1,2,3,4,5,6,7,8,9,10,11,12]);

        $config = config('wechat');
        $app = new Application($config);
        $menu = $app->menu;
        dump($menu->add($this->buttons));

        return '';
    }

    /**
     * @param $idList
     * 需要推送的id列表
     * @return bool True
     * 数据库拉取所有菜单信息，并且根据给定id列表进行匹配
     */
    private function menuGrip ($idList) {
        $fatherNodeList = db('menu')->where('fatherNode = 0')->order('sort desc')->select();

        $i = 0;
        foreach ($fatherNodeList as $key => $value) {
            $menuId = $value ['id'];

            if ($i > 2) {    //当数量大于一级菜单需求时，跳出循环
                break;
            }

            if (in_array($menuId, $idList)) {
                $this->buttons [$i] = $this->menuPackage($value);
                $this->fatherIdList [$value ['id']] = $i;
            }
            $i++;
        }

        $childNodeList = db('menu')->where('fatherNode != 0')->order('sort desc')->select();

        foreach ($childNodeList as $key => $value) {
            $menuId = $value ['id'];
            $fatherId = $value ['fatherNode'];

            if (in_array($menuId, $idList) && array_key_exists($fatherId, $this->fatherIdList)) {

                $this->childPackage($value);
            }
        }
        return true;
    }

    /**
     * @param $data
     * @return array
     * 组装成合格的菜单
     */
    private function menuPackage ($data) {
        $package = [
            'type' => $this->typeList [$data ['menuType']],
            'name' => $data ['menuName']
        ];
        if ($data ['menuType'] == 2) {
            $package ['url'] = $data ['menuContent'];
        } else {
            $package ['key'] = $data ['menuContent'];
        }
        return $package;
    }

    /**
     * @param $data
     * @return bool
     * 封装二级菜单
     */
    private function childPackage ($data) {
        $pos = $this->fatherIdList [$data ['fatherNode']];

        $location = $this->location [$pos];

        if ($location > 4) {
            return true;
        }

        if ($location == 0) {
            $fatherName = $this->buttons [$pos] ['name'];
            $this->buttons [$pos] = [
                'name'       => $fatherName,
                'sub_button' => [$this->menuPackage($data)],
            ];
        } else {
            $this->buttons [$pos] ['sub_button'] [$location] = $this->menuPackage($data);
        }
        $this->location [$pos] += 1;
        return true;
    }
}