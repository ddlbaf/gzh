define("club/index",["libs/template","libs/subscribe"],function(t,a,e){var i=t("libs/template"),n=t("libs/subscribe");i.helper("monPrice",function(t){if(t)return t[0].actualprice.toFixed(2)+"/"+t[0].payment||""});var s={bindEvent:function(){$("body").delegate(".js-tap","click",function(t){var a=$(this).data("handler");s[a]&&s[a].call(this)})},getClubList:function(t){var a={jsonrpc:"2.0",method:"Product.Clubber",id:54321,params:{}};$.Func.ajax(a,function(a){var e=a.result;$.isFunction(t)&&t(e)})},init:function(){var t=this;$.Func.getUserInfo();var a=$.User.userid;a||(location.href=$.CONFIG.CLUB),t.bindEvent(),n.vipService(a,function(a){t.getClubList(function(t){$.each(t.data,function(e,i){switch(i.productclass){case"yingyan":t.data[e].url="../hawkeye/index.html";break;case"weipan":t.data[e].url="wallet.html"}~$.inArray(i.productclass,a)?t.data[e].status=0:t.data[e].status=1});var e=i("list-template",t);$("#list").html(e)})})}};e.exports=s});