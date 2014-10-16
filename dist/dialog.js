define(function(require, exports, module){
    'use strict'
    
    var Dialog, Overlay, mask, isIE6, $root;
    
    $root = $('html');
    mask = require('mask');
    Overlay = require('overlay');
    isIE6 = (window.navigator.userAgent || '').toLowerCase().indexOf('msie 6') !== -1;
    
    Dialog = Overlay.extend({
        attrs : {
            distance : 20,
            content : null,
            hasMask : true,
            hasClose : true,
            triggerType : 'click',
            style : {
                position : isIE6 ? 'absolute' : 'fixed',
                top : 0,
                left : 0,
                width : '100%',
                height : '100%',
                overflow : 'auto'
            },
            template : require('./dialog.tpl')
        },
        setup : function(){
            bindEscEvent(this);
            Dialog.superclass.setup.call(this);
            this.set('zIndex', mask.get('zIndex') + 1);
            this.set('overflow', $root.css('overflow'));
        },
        render : function(){
            this.$('[data-id="content"]').css({
                position : 'absolute',
                marginTop : this.get('distance'),
                marginBottom : this.get('distance')
            });
            Dialog.superclass.render.call(this);
            pin(this);
    
            return this;
        },
        pin : function(){
            var ctx, width, height, eventName, $win, el;
    
            ctx = this;
            $win = $(window);
            width = this.get('width');
            height = this.get('height');
            el = this.$('[data-id="content"]');
            eventName = 'resize.dialog' + ctx.cid;
    
            $win.off(eventName).on(eventName, function(){
                var top;
    
                isIE6 && ie6fallback(ctx, $win);
                top = (ctx.element.height() - height) / 2 - ctx.get('distance');
    
                el.css({
                    top : top > 0 ? top : 0,
                    left : (ctx.element.width() - width) / 2
                });
            }).trigger(eventName);
        },
        show : function(){
            Dialog.superclass.show.call(this);
            $root.css('overflow', 'hidden');
            this.get('hasMask') && mask.show();
            this.trigger('show');
        },
        hide : function(){
            Dialog.superclass.hide.call(this);
            $root.css('overflow', this.get('overflow'));
            this.get('hasMask') && mask.hide();
            this.destroy();
            this.trigger('hide');
        },
        destroy : function(){
            var ctx = this;
    
            setTimeout(function(){
                ctx.off();
                ctx.rendered = false;
                ctx.element.detach();
            }, 400);
        },
        _onRenderWidth : function(val){
            this.$('[data-id="content"]').css('width', val);
        },
        _onRenderHeight : function(val){
            this.$('[data-id="content"]').css('height', val);
        },
        _onRenderContent : function(val){
            var html = '';
    
            if(this.get('hasClose')){
                html = '<a href="javascript:;" class="widget-dialog-close" on-click="hide"></a>';
            }
    
            if(/^(https?:\/\/|\/|\.\/|\.\.\/)/.test(val)){
                val = createIframe(this, val);
            }
    
            this.$('[data-id="content"]').html(html + val);
            pin(this, true);
        }
    });
    
    function pin(ctx, reset){
        var el = ctx.$('[data-id="content"]');
    
        if(ctx.rendered){
            setTimeout(function(){
                $(['width', 'height']).each(function(index, item){
                    if(!ctx.get(item)){
                        ctx.set(item, el['inner' + capitalize(item)]() || 300);
                    }else if(reset){
                        ctx.set(item, 'auto');
                        ctx.set(item, el['inner' + capitalize(item)]() || 300);
                    }
                });
    
                ctx.pin();
            }, 0);
        }
    };
    
    function ie6fallback(ctx, $win){
        var eventName = 'scroll.dialog' + ctx.cid;
    
        ctx.element.css('height', $win.height());
    
        $win.off(eventName).on(eventName, function(){
            ctx.element.css('top', $win.scrollTop());
        }).trigger(eventName);
    };
    
    function bindEscEvent(ctx){
        $(document).on('keyup.esc', function(e){
            if(e.keyCode === 27){
                ctx.get('visible') && ctx.hide();
            }
        });
    };
    
    function createIframe(ctx, url){
        var iframe, t;
    
        t = new Date().getTime();
        url += (url.indexOf('?') === -1 ? '?' : '&') + 't=' + t;
    
        iframe = $('<iframe />', {
            src : url,
            scrolling : 'no',
            frameborder : 'no',
            allowTransparency : true,
            className : 'widget-dialog-iframe',
            css : {
                border : 'none',
                width : '100%',
                height : '100%',
                display : 'block',
                overflow : 'hidden'
            }
        }).attr('name', 'dialog-iframe-' + t);
    
        return iframe[0].outerHTML;
    };
    
    function capitalize(val){
        return val.charAt(0).toUpperCase() + val.slice(1);
    };
    
    module.exports = Dialog;
});