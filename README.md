# scur
scur窗口滚动导航样式
使用方式：
 scur.scroll({
 tabNav: 'tabNav',//导航按钮父元素
 activeClass: 'active',//导航按钮选中样式
 fixedClass: 'fixedTop',//导航按钮组固定顶部
 noneClass: 'noneInTop'//导航按钮组隐藏顶部
 hideClass: 'goBottomHideInTop',//导航按钮组隐藏底部
 hideClassSimple: 'goBottomHideInBottom',//导航按钮组隐藏底部（简单模式）
 targetArr: 'g-body-main-con>div',//滚动对应区块组
 relativeElement: 'relativeElement'//相对左/右侧元素滚动/固定
 });
