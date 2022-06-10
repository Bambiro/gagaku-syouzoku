$(function(){

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

    // ============
    // a処理を一旦リセット
    // ============
    $('a[data-modal-org-target]').off('click');
 
    // ============
    // U a-modal-org
    // ============
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

            // モーダルの高さ監視
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
                // モーダルチェック
                modalTarget.css('opacity','0').show();
                modalTargetScroll.scrollTop(0);
                modal_org_height();
                modalTarget.hide().css('opacity','1');
                // モーダル表示
                modalTarget.fadeIn(600, function(){
                    $(this).attr('aria-expanded', 'true');
                });
                modalTarget.attr('tabindex',1).focus().attr('tabindex','');
                // if(overlay) overlay.fadeIn(200);
                if(overlay) a_modal_org_overlay(true, 200);         // a-modal-org-overlay用
            }
            function modal_org_close(){
                scroll_lock_off();
                modalTarget.attr('aria-expanded', 'false').fadeOut();
                // if(overlay) overlay.off().fadeOut();
                if(overlay) a_modal_org_overlay(false, 'fast');         // a-modal-org-overlay用
            }
 
        });
    }
    // ============
    // U scroll_lock
    // ============
    var uA = navigator.userAgent;
    var os = osCh();                                //iOS,ipadOS,Android,Mac,Win
    function osCh(){
        if (uA.indexOf('iPhone') > -1 || uA.indexOf('iPod') > -1 || uA.indexOf('iPad') > -1) return "iOS";
        if (uA.indexOf('Android') > -1) return "Android";
        if (uA.indexOf("Mac") != -1 && !('ontouchend' in document)) return "Mac";
        if (uA.indexOf("Mac") != -1 && 'ontouchend' in document) return "ipadOS";           // safari only
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
                // if(headerFixedItem && $('[data-header-fixed="true"]').length) headerFixedItem.css({'padding-right': diff + 'px'});
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
            // if(headerFixedItem) headerFixedItem.css({'padding-right': 0});
        }
    }
 
    // ============
    // U a-modal-org-overlay
    // ============
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
 
});