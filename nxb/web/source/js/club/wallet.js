define(function(require, exports, module) {


    var Subscribe = require('libs/subscribe');
    var template = require('libs/template');

    template.helper('numToPercent', function (number) {
        return (number*100).toFixed(2)
    });

    template.helper('shortDate', function (date) {
        return date.substring(4,6) + '.' + date.substring(6);
    });

    var Action = {
        bindEvent : function(){
            $('body').delegate('.js-tap', $.Func.TAP, function(e){
                var handler = $(this).data('handler');
                Action[handler] && Action[handler].call(this);
            })
        },
        //立即订阅尾盘
        subscribe : function(){
            var productid = $(this).data('productid');
            if(!productid) return false;
            if(!$.User.wxgzh){
                $.Func.showLayer('#popBindAccount');
            }else{
                location.href = '../../pay/pay.html?productid=' + productid;
            }
        },
        //添加自选股
        addStock : function(){
            var that = this;
            var param = {
                "jsonrpc": "2.0",
                "method": "WeiPan.WeiPanStocks",
                "id": 54321,
                "params" : {
                    "userid" : "186656397319",
                    "stockid" : "000002.SH",
                    "seq": 4,
                    "token":"da97b4ccb9fc02b66534f6ff31efc60e938da8ae"
                }
            };
            $.Func.ajax(param, function(data){
                var result = data.result;

                if(result){
                    $(this).addClass('on');
                }
            })
        },
        //关闭弹层
        closeLayer : function(){
            $(this).parent().parent().removeClass('show');
        },
        //尾盘详情
        getWeipan: function(){
            var that = this;
            var param = {
                "jsonrpc": "2.0",
                "method": "WeiPan.WeiPanStocks",
                "id": 54321,
                "params" : {
                }
            };
            $.Func.ajax(param, function(data){
                var result = data.result;

                if(result){
                    var len = result.data.length || 0;
                    $('#date').html(result.date);
                    $('#recommend').html(result.data.length);
                    var html = template('li-template', result);
                    $('#stockList').html(html);
                    if(len){
                        $('#subscribe').addClass('show-empty');
                    }
                }
            })
        },
        init : function(){
            var that = this;
            //判断登录态
            $.Func.getUserInfo();
            if(!$.User.wxgzh){
                $('#noSubscribe').removeClass('hide');
            }else{
                //获取funid
                var uin = $.User.userid;
                var productid = 'weipan';
                //判断是否在服务期内,在服务期内则正常展示
                Subscribe.vipService(uin, function(vipArr){
                    if(~$.inArray(productid, vipArr)){
                        //获取尾盘数据
                        that.getWeipan();
                        $('#subscribe').removeClass('hide');
                    }else{
                        $('#noSubscribe').removeClass('hide');
                    }
                });
            }

            this.bindEvent();
        }
    }

    module.exports = Action;
});