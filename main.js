$(function(){

    var beforePos = 0;//スクロールの値の比較用の設定

//スクロール途中でヘッダーが消え、上にスクロールすると復活する設定を関数にまとめる
function ScrollAnime() {
    var elemTop = $('#about').offset().top;//#area-2の位置まできたら
	var scroll = $(window).scrollTop();
    //ヘッダーの出し入れをする
    if(scroll == beforePos) {
		//IE11対策で処理を入れない
    }else if(elemTop > scroll || 0 > scroll - beforePos){
		//ヘッダーが上から出現する
		$('#header').removeClass('UpMove');	//#headerにUpMoveというクラス名を除き
		$('#header').addClass('DownMove');//#headerにDownMoveのクラス名を追加
    }else {
		//ヘッダーが上に消える
        $('#header').removeClass('DownMove');//#headerにDownMoveというクラス名を除き
		$('#header').addClass('UpMove');//#headerにUpMoveのクラス名を追加
    }
    
    beforePos = scroll;//現在のスクロール値を比較用のbeforePosに格納
}


// 画面をスクロールをしたら動かしたい場合の記述
$(window).scroll(function () {
	ScrollAnime();//スクロール途中でヘッダーが消え、上にスクロールすると復活する関数を呼ぶ
});

// ページが読み込まれたらすぐに動かしたい場合の記述
$(window).on('load', function () {
	ScrollAnime();//スクロール途中でヘッダーが消え、上にスクロールすると復活する関数を呼ぶ
});

    $('nav a[href^="#"]').click(function(){
        var adjust = 0;
        var speed = 1000;
        var href = $(this).attr("href");
        var target = $(href == "#" || href == "" ? 'html' : href);
        var position = target.offset().top - adjust;
        $('body,html').animate({
            scrollTop: position
        }, speed, 'swing');
        return false;
    });

    $(window).scroll(function () {
        var targetElement = $('.fadein').offset().top;
        var scroll = $(window).scrollTop();
        var windowHeight = $(window).height();
        if (scroll > targetElement - windowHeight + 200) {
            $('.fadein').css('opacity','1');
            $('.fadein').css('transform','translateY(0)');
        }
    });

    $('a[data-modal-org-target]').off('click');
 
    if($('.a-modal-org').length){
        var overlay = $('.a-modal-org-overlay');
 
        $('[data-modal-org-target]').each(function (){
            var modalTarget = $($(this).attr('data-modal-org-target'));
            var modalTargetinner3 = modalTarget.find('.a-modal-org__inner3');
            var modalTargetHead = modalTarget.find('.a-modal-org__head');
            var modalTargetBody = modalTarget.find('.a-modal-org__body');
            var modalTargetFoot = modalTarget.find('.a-modal-org__foot');
            var modalTargetScroll = modalTarget.find('.a-modal-org__scroll');
            var modalTargetBtn = modalTarget.find('.a-modal-org__btn');
 
            if(modalTarget){
 
                $(this).on('click',function(){
                    modal_org_open();
                    if(overlay){
                        overlay.on('click focusin',function(){
                            modal_org_close();
                            return false;
                        });
                    }
                    return false;
                });
 
                modalTarget.on('click',function(){
                    modal_org_close();
                });
                modalTargetinner3.on('click',function(){
                    event.stopPropagation();
                });
                modalTargetBtn.on('click',function(){
                    modal_org_close();
                    return false;
                });
 
            }

            function modal_org_height(){
                if (modalTarget.is(':visible')) {
                    modalTargetBody.css("max-height", "none");
                    modalTargetScroll.removeClass('is-scroll').css("max-height", "none");
                    var outerHeight = modalTargetinner3.innerHeight();
                    if(modalTargetHead.length) outerHeight = outerHeight - modalTargetHead.outerHeight();
                    if(modalTargetFoot.length) outerHeight = outerHeight - modalTargetFoot.outerHeight();
                    modalTargetBody.css("max-height", outerHeight);
                    var scrollHeight = Math.floor(modalTargetScroll.outerHeight());
                    if(outerHeight < scrollHeight){
                        modalTargetScroll.addClass('is-scroll').css("max-height", outerHeight);
                    }
                }
            }
            $(window).on('resize',function(){
                modal_org_height();
            });

            function modal_org_open(){
                scroll_lock();
               
                modalTarget.css('opacity','0').show();
                modalTargetScroll.scrollTop(0);
                modal_org_height();
                modalTarget.hide().css('opacity','1');
                
                modalTarget.fadeIn(600, function(){
                    $(this).attr('aria-expanded', 'true');
                });
                modalTarget.attr('tabindex',1).focus().attr('tabindex','');
                
                if(overlay) a_modal_org_overlay(true, 200);         
            }
            function modal_org_close(){
                scroll_lock_off();
                modalTarget.attr('aria-expanded', 'false').fadeOut();
                
                if(overlay) a_modal_org_overlay(false, 'fast');         
            }
 
        });
    }
   
    var uA = navigator.userAgent;
    var os = osCh();                                
    function osCh(){
        if (uA.indexOf('iPhone') > -1 || uA.indexOf('iPod') > -1 || uA.indexOf('iPad') > -1) return "iOS";
        if (uA.indexOf('Android') > -1) return "Android";
        if (uA.indexOf("Mac") != -1 && !('ontouchend' in document)) return "Mac";
        if (uA.indexOf("Mac") != -1 && 'ontouchend' in document) return "ipadOS";          
        if (uA.indexOf("Win") != -1) return "Win";
        return "unknown";
    }
    var scrollPosition;
    function scroll_lock(){
        if( os == "iOS" || os == "ipadOS" ){
            scrollPosition = $(window).scrollTop();
            $('body').addClass('is-scroll-lock').css({'top': -scrollPosition});
        }else{
            var clientWidth = $(window).innerWidth();
            var noScrollBarWidth = $(window).outerWidth();
            $('body').css({'overflow': 'hidden'});
            diff = noScrollBarWidth - clientWidth;
            if(diff > 0){
                $('body').css({'padding-right': diff + 'px'});
               
            };
        }
    }
    function scroll_lock_off(){
        if( os == "iOS" || os == "ipadOS" ){
            $('body').removeClass('is-scroll-lock').css({'top': 0});
            window.scrollTo( 0 , scrollPosition );
        }else{
            $('body').css({'overflow': 'auto'});
            $('body').css({'padding-right': '0'});
        }
    }
 
    function a_modal_org_overlay(flag,speed){
        var overlay = $('.a-modal-org-overlay');
        if(overlay.length){
            if(flag){
                overlay.stop().fadeIn(speed);
            }else{
                overlay.stop().off().fadeOut(speed);
            }
        }
    }
 
    $(window).scroll(function () {
        var targetElement = $('.fadein1-1').offset().top;
        var scroll = $(window).scrollTop();
        var windowHeight = $(window).height();
        if (scroll > targetElement - windowHeight + 200) {
            $('.fadein1-1').css('opacity','1');
            $('.fadein1-1').css('transform','translateY(0)');
        }
    });
    $(window).scroll(function () {
        var targetElement = $('.fadein1-2').offset().top;
        var scroll = $(window).scrollTop();
        var windowHeight = $(window).height();
        if (scroll > targetElement - windowHeight + 200) {
            $('.fadein1-2').css('opacity','1');
            $('.fadein1-2').css('transform','translateY(0)');
        }
    });
    $(window).scroll(function () {
        var targetElement = $('.fadein1-3').offset().top;
        var scroll = $(window).scrollTop();
        var windowHeight = $(window).height();
        if (scroll > targetElement - windowHeight + 200) {
            $('.fadein1-3').css('opacity','1');
            $('.fadein1-3').css('transform','translateY(0)');
        }
    });

    $(window).scroll(function () {
        var targetElement = $('.fadein2').offset().top;
        var scroll = $(window).scrollTop();
        var windowHeight = $(window).height();
        if (scroll > targetElement - windowHeight + 200) {
            $('.fadein2').css('opacity','1');
            $('.fadein2').css('transform','translateY(0)');
        }
    });

});