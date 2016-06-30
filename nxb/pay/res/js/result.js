define(function(require, exports, module) {

    var template = require('template');

    var Action = {
        init: function(){
             $.Func.getUserInfo();
            var data = {
                status: $.Func.getParam('status'),
                money: $.Func.getParam('money')
            }
            var html = template('result-template', data);
            $('#result').html(html);
        }
    }

    module.exports = Action;
});