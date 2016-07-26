define(function(require, exports, module) {


    var Action = {
        bindEvent : function(){
            $('body').delegate('.js-tap', 'click', function(e){
                var handler = $(this).data('handler');
                Action[handler] && Action[handler].call(this);
            })
        },
        checkPhone: function(){
            var phone = $('#phone').val();
            phone = phone.replace(/(^\s+)|(\s+$)/g, '');

            //判断手机是否正确
            var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
            if(!myreg.test(phone))
            {
                return false;
            }
            return phone;
        },
        checkSmsCode: function(phone, callback){
            var smscode = $('#smsCode').val();
            if(smscode){
                smscode = smscode.replace(/(^\s+)|(\s+$)/g, '');
            }
            //检查验证码是否正确
            var pattern = new RegExp("^\\d{4}$");
            if(!smscode || !pattern.test(smscode)){
                $.Func.pop('请输入正确短信验证码！');
                return false;
            }
            var param = {
                "jsonrpc": "2.0",
                "method": "Other.VerifyVerificationCode",
                "id": 54321,
                "params" : {
                    "phone": phone,
                    "code": smscode
                }
            };

            $.Func.ajax(param, function(res){
                var result = res.result;
                if(result){
                    if(result.status > 1){
                        $.Func.pop(result.statusmsg);
                    }else{
                        $.isFunction(callback) && callback();
                    }
                }
            })
        },
        //发送验证码
        getSmsCode: function(){
            var that = this;
            var phone = Action.checkPhone();
            if(!phone){
                $.Func.pop('请输入有效的手机号码！');
                return false;
            }

            var param = {
                "jsonrpc": "2.0",
                "method": "Other.SendVerificationCode",
                "id": 54321,
                "params" : {
                    "phone": phone
                }
            };

            var disabled = $(that).attr('disabled');
            if(!disabled){   //如果不可点，就不能再发送验证码
                $.Func.ajax(param, function(res){
                    var result = res.result;
                    if(result){
                        var disabled = $(that).attr('disabled');
                        var seconds = 60;
                        $(that).addClass('disabled').attr('disabled', 'disabled').html(seconds + 's后重新获取');
                        var timer = setInterval(function(){
                            seconds--;
                            if(seconds>0){
                                $(that).html(seconds +'s后重新获取');
                            }else{
                                $(that).removeClass('disabled').removeAttr('disabled').html('重新发送');
                                clearInterval(timer);
                                null;
                            }
                        }, 1000);
                    }else{
                        $.Func.pop(res.error.message);
                    }
                })
            }

        },
        closeLayer: function(){
            $('#layer').removeClass('show');
        },
        submit: function(){
            var phone = Action.checkPhone();
            var smsCode = Action.checkSmsCode(phone, function(){
                if(!$.User.wxgzh){
                    $.Func.bindGZH(phone, $.User.openid, function(res){
                        var result = res.result;
                        if(result){
                            $.Func.pop(result.statusmsg, function(){
                                if(result.status == 1){
                                    location.href = $.CONFIG.INDEX;
                                }
                            });
                        }else{
                            $.Func.pop(res.error.message);
                        }
                    });
                }

                if(!$.User.wxapp){
                    $.Func.bindWeixin(phone, $.User.unionid, function(){});
                }
            });

        },
        init : function(){
            $.Func.getUserInfo();
            Action.bindEvent();
        }
    }

    module.exports = Action;
});