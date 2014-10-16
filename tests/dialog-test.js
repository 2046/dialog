define(function(require, exports, module){
    'use strict'

    var expect, Dialog, sinon;

    sinon = require('sinon');
    Dialog = require('dialog');
    expect = require('expect');

    function equals(){
        var args = arguments;
        expect(args[0]).to.equal(args[1]);
    };

    describe('Dialog', function(){
        var example;

        afterEach(function(){
            if(example){
                example.hide();
                example.destroy();
                example = null;
            }
        });

        describe('content', function(){
            it('it string', function(){
                example = new Dialog({
                    content : 'test'
                }).render();

                equals(example.$('[data-id="content"]').html().indexOf('test') !== -1, true);
            });

            it('is html', function(){
                example = new Dialog({
                    content : '<div id="test2">test2</div>'
                }).render();

                var test = example.$('[data-id="content"]').children().eq(1);
                equals(test.attr('id'), 'test2');
                equals(test.html(), 'test2');
            });

            it('is relative url', function(){
                example = new Dialog({
                    width : 200,
                    height: 300,
                    content : './height300px.html'
                }).render();

                var iframe = example.$('iframe');
                equals(iframe.length, 1);
                equals(iframe.attr('src').replace(/\?t=\d*$/, ''), './height300px.html');
            });

            it('is absolute url', function(){
                example = new Dialog({
                    width : 200,
                    height: 300,
                    content : 'http://qq.com/'
                }).render();

                var iframe = example.$('iframe');
                equals(iframe.length, 1);
                equals(iframe.attr('src').replace(/\?t=\d*$/, ''), 'http://qq.com/');
            });

            it('changing content should reset position', function(done){
                example = new Dialog({
                    content : 'xxxx'
                });

                example.show();
                setTimeout(function(){
                    var top = example.$('[data-id="content"]').css('top');

                    setTimeout(function(){
                        example.set('content', '<p>xxxx</p><p>xxxx</p>');

                        setTimeout(function(){
                            expect(top).not.to.be(example.element.css('top'));
                            done();
                        }, 0)
                    }, 500);
                }, 0);
            });
        });

        describe('height', function(){
            it('should init without height when type is dom', function(){
                example = new Dialog({
                    content : '<div id="test" style="height:200px;"></div>'
                });

                var spy = sinon.spy(example, '_onRenderHeight');
                example.show();
                expect(example._onRenderHeight.called).not.to.be(true);
                spy.restore();
            });

            it('should init with height when type is dom', function(){
                example = new Dialog({
                    height : '300px',
                    content : '<div id="test" style="height:200px;"></div>'
                });
                var spy = sinon.spy(example, '_onRenderHeight');
                example.show();
                expect(spy.withArgs('300px').called).to.be.ok();
                spy.restore();
            });

            it('should init with height when type is iframe', function(done){
                example = new Dialog({
                    height : '200px',
                    content : './height300px.html'
                });
                var spy = sinon.spy(example, '_onRenderHeight');
                example.show();
                setTimeout(function(){
                    expect(spy.withArgs('200px').called).to.be.ok();
                    spy.restore();
                    done();
                }, 500);
            });

            it('should be align top when dialog element is very high', function(done){
                example = new Dialog({
                    height : 5000,
                    content : 'xxx'
                });
                example.show();
                setTimeout(function(){
                    equals(example.$('[data-id="content"]').css('top'), '0px');
                    done();
                }, 0);
            });
        });

        describe('events: show and hide', function(){
            it('click trigger to show', function(){
                var test = $('<div id="test"></div>').appendTo('body');

                example = new Dialog({
                  content : 'xxx',
                  trigger : '#test'
                });
                equals(example.get('visible'), false);
                test.click();
                equals(example.get('visible'), true);
                test.remove();
            });

            it('click close to hide', function(){
                example = new Dialog({
                  content : 'xxx'
                });
                equals(example.get('visible'), false);
                example.show();
                equals(example.get('visible'), true);
                example.$('.widget-dialog-close').click();
                equals(example.get('visible'), false);
            });

            it('bind key close event', function(){
                example = new Dialog({
                  content : 'xxx'
                });
                example.show();
                equals(example.get('visible'), true);

                var e = $.Event('keyup');
                e.keyCode = 27;
                example.element.trigger(e);
                equals(example.get('visible'), false);
            });

            it('bind key close event when iframe', function(){
                example = new Dialog({
                  content : 'http://qq.com/'
                });
                example.show();

                var e = $.Event('keyup');
                e.keyCode = 27;
                example.element.trigger(e);
                equals(example.get('visible'), false);
            });
        });

        describe('mask', function(){
            it('should have mask', function(){
                example = new Dialog({
                    content : 'xxx'
                });
                example.show();
                equals(require('mask').get('visible'), true);
            });

            it('should not have mask', function(){
                example = new Dialog({
                    content : 'xxx',
                    hasMask : false
                });
                example.show();
                equals(require('mask').get('visible'), false);
            });

            it('set hasMask works', function(){
                example = new Dialog({
                    content : 'xxx'
                });
                example.show();
                equals(require('mask').get('visible'), true);
                example.hide();
                example.set('hasMask', false);
                example.show();
                equals(require('mask').get('visible'), false);
                example.hide();
                example.set('hasMask', true);
                example.show();
                equals(require('mask').get('visible'), true);
                example.hide();
            });

            it('should hide mask', function(){
                example = new Dialog({
                    content : 'xxx'
                });
                example.show();
                example.show();
                equals(require('mask').get('visible'), true);
                example.hide();
                equals(require('mask').get('visible'), false);
            });
        });
    });
});