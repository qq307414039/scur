/**
 * Created by GaoWei on 2017/4/29.
 */
/* 使用方式：
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
 */
var scur = {
    scroll: function (arg) {
        var tabNav = $(this.matchingSelector(arg.tabNav));
        var liArr = tabNav.find('li');
        var _this = this;
        // 导航按钮点击选中样式切换同时页面滚动到对应区块
        if (arg.activeClass != undefined && arg.activeClass != '') {
            liArr.click(function () {
                $(this).addClass(arg.activeClass).siblings().removeClass(arg.activeClass);
                var index = $(this).index();
                $('html, body').stop().animate({
                    scrollTop: $(_this.matchingSelector(arg.targetArr)).eq(index).offset().top - tabNav[0].offsetHeight + 'px',
                    easing: 'swing'
                }, 666, function () {
                });
            });
        }
        // 导航条到顶固定
        if (arg.fixedClass != undefined && arg.fixedClass != '') {
            this.windowScroll({tabNav: tabNav, navTop: tabNav.offset().top - tabNav[0].offsetTop, fixedClass: arg.fixedClass});
        }
        // 导航条触底跟随
        if (arg.relativeElement != undefined && arg.relativeElement != '') {
            var relativeElement = $(this.matchingSelector(arg.relativeElement));
            var relativeElementTop = relativeElement.offset().top;
            var relativeElementH = relativeElement.height();
            var wH = $(window).height();
            var lessH = relativeElementTop + relativeElementH - wH;
            this.windowScroll({tabNav: tabNav, lessH: lessH});
        }
        // 导航条到顶隐藏
        if (arg.noneClass != undefined && arg.noneClass != '') {
            this.windowScroll({tabNav: tabNav, noneClass: arg.noneClass});
        }
        // 不贴上/下边导航条下滚隐藏，上滚显现
        if (arg.hideClass != undefined && arg.hideClass != '') {
            this.windowScroll({
                tabNav: tabNav,
                oldTop: 0,
                navTop: tabNav.offset().top,
                hideClass: arg.hideClass
            });
        }
        // 贴上/下边导航条下滚隐藏，上滚显现
        if (arg.hideClassSimple != undefined && arg.hideClassSimple != '') {
            this.windowScroll({tabNav: tabNav, oldTop: 0, hideClassSimple: arg.hideClassSimple});
        }
        // 窗口滚动导航条按钮对应区块内容增加选中样式
        if (arg.targetArr != undefined && arg.targetArr != '') {
            this.windowScroll({
                liArr: liArr,
                targetArr: $(this.matchingSelector(arg.targetArr)),
                activeClass: arg.activeClass,
                coverHeight: tabNav[0].offsetHeight
            });
        }
    },
    windowScroll: function (arg) {
        $(window).scroll(function () {
            // 获取滚动条的滑动距离
            var sclH = $(this).scrollTop();
            // 如果要到顶固定导航条
            if (arg.fixedClass) {
                // 滚动条的滑动距离大于等于定位元素距离浏览器顶部的距离就固定，反之就不固定
                if (sclH > arg.navTop) {
                    arg.tabNav.addClass(arg.fixedClass);
                } else {
                    arg.tabNav.removeClass(arg.fixedClass);
                }
            }
            // 如果要导航条触底跟随
            if (arg.lessH) {
                // 窗口滚动距离大于(父元素高+父元素到顶距离-窗口高度)就动态设置固定元素的负top值，反之则设置为0
                if ((sclH > arg.lessH)) {
                    arg.tabNav.css('top', -(sclH - arg.lessH) + 'px');
                } else {
                    arg.tabNav.css('top', '0');
                }
            }
            // 如果要到顶隐藏导航条
            if (arg.noneClass) {
                if (sclH > 50) {
                    arg.tabNav.removeClass(arg.noneClass);
                } else {
                    arg.tabNav.addClass(arg.noneClass);
                }
            }
            // 如果要下滑隐藏不贴边导航条
            if (arg.hideClass) {
                if (sclH > arg.oldTop && sclH > arg.navTop) {
                    arg.tabNav.addClass(arg.hideClass);
                    arg.oldTop = sclH;
                } else if (sclH < arg.oldTop) {
                    arg.tabNav.removeClass(arg.hideClass);
                    arg.oldTop = sclH;
                }
            }
            //如果要下滑隐藏贴边导航条
            if (arg.hideClassSimple) {
                if (sclH > arg.oldTop) {
                    arg.tabNav.addClass(arg.hideClassSimple);
                    arg.oldTop = sclH;
                } else if (sclH < arg.oldTop) {
                    arg.tabNav.removeClass(arg.hideClassSimple);
                    arg.oldTop = sclH;
                }
            }
            // 如果要导航条按钮增加对应区块选中样式
            if (arg.targetArr) {
                var otpArr = [];
                arg.targetArr.each(function () {
                    otpArr[$(this).index()] = parseInt($(this).height() + this.offsetTop);
                });
                arg.liArr.eq(getIndex(sclH + arg.coverHeight, otpArr)).addClass(arg.activeClass).siblings().removeClass(arg.activeClass);
            }
        });
        function getIndex(sclH, otpArr) {//根据容器所在位置，筛选出哪个批次导航按钮被选中
            for (var i = 0; i < otpArr.length; i++) {
                if (sclH < otpArr[i]) {
                    return i;
                }
            }
        }
    },
    matchingSelector: function (selector) { // 传进来的nav元素盒子进行选择器适配
        selector = $.trim(selector);
        if (selector.slice(0, 1) == '.' || selector.slice(0, 1) == '#') {
            selector = selector;
        } else if ($('#' + selector).length > 0) {
            selector = '#' + selector;
        } else if ($('.' + selector).length > 0) {
            selector = '.' + selector;
        }
        return selector;
    }
};