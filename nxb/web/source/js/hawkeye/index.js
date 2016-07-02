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
        getFundid: function(callback){
            var param = {
                "jsonrpc": "2.0",
                "method": "EagleEyes.ToFundid",
                "id": 54321
            };
            $.Func.ajax(param, function(res){
                if(res.result){
                    callback && callback(res.result.fundid);
                }
            })
        },
        //立即订阅鹰眼
        subscribe : function(){
            var fundid = $(this).data('fundid');
            if(!fundid) return false;
            if(!$.User.wxgzh){
                $.Func.showLayer('#popBindAccount');
            }else{
                Subscribe.subscribeFund($.User.userid, fundid, function(data){
                    if(data.result.status == 1){
                        $.Func.pop('订阅成功！');
                    }else{
                        $.Func.pop(data.result.status.msg);
                    }
                });
            }
        },
        //鹰眼播报
        getEye: function(){
            var that = this;
            var param = {
                "jsonrpc": "2.0",
                "method": "EagleEyes.Broadcast",
                "id": 54321,
                "params" : {
                }
            };
            $.Func.ajax(param, function(data){
                var result = data.result;
                var date = result.day.toString();

                //日期
                result.newDate = date.substring(0, 4) + '年' +  date.substring(4, 6) + '月' +  date.substring(6) + '日';
                var html = template('broadcast-template', result);
                $('#broadcast').html(html);
                that.getHistory(date);
            })
        },
        //播报历史记录
        getHistory: function(date){
            var param = {
                "jsonrpc": "2.0",
                "method": "EagleEyes.BroadcastHistory",
                "id": 54321,
                "params" : {
                    "date":date
                }
            };
            $.Func.ajax(param, function(data){
                var result = data.result;
                var html = template('probability-template', result);
                $('#probability').html(html);
            })
        },
        //板块
        getBlock: function(){
            var param = {
                "jsonrpc": "2.0",
                "method": "EagleEyes.Block",
                "id": 54321,
                "params" : {
                }
            };
            $.Func.ajax(param, function(res){
                var result = res.result;
                if(result && result.bkdata){
                    result.colors = ['bg-blue', 'bg-pink', 'bg-yellow', 'bg-blue', 'bg-pink', 'bg-yellow'];
                    var html = template('block-template', result);
                    $('#block').html(html);
                }else{
                    var html = '<li class="empty-li">暂无</li>';
                    $('#block').html(html);
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
                that.getFundid(function(fundid){
                    var uin = $.User.userid;
                    //判断是否在服务期内,在服务期内则正常展示
                    Subscribe.vipService(uin, function(vipArr){
                        if(~$.inArray(fundid, vipArr)){
                            that.getEye();
                            that.getBlock();
                            $('#subscribe').removeClass('hide');
                        }else{
                            $('#noSubscribe').removeClass('hide');
                            //检测是否免费订阅
                            Subscribe.checkFundFreeStatus(uin, fundid, function(status){
                                if(1 == status){
                                    $('#nosubscribeBtn').html('<a href="javascript:;" class="btn js-tap" data-fundid="' + fundid + '" data-handler="subscribe"><img src="../res/img/hawkeye/yybb_btn.png" width="100%" alt=""/></a>');
                                }else{
                                    $('#nosubscribeBtn').html('<a class="btn" href="../../pay/pay.html?fundid=' + fundid + '"><img src="../res/img/hawkeye/yybb_btn.png" width="100%" alt=""/></a>');
                                }
                            });
                        }
                    })
                })
            }

            this.bindEvent();
        }
    }

    module.exports = Action;
});