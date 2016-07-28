define("pay/pay",["libs/template"],function(t,n,e){var a=t("libs/template");a.helper("fenToyuan",function(t){var n=Math.ceil(t/100);return n}),a.helper("dateFormate",function(t){return t.substring(0,10)}),a.helper("arrayToString",function(t){return t.join(",")});var o={iscroll:null,curType:1,type1:{data:null},type2:{data:null}},r=0,i={productclass:null,curNum:0,discount:0,data:{}},c={},u={bindEvent:function(){$("body").delegate(".js-tap",$.Func.TAP,function(t){var n=$(this).data("handler");u[n]&&u[n].call(this)}),window.onhashchange=function(){var t=location.hash.replace("#","");"coupon"==t?$("body").addClass("showCounpons"):$("body").removeClass("showCounpons")}},modifyTitle:function(t){if(t){var n=$("body");document.title=t;var e=$('<iframe src="/favicon.ico"></iframe>').on("load",function(){setTimeout(function(){e.off("load").remove()},0)}).appendTo(n)}},productInfo:function(t){var n=this,e={jsonrpc:"2.0",method:"Product.PriceDetail",id:54321,params:{productclass:t}};$.Func.ajax(e,function(e){var o=e.result;if(o){i={productclass:t,curNum:0,discount:0,data:o.goods};var c=i.data[i.curNum].productname+"信息服务";r=o.goods[i.curNum].actualprice,n.modifyTitle(c),$("#title").html(c),$("#totalPrice").html(r.toFixed(2));var u=a("price-template",i.data[i.curNum]);$("#price").html(u),u=a("payment-template",o),$("#paymentList").html(u),n.checkCounpon()}})},reducePeriod:function(){var t=parseInt($("#period").val())||1,n=i.discount;t>1&&(t--,$("#period").val(t),r=i.data[i.curNum].actualprice*t,$("#totalPrice").html((r-n).toFixed(2)))},addPeriod:function(){var t=parseInt($("#period").val())||1,n=i.discount;t++,$("#period").val(t),r=i.data[i.curNum].actualprice*t,$("#totalPrice").html((r-n).toFixed(2))},showPrice:function(){var t=$(this).data("productid").trim(),n=$(this).data("number"),e=parseInt($("#period").val())||1;i.curNum=n,i.discount=0,u.checkCounpon(),$("#paymentList .js-tap").removeClass("on").eq(n).addClass("on"),$("#productid").val(t),r=i.data[n].actualprice*e,$("#totalPrice").html(r.toFixed(2));var o=a("price-template",i.data[n]);$("#price").html(o)},showCoupons:function(){var t=u;$.Func.getUserInfo(),$.User.wxgzh&&(location.hash="coupon",t.couponUserObtain(o.curType,function(n){o.type1.data=n.data,t.renderCoupon(n)}))},getCounpons:function(t){var n=this;$.Func.getUserInfo(),$.User.wxgzh&&(o.type1.data?$.isFunction(t)&&t(o.type1.data):n.couponUserObtain(o.curType,function(n){o.type1.data=n.data,$.isFunction(t)&&t(n.data)}))},checkCounpon:function(){var t=this,n=0,e=$("#productid").val();t.getCounpons(function(t){t&&$.each(t,function(a,o){~$.inArray(e,o.productsavailable)&&n++,a==t.length-1&&($("#coupon").val(n),$("#couponLink").html(n+"张可用"))})})},useCoupon:function(){var t=$(this).data("couponid"),n=$(this).data("productid").toString().split("."),e=i.data[i.curNum].productid.toString(),a=$(this).data("amount");~$.inArray(e,n)?(i.discount=+a,$("#coupon").val(t),$("#couponLink").html("优惠"+a+"元"),location.hash="coupon"):$.Func.pop("这张优惠券不能用在当前产品上！")},createOrder:function(t,n,e,a){var o={jsonrpc:"2.0",method:"Product.CreateOrderGZH",id:54321,params:{userid:$.User.userid,openid:$.User.openid,productid:t,quantity:n,channelid:1,appenv:"weixin_gzh_nxb",couponid:e}};$.Func.ajax(o,function(t){var n=t.result;n&&a&&a(n)})},payWX:function(){var t=parseInt($("#productid").val()),n=parseInt($("#period").val())||1,e=t.toString()+"-"+n.toString(),a=parseInt($("#couponid").val())||0;return t?($("#btnLine").addClass("btnline-loading"),void(c.hasOwnProperty(e)?u.onpay(c[e]):u.createOrder(t,n,a,function(t){c[e]=t,u.onpay(t)}))):($.Func.pop("请选择产品支付"),!1)},onpay:function(t){wx.ready(function(){function n(){WeixinJSBridge.invoke("getBrandWCPayRequest",{appId:t.appId,timeStamp:t.timeStamp,nonceStr:t.nonceStr,"package":t["package"],signType:t.signType,paySign:t.paySign},function(t){"get_brand_wcpay_request:ok"==t.err_msg&&(location.href="pay_result.html?status=1&productid="+i.productclass+"&money="+r.toFixed(2)),$("#btnLine").removeClass("btnline-loading")})}"undefined"==typeof WeixinJSBridge?document.addEventListener?document.addEventListener("WeixinJSBridgeReady",n,!1):document.attachEvent&&(document.attachEvent("WeixinJSBridgeReady",n),document.attachEvent("onWeixinJSBridgeReady",n)):n()})},showTab:function(){var t=u,n=$(this).data("type")||1;o.curType=n,$(this).parent().children().removeClass("on"),$(this).addClass("on"),o["type"+n].data?t.renderCoupon(o["type"+n]):t.couponUserObtain(o.curType,function(e){t.renderCoupon(e),o["type"+n].data=e.data})},couponUserObtain:function(t,n){uin=$.User.userid;var e={jsonrpc:"2.0",method:"Coupon.CouponUserObtain",id:54321,params:{userid:uin,type:t}};$.Func.ajax(e,function(t){var e=t.result;e&&$.isFunction(n)&&n(e)})},renderCoupon:function(t){o.iscroll||(o.iscroll=new IScroll("#wrapper")),t.data?$("#wrapper").removeClass("show-empty"):$("#wrapper").addClass("show-empty");var n=a("li-template",t);$("#couponList").html(n),o.iscroll.refresh()},closeLayer:function(){$(this).parent().parent().removeClass("show")},filter:function(t){for(var n=new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）—|{}【】‘；：”“'。，、？]"),e="",a=0;a<t.length;a++)e+=t.substr(a,1).replace(n,"");return e},init:function(){$.Func.getJSAPI();var t=$.Func.getParam("productid");t&&(t=this.filter(t),this.productInfo(t),this.bindEvent())}};e.exports=u});