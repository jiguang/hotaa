/**
 * @desc ����ͼҳ��Ƭ���ߣ����ڱ༭����������ҳ��Ƭ
 * @author laserji
 * @mail jiguang1984#gmail.com
 * @date 2013-04-27
 */

$(function(){
    "use strict";

    var config = {
        isDebug: true,
        canvas: '.hota_canvas',
        canvas_bg: '.hota_bg',
        hot_area: 'a',
        init_width: 100,
        init_height: 100,
        area_info: '.area_info',
        workshop: '#workshop',
        code_wrap: '#code_wrap',
        page_content: '#page_content',
        img_src: '#img_src',
        ptag: '#ptag',
        link: '#link_addr',
        context_menu: '#context_menu',
        v_line: '.v_line',
        h_line: '.h_line',
        tolerance: 5
    };
    var $cur = null;

    // ��ʼ��
    function init(){

        // �Զ���ȡҳ�����ݣ�for ppms��
        var originCode = $.trim($(config.page_content).val());

        if(originCode != '' && originCode.indexOf('Hota') != -1){
            $(config.workshop).html($(originCode));
            // ��һ�ξ����
            $(config.page_content).val('');
            init();
        }

        // ����Ĭ�ϴ洢λ��
        var $page_path = $('#page_path');
        if($.trim($page_path.val()) === ''){
            $page_path.val($page_path.attr('data-value'));
        }

        // ����Ĭ�ϵ��ļ���
        var $page_name = $('#page_name');
        if($.trim($page_name.val()) === ''){
            var d = new Date();
            $page_name.val(d.getFullYear() + '_' + (d.getMonth() + 1) + '_' + d.getDay() + '_' + Math.floor(Math.random()*10000) + '.html');
        }

        // ������ʼ��
        var $hot_list = $(config.canvas).find(config.hot_area);

        $hot_list.each(function(){
            $(this)
                .css({
                    'width': $(this)[0].style.width ? $(this)[0].style.width : $(this).width(),
                    'height': $(this)[0].style.height ? $(this)[0].style.height : $(this).height()
                }).resizable({
                    containment: "parent",

                    start: function(event, ui){
                        $cur = ui.helper;
                        $cur.addClass('cur').siblings().removeClass('cur');
                        $(config.area_info).show();
                    },
                    resize: function(event, ui){
                        $(config.area_info)
                            .css({
                                'left': ui.originalPosition.left,
                                'top': ui.originalPosition.top
                            }).html(ui.size.width + 'x' + ui.size.height);

                        $(ui.handler)
                            .css({
                                'width': ui.size.width,
                                'height': ui.size.height
                            });
                    },
                    stop: function(event, ui){
                        $(config.area_info).hide();
                    }
                })
                .draggable({

                    containment: "parent",

                    distance: 10,

                    snap: true,
                    snapTolerance: 10,

                    start: function(event, ui){
                        $cur = ui.helper;
                        $cur.addClass('cur').siblings().removeClass('cur');
                        $(config.area_info).show();
                    },

                    drag: function(event, ui){
                        var $me = $(this);

                        $(config.area_info)
                            .css({
                                'left': ui.position.left,
                                'top': ui.position.top
                            }).html('top:' + ui.position.top + '&nbsp;&nbsp;left:' + ui.position.left);

                        if($me.siblings('a').length > 0){
                            $me.siblings('a').each(function(){

                                /***** S ���Ҷ������ *****/
                                // ������ұ߶���
                                if(Math.abs(($(this).position().left + $(this).width()) - ui.position.left) <= config.tolerance){
                                    $(config.v_line).show().css('left', $(this).position().left + $(this).width());
                                }

                                // �ұ�����߶���
                                if(Math.abs(($(this).position().left) - (ui.position.left + ui.helper.width())) <= config.tolerance){
                                    $(config.v_line).show().css('left', $(this).position().left);
                                }

                                // �ұ����ұ߶���
                                if(Math.abs(($(this).position().left + $(this).width()) - (ui.position.left + ui.helper.width())) <= config.tolerance){
                                    $(config.v_line).show().css('left', $(this).position().left + $(this).width());
                                }

                                // �������߶��� �������ͬʱ��������룩
                                if(Math.abs($(this).position().left - ui.position.left) <= config.tolerance){
                                    $(config.v_line).show().css('left', $(this).position().left);
                                }
                                /***** E ���Ҷ������ *****/

                                /***** S ���¶������ *****/
                                // �ϱ����±߶���
                                if(Math.abs(($(this).position().top + $(this).height()) - ui.position.top) <= config.tolerance){
                                    $(config.h_line).show().css('top', ($(this).position().top + $(this).height()));
                                }

                                // �±����ϱ߶���
                                if(Math.abs($(this).position().top - (ui.position.top + ui.helper.height())) <= config.tolerance){
                                    $(config.h_line).show().css('top', $(this).position().top);
                                }

                                // �±����±߶���
                                if(Math.abs(($(this).position().top + $(this).height()) - (ui.position.top + ui.helper.height())) <= config.tolerance){
                                    $(config.h_line).show().css('top', $(this).position().top + $(this).height());
                                }

                                // �ϱ����ϱ߶��� ���߶���ͬʱ�����϶��룩
                                if(Math.abs($(this).position().top - ui.position.top) <= config.tolerance){
                                    $(config.h_line).show().css('top', $(this).position().top);
                                }
                                /***** E ���¶������ *****/
                            });
                        }
                    },
                    stop: function(event, ui){
                        $([config.area_info, config.v_line, config.h_line].toString()).hide();
                    }

                });
        });

        // ��ȡͼƬ��ַ
        if($(config.canvas_bg).attr('src') != ''){
            $(config.img_src).val($(config.canvas_bg).attr('src'));
        }

        // ������Ϣ
        if(!$(config.canvas).find(config.area_info)[0]){
            $(config.canvas).append('<div id="area_info" class="area_info"></div>\
                <div class="h_line"></div>\
                <div class="v_line"></div>');
        }

        // ��������
        $(config.code_wrap).val('');

        // �����������
        $(config.canvas).click(function(e){
            e.preventDefault();

            clearTimeout(window.HOTA_TIMER);
            window.HOTA_TIMER = setTimeout(function(){
                if(e.target.tagName.toLocaleLowerCase() === 'a'){
                    $cur = $(e.target);
                    $cur.addClass('cur').siblings().removeClass('cur');
                }else{
                    addZone({
                        top: e.pageY - $(e.target).offset().top - 10,
                        left: e.pageX - $(e.target).offset().left - 10
                    });
                }
            }, 50);

            e.stopPropagation();
        });


        /*** START �Ҽ��༭�˵� ***/
        // �����Ҽ��˵�
        $(config.canvas).on('contextmenu', function(e){
            e.preventDefault();

            if(e.target.tagName.toLocaleLowerCase() === 'a'){
                $(config.context_menu).show().css('left', e.pageX).css('top', e.pageY).draggable();
                $cur = $(e.target);
                $cur.addClass('cur').siblings().removeClass('cur');

                $(config.link).val($cur.attr('href'));
                $('#link_tit').val($cur.attr('title'));

                $(config.ptag).val($cur.attr('href').toLocaleLowerCase().indexOf('ptag') > 0 ? $cur.attr('href').match(/PTAG=([.0-9]*)/i)[1] : '');


                if($(e.target).attr('target') != undefined){
                    $('#'+$(e.target).attr('target'))[0].checked = true;
                }

                setTimeout(function(){
                    $(config.link).focus();
                }, 100);
            }
            e.stopPropagation();
        });

        // ���ڲ˵��հ״�������
        $(config.context_menu).click(function(e){
            e.stopPropagation();
        });

        // ��� http://
        $(config.link).blur(function(){
            if($(this).val().indexOf('http://') < 0){
                $(this).val('http://' + $(this).val());
            }
        });

        // ȷ�ϸ���
        $('#btn_confirm').click(function(){
            if($cur){

                if(!/^http:\/\/.*/.test($.trim($(config.link).val()))){
                    tip('���ӵ�ַ����ȷ������������');
                    return;
                }

                if($(config.link).val().toLocaleLowerCase().indexOf('ptag') < 0){

                    // ����û�У����� ptag
                    if($.trim($(config.ptag).val()) != ''){
                        var hash = $(config.link).val().indexOf('#') != -1 ? $(config.link).val().replace(/.*?(#.*)/ig, '$1') : '';
                        $cur.attr('href', $(config.link).val().replace(/#.*/ig, '') + '?PTAG=' + $(config.ptag).val() + hash);
                    }else{
                        $cur.attr('href', $(config.link).val());
                    }

                }else{
                    $cur.attr('href', $(config.link).val().replace(/PTAG=([.0-9]*)/ig, 'PTAG=' + $(config.ptag).val()));
                }

                $cur.attr('title', $('#link_tit').val())
                    .attr('target', $('#open_type').find('input:checked')[0].id);

                $(config.context_menu).hide();
            }
        });

        // ȡ������
        $('#btn_cancel').click(function(){
            $(config.context_menu).hide();
        });
        /*** END �Ҽ��༭�˵� ***/


        // IE��ʾ
        if($.browser.msie){
            $('#browser_tip').fadeIn(500).delay(4000).fadeOut(1000);
        }

        // ���ƴ���
        var clip = new ZeroClipboard( document.getElementById("btn_copy"), {
            moviePath: "http://ppms.paipaioa.com/hota/js/ZeroClipboard.swf"
        } );

        clip.on( 'complete', function(){
            tip('���Ƴɹ����뽫����ճ�����½���ҳ��Ƭ�л�ֱ��ʹ��');
        });


        // ����ͼƬ��ַ
        $(config.img_src).on('keyup blur', function(){
            if(/http:\/\/.*?(jpg|jpeg|png|bmp|\d)/.test($(this).val())){
                $(config.canvas_bg).attr('src', $(this).val()).load(function(){
                    $(config.canvas).width($(this).width()).height($(this).height());
                });
            }
        }).focus(function(){
            this.select();
        });

        // ���������
        $(document).keydown(function(e){

            var key = e.keyCode;

            // ɾ��
            if($cur && key == 46){
                $cur.remove();
            }

            if($cur && e.shiftKey){

                // ����
                if(key == 37 && parseInt($cur.css('left'), 10) > 0){
                    $cur.css('left', parseInt($cur.css('left'), 10) - 1);
                }

                // ����
                if(key == 39 && parseInt($cur.css('left'), 10) <= $cur.parent().width() - $cur.width()){
                    $cur.css('left', parseInt($cur.css('left'), 10) + 1);
                }

                // ����
                if(key == 38 && parseInt($cur.css('top'), 10) > 0){
                    $cur.css('top', parseInt($cur.css('top'), 10) - 1);
                }

                // ����
                if(key == 40 && parseInt($cur.css('top'), 10) <= $cur.parent().height() - $cur.height()){
                    $cur.css('top', parseInt($cur.css('top'), 10) + 1);
                }

                $(config.area_info).show()
                    .css('left', $cur.css('left'))
                    .css('top', $cur.css('top'))
                    .html('top:' + parseInt($cur.css('top'), 10) + '&nbsp;&nbsp;left:' + parseInt($cur.css('left'), 10)); // ��ʾ��λ̫����
            }

        }).keyup(function(e){
                $(config.area_info).hide();
                e.stopPropagation();
            }).click(function(e){
                // �����Ҽ��˵�
                $(config.context_menu).hide();

                if($cur){
                    $cur.removeClass('cur');
                    $cur = null;
                }
            });


        // ���沢���ɴ���
        $('#btn_get').click(function(e){
            e.preventDefault();

            // Ϊ�����ۣ����������������ó��뻭����ͬ
            // var img_width = $(config.canvas).find('img').width();
            // $(config.code_wrap).width(img_width <= 1000 ? img_width : 1000);

            // ���ɴ���
            $(config.code_wrap).show().val(getCode());
        });

        // ��ȡ����
        $('#btn_set').click(function(e){
            e.preventDefault();

            var code = $(config.code_wrap).val();

            if(code != '' && code.indexOf('Hota') != -1){
                $(config.workshop).html(code);
                init();
            }
        });

        // ���浽 PAGE ϵͳ
        $('#btn_save_ppms').click(function(e){
            e.preventDefault();

            $(config.page_content).val(getCode());
            $('#form').submit();
        });

    }

    // �������
    function addZone(position){

        var $hot_list = $(config.canvas).find(config.hot_area),
            $hot_area = $('<a class="'+config.hot_area.substr(1)+'" href="">&nbsp;</a>');

            $hot_area.appendTo($(config.canvas))
                .css({
                    'width': config.init_width,
                    'height':  config.init_height,
                    'top':  position.top,
                    'left':  position.left
                });
            config.isDebug?console.log('HOTA:', '�����һ������'):0;

            if($hot_list.length > 0){
                $cur = $hot_area;
                var $last = $hot_list.last();

                $hot_area
                    .css({
                        'width': $last.width(),
                        'height': $last.height()
                    });
            }
        // ���³�ʼ��
        init();
    }

    // ���ɴ���
    function getCode(){

        return $(config.workshop).clone()
            .find(config.canvas)
            .css({
                'width': $(config.canvas).find('img').width(),
                'height': $(config.canvas).find('img').height(),
                'position': 'relative'
            }).end()
            .find('.area_info, .v_line, .h_line').remove().end()
            .find('.ui-resizable-handle').remove().end()
            .find(config.hot_area).css('position','').removeAttr('class').end()
            .html()
            .replace(/\s{2,}/ig, '');

    }

    // ��ʾ
    function tip(msg){
        $('#msg_tip').html(msg).show().delay(3000).fadeOut(1000);
    }

    // ��ʼ��ʼ��һ��
    init();

});
