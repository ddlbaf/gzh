define(function(require, exports, module) {
    //=> 加载的是 path/to/a-debug.js
    require('libs/touch');

    $.User = {};

    $.Func = {
        TAP : 'ontouchstart' in window ? 'tap' : 'click',
        getParam : function(param){
            var search = location.search.substring(1);
            var arr = search.split('&');
            for(var i=0,j=arr.length; i<j; i++){
                var arr1 = arr[i].split('=');
                if(arr1[0] == param){
                    return arr1[1];
                }
            }
        },
        ajax : function(param, fn){
            var url = 'http://app.api.gupiaoxianji.com/v3.5.3';
            $.ajax({
                url: url,
                type: "POST",
                contentType: "application/json",
                dataType : 'json',
                data: JSON.stringify(param),
                success: function(res){
                    $.isFunction(fn) && fn(res);
                },
                error: function(res){
                    console.log(res);
                }
            });
        },
        pop: function(title, callback){
            if(title){
                $('#line').html(title);
                $('#layer').addClass('show');
                $.isFunction(callback) && callback();
            }
        },
        showLayer: function(id){
            $(id).addClass('show');
        },
        hideLayer: function(id){
            $(id).removeClass('show');
        },
        formatDate: function(time, pre){

            var date = new Date(time);
            var year, mon, day;

            if(date == 'Invalid Date'){
                var reg = new RegExp(/(\d+)-(\d+)-(\d+)\s.+/);
                var match = time.toString().match(reg);
                year = +match[1];
                mon = +match[2];
                day = +match[3];
            }else{
                year = date.getFullYear();
                mon = date.getMonth() + 1;
                day = date.getDate();
            }

            if(pre === 'year'){
                year -= 1;
            }else if(pre === 'mon'){
                if(mon<4){
                    year -= 1;
                    mon = 12+mon-3;
                }else{
                    mon -= 3;
                }
            }
            year = year.toString();
            mon = mon.toString();
            day = day.toString();
            if(mon.length === 1) mon = '0' + mon;
            if(day.length === 1) day = '0' + day;

            return year + mon + day;
        },
        //获取用户登录cookie信息
        getUserInfo: function(){
            $.User = {
                wxapp: parseInt($.Func.cookie.getCookie('WXAppBind')),
                wxgzh:  parseInt($.Func.cookie.getCookie('WXGzhBind')),
                openid: $.Func.cookie.getCookie('openid'),
                unionid: $.Func.cookie.getCookie('unionid'),
                userid: $.Func.cookie.getCookie('userid')
            };
        },
        //绑定公众号
        bindGZH: function(userid, openid, callback){
            var param = {
                "jsonrpc": "2.0",
                "method": "User.BindGzhNxb",
                "id": 54321,
                "params" : {
                    "openid": openid,
                    "userid": userid
                }
            };
            $.Func.ajax(param, function(data) {
                $.isFunction(callback) && callback(data);
            });
        },
        //绑定微信APP
        bindWeixin: function(userid, unionid, callback){
            var param = {
                "jsonrpc": "2.0",
                "method": "User.BindWeixin",
                "id": 54321,
                "params" : {
                    "unionid": unionid,
                    "userid": userid
                }
            };

            $.Func.ajax(param, function(data){
                $.isFunction(callback) && callback(data);
            });
        },
        cookie :{
            setCookie : function(name,value)
            {
                var Days = 30;
                var exp = new Date();
                exp.setTime(exp.getTime() + Days*24*60*60*1000);
                document.cookie = name + "="+ escape (value) + ";path=/;expires=" + exp.toGMTString();
            },
            //读取cookies
            getCookie : function(name)
            {
                var arr, reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
                if(arr = document.cookie.match(reg)){
                    return unescape(arr[2]);
                }
                else{
                    return null;
                }
            },
            //删除cookies
            delCookie : function(name)
            {
                var exp = new Date();
                exp.setTime(exp.getTime() - 1);
                var cval=getCookie(name);
                if(cval !== null){
                    document.cookie= name + "="+cval+";expires="+exp.toGMTString();
                }
            }

        },
        getJSAPI: function(){
            var url = location.href.split('#')[0];
            $.ajax({
                url: 'http://wx.gupiaoxianji.com/gzh/nxb/sign/',
                contentType:"application/json",
                data: JSON.stringify({
                    url: url
                }),
                type: "POST",
                success: function(res, status){
                    if(status === 'success'){
                        wx.config({
                            //debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                            appId: res.appid, // 必填，公众号的唯一标识
                            timestamp: res.timestamp, // 必填，生成签名的时间戳
                            nonceStr: res.noncestr, // 必填，生成签名的随机串
                            signature: res.signature,// 必填，签名，见附录1
                            jsApiList: [
                                //'checkJsApi',
                                'onMenuShareTimeline',
                                'onMenuShareAppMessage',
                                'onMenuShareQQ',
                                'chooseWXPay']  // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                        });
                    }
                }
            });
        }
    }



});