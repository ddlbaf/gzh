define(function(require, exports, module) {


    var Template = require('libs/template');
    var Subscribe = require('libs/subscribe');


    Template.helper('monPrice', function (arr) {
        if(arr){
            return arr[0].actualprice.toFixed(2) + '/' + arr[0].payment || '';
        }

    });

    var Action = {
        bindEvent : function(){
            $('body').delegate('.js-tap', 'click', function(e){
                var handler = $(this).data('handler');
                Action[handler] && Action[handler].call(this);
            })
        },
        //获取会员列表
        getClubList: function (callback) {
            var param = {
                "jsonrpc": "2.0",
                "method": "Product.Clubber",
                "id": 54321,
                "params" : {
                }
            };
            $.Func.ajax(param, function(data){
                var result = data.result;
                $.isFunction(callback) && callback(result);
            })
        },
        //检查是否已经订阅
        checkSubscribe: function (uin) {
            var that = this;
            //查询订阅列表，看是否已经订阅
            Subscribe.vipService(uin, function(vipArr){
                that.getClubList(function(list){
                    $.each(list.data, function(i, t){
                        switch (t.productclass){
                            case 'yingyan':
                                list.data[i].url = '../hawkeye/index.html';
                                break;
                            case 'weipan':
                                list.data[i].url = 'wallet.html';
                                break;
                        }
                        if(~$.inArray(t.productclass, vipArr)){
                            list.data[i].status = 0;
                        }else{
                            list.data[i].status = 1;
                        }
                    });
                    var html = Template('list-template', list);
                    $('#list').html(html);
                });
            });
        },
        init : function(){
            var that = this;
            $.Func.getUserInfo();
            var uin = $.User.userid;
            if(!uin){
                location.href = $.CONFIG.CLUB;
            }
            $.Func.cookie.setCookie('gupiaoxianji_location', 'wallet');
            that.checkSubscribe(uin);
            that.bindEvent();
        }
    };

    module.exports = Action;
});