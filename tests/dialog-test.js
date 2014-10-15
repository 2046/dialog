define(function(require, exports, module){
    'use strict'

    var expect, Dialog;

    Dialog = require('dialog');
    expect = require('expect');

    function equals(){
        var args = arguments;
        expect(args[0]).to.equal(args[1]);
    };

    describe('Dialog', function(){
        it('..', function(){
            var button = $('<input type="button" value="button" style="position:absolute;top:0;left:0;" />').appendTo(document.body);
            new Dialog({
                trigger : button,
                // width : 500,
                // height : 2000,
                content : '<div><input type="input" /></div>'
                // content : 'http://yinyuetai.com'
            });
        });
    });
});