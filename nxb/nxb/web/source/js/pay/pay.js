define(function(require, exports, module) {

    var template = require('libs/template');

    //总价
    var totalPrice = 0;
    //商品信息
    var goods= {};
    //支付签名
    var signCache = {};

    var Action = {
        goods : {},
        bindEvent : function(){
            $('body').delegate('.js-tap', $.Func.TAP, function(e){
                var handler = $(this).data('handler');
                Action[handler] && Action[handler].call(this);
            })
        },
        modifyTitle: function(title){
            if(title){
                var $body = $('body');
                document.title = title;
                // hack在微信等webview中无法修改document.title的情况
                var $iframe = $('<iframe src="/favicon.ico"></iframe>').on('load', function() {
                    setTimeout(function() {
                        $iframe.off('load').remove()
                    }, 0)
                }).appendTo($body);
            }
        },
        //持仓详情
        productInfo: function(fundid){
            var that = this;
            var param = {
                "jsonrpc": "2.0",
                "method": "Fund.ProductInfo",
                "id": 54321,
                "params" : {
                    "fundid": fundid
                }
            };
            $.Func.ajax(param, function(data){
                var result = data.result;
                if(result){
                    var title = result.goods[0].productname + '信息服务';
                    $('#title').html(title);
                    that.modifyTitle(title);
                    $('#totalPrice').html(result.goods[0].actualprice);
                    totalPrice = result.goods[0].actualprice;
                    Action.goods = result.goods;
                    var html = template('price-template', Action.goods[0]);
                    $('#price').html(html);

                    html = template('payment-template', result);
                    $('#paymentList').html(html);

                }
            })
        },
        //减少数量
        reducePeriod: function(){
            var period = parseInt($('#period').val()) || 1;
            if(period > 1){
                period--;
                $('#period').val(period);
                totalPrice = Action.goods[0].actualprice * period;
                $('#totalPrice').html(totalPrice.toFixed(2));
            }
        },
        //添加数量
        addPeriod: function(){
            var period = parseInt($('#period').val()) || 1;
            period++;
            $('#period').val(period);
            totalPrice = Action.goods[0].actualprice * period;
            $('#totalPrice').html(totalPrice);
        },
        //根据选择的时间长度（年，季度，月）付费
        showPrice: function(){
            var productid = $(this).data('productid');
            var number = $(this).data('number');
            var period = parseInt($('#period').val()) || 1;
            $('#paymentList .js-tap').removeClass('on')
                .eq(number).addClass('on');
            $('#productid').val(productid);
            $('#totalPrice').html(Action.goods[number].actualprice * period);
            var html = template('price-template', Action.goods[number]);
            $('#price').html(html);
        },
        //创建订单
        createOrder: function(productid, quantity, callback){

            var param = {
                "jsonrpc": "2.0",
                "method": "Fund.CreateOrderGZH",
                "id": 54321,
                "params" : {
                    "userid": $.User.userid,
                    "openid": $.User.openid,
                    "productid": productid,
                    "quantity": quantity,
                    "channelid":1,
                    "appenv":"weixin_gzh_nxb",
                    "couponid":0
                }
            };
            $.Func.ajax(param, function(data){
                var result = data.result;
                if(result){
                    callback && callback(result);
                }
            })
        },
        //申请支付
        payWX: function(){
            var productid = parseInt($('#productid').val());
            var quantity = parseInt($('#period').val()) || 1;
            var signType = productid.toString()+'-'+quantity.toString();

            if(!productid){
                $.Func.pop('请选择产品支付');
                return false;
            }
            $('#btnLine').addClass('btnline-loading');
            if(signCache.hasOwnProperty(signType)){
                Action.onpay(signCache.signType);
            }else{
                signCache[signType] =
                Action.createOrder(productid, quantity, function(sign){
                    signCache.signType = sign;
                    Action.onpay(sign);
                });
            }
        },
        //调起支付
        onpay: function(sign){

            wx.ready(function () {
                function onBridgeReady() {
                    WeixinJSBridge.invoke(
                        'getBrandWCPayRequest', {
                            "appId": sign.appId,     //公众号名称，由商户传入
                            "timeStamp": sign.timeStamp,  //时间戳，自1970年以来的秒数
                            "nonceStr": sign.nonceStr, //随机串
                            "package": sign.package,
                            "signType": sign.signType,         //微信签名方式：
                            "paySign": sign.paySign //微信签名
                        },
                        function (res) {
                            if (res.err_msg == 'get_brand_wcpay_request:ok') {
                                location.href = 'pay_result.html?status=1&money='+ totalPrice;
                            }else{
                                //location.href = 'pay_result.html?status=0';
                            }     // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
                            $('#btnLine').removeClass('btnline-loading');
                        }
                    );
                }

                if (typeof WeixinJSBridge == "undefined") {
                    if (document.addEventListener) {
                        document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                    } else if (document.attachEvent) {
                        document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                        document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
                    }
                } else {
                    onBridgeReady();
                }
            });
        },
        init : function(){
            $.Func.getUserInfo();
            $.Func.getJSAPI();

            var fundid = $.Func.getParam('fundid');
            this.productInfo(fundid);
            this.bindEvent();

        }
    }

    module.exports = Action;
});