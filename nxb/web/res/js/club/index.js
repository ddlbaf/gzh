define("club/index",["libs/template","libs/subscribe"],function(t,e,i){var a=t("libs/template"),n=t("libs/subscribe");a.helper("monPrice",function(t){if(t)return t[0].actualprice.toFixed(2)+"/"+t[0].payment||""});var c={bindEvent:function(){$("body").delegate(".js-tap","click",function(t){var e=$(this).data("handler");c[e]&&c[e].call(this)})},getClubList:function(t){var e={jsonrpc:"2.0",method:"Product.Clubber",id:54321,params:{}};$.Func.ajax(e,function(e){var i=e.result;$.isFunction(t)&&t(i)})},checkSubscribe:function(t){var e=this;n.vipService(t,function(t){e.getClubList(function(e){$.each(e.data,function(i,a){switch(a.productclass){case"yingyan":e.data[i].url="../hawkeye/index.html";break;case"weipan":e.data[i].url="wallet.html"}~$.inArray(a.productclass,t)?e.data[i].status=0:e.data[i].status=1});var i=a("list-template",e);$("#list").html(i)})})},closeLayer:function(){$(this).parent().parent().removeClass("show")},init:function(){var t=this;$.Func.getUserInfo(),$.User.wxgzh||$.Func.showLayer("#popBindAccount");var e=$.User.userid;$.Func.cookie.setCookie("gupiaoxianji_location","wallet"),t.checkSubscribe(e),t.bindEvent()}};i.exports=c});