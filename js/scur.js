/**
 * Created by GaoWei on 2017/4/29.
 */
/* ʹ�÷�ʽ��
 scur.scroll({
 tabNav: 'tabNav',//������ť��Ԫ��
 activeClass: 'active',//������ťѡ����ʽ
 fixedClass: 'fixedTop',//������ť��̶�����
 noneClass: 'noneInTop'//������ť�����ض���
 hideClass: 'goBottomHideInTop',//������ť�����صײ�
 hideClassSimple: 'goBottomHideInBottom',//������ť�����صײ�����ģʽ��
 targetArr: 'g-body-main-con>div',//������Ӧ������
 relativeElement: 'relativeElement'//�����/�Ҳ�Ԫ�ع���/�̶�
 });
 */
var scur = {
    scroll: function (arg) {
        var tabNav = $(this.matchingSelector(arg.tabNav));
        var liArr = tabNav.find('li');
        var _this = this;
        // ������ť���ѡ����ʽ�л�ͬʱҳ���������Ӧ����
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
        // �����������̶�
        if (arg.fixedClass != undefined && arg.fixedClass != '') {
            this.windowScroll({tabNav: tabNav, navTop: tabNav.offset().top - tabNav[0].offsetTop, fixedClass: arg.fixedClass});
        }
        // ���������׸���
        if (arg.relativeElement != undefined && arg.relativeElement != '') {
            var relativeElement = $(this.matchingSelector(arg.relativeElement));
            var relativeElementTop = relativeElement.offset().top;
            var relativeElementH = relativeElement.height();
            var wH = $(window).height();
            var lessH = relativeElementTop + relativeElementH - wH;
            this.windowScroll({tabNav: tabNav, lessH: lessH});
        }
        // ��������������
        if (arg.noneClass != undefined && arg.noneClass != '') {
            this.windowScroll({tabNav: tabNav, noneClass: arg.noneClass});
        }
        // ������/�±ߵ������¹����أ��Ϲ�����
        if (arg.hideClass != undefined && arg.hideClass != '') {
            this.windowScroll({
                tabNav: tabNav,
                oldTop: 0,
                navTop: tabNav.offset().top,
                hideClass: arg.hideClass
            });
        }
        // ����/�±ߵ������¹����أ��Ϲ�����
        if (arg.hideClassSimple != undefined && arg.hideClassSimple != '') {
            this.windowScroll({tabNav: tabNav, oldTop: 0, hideClassSimple: arg.hideClassSimple});
        }
        // ���ڹ�����������ť��Ӧ������������ѡ����ʽ
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
            // ��ȡ�������Ļ�������
            var sclH = $(this).scrollTop();
            // ���Ҫ�����̶�������
            if (arg.fixedClass) {
                // �������Ļ���������ڵ��ڶ�λԪ�ؾ�������������ľ���͹̶�����֮�Ͳ��̶�
                if (sclH > arg.navTop) {
                    arg.tabNav.addClass(arg.fixedClass);
                } else {
                    arg.tabNav.removeClass(arg.fixedClass);
                }
            }
            // ���Ҫ���������׸���
            if (arg.lessH) {
                // ���ڹ����������(��Ԫ�ظ�+��Ԫ�ص�������-���ڸ߶�)�Ͷ�̬���ù̶�Ԫ�صĸ�topֵ����֮������Ϊ0
                if ((sclH > arg.lessH)) {
                    arg.tabNav.css('top', -(sclH - arg.lessH) + 'px');
                } else {
                    arg.tabNav.css('top', '0');
                }
            }
            // ���Ҫ�������ص�����
            if (arg.noneClass) {
                if (sclH > 50) {
                    arg.tabNav.removeClass(arg.noneClass);
                } else {
                    arg.tabNav.addClass(arg.noneClass);
                }
            }
            // ���Ҫ�»����ز����ߵ�����
            if (arg.hideClass) {
                if (sclH > arg.oldTop && sclH > arg.navTop) {
                    arg.tabNav.addClass(arg.hideClass);
                    arg.oldTop = sclH;
                } else if (sclH < arg.oldTop) {
                    arg.tabNav.removeClass(arg.hideClass);
                    arg.oldTop = sclH;
                }
            }
            //���Ҫ�»��������ߵ�����
            if (arg.hideClassSimple) {
                if (sclH > arg.oldTop) {
                    arg.tabNav.addClass(arg.hideClassSimple);
                    arg.oldTop = sclH;
                } else if (sclH < arg.oldTop) {
                    arg.tabNav.removeClass(arg.hideClassSimple);
                    arg.oldTop = sclH;
                }
            }
            // ���Ҫ��������ť���Ӷ�Ӧ����ѡ����ʽ
            if (arg.targetArr) {
                var otpArr = [];
                arg.targetArr.each(function () {
                    otpArr[$(this).index()] = parseInt($(this).height() + this.offsetTop);
                });
                arg.liArr.eq(getIndex(sclH + arg.coverHeight, otpArr)).addClass(arg.activeClass).siblings().removeClass(arg.activeClass);
            }
        });
        function getIndex(sclH, otpArr) {//������������λ�ã�ɸѡ���ĸ����ε�����ť��ѡ��
            for (var i = 0; i < otpArr.length; i++) {
                if (sclH < otpArr[i]) {
                    return i;
                }
            }
        }
    },
    matchingSelector: function (selector) { // ��������navԪ�غ��ӽ���ѡ��������
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