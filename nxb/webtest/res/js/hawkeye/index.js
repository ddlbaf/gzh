define("hawkeye/index",["libs/subscribe","libs/template"],function(t,e,s){var n=t("libs/subscribe"),a=t("libs/template");a.helper("numToPercent",function(t){return(100*t).toFixed(2)}),a.helper("shortDate",function(t){return t.substring(4,6)+"."+t.substring(6)});var i={bindEvent:function(){$("body").delegate(".js-tap",$.Func.TAP,function(t){var e=$(this).data("handler");i[e]&&i[e].call(this)})},getFundid:function(t){var e={jsonrpc:"2.0",method:"EagleEyes.ToFundid",id:54321};$.Func.ajax(e,function(e){e.result&&t&&t(e.result.fundid)})},subscribe:function(){var t=$(this).data("fundid");return!!t&&void($.User.wxgzh?n.subscribeFund($.User.userid,t,function(t){1==t.result.status?$.Func.pop("订阅成功！"):$.Func.pop(t.result.status.msg)}):$.Func.showLayer("#popBindAccount"))},getEye:function(){var t=this,e={jsonrpc:"2.0",method:"EagleEyes.Broadcast",id:54321,params:{}};$.Func.ajax(e,function(e){var s=e.result,n=s.day.toString();s.newDate=n.substring(0,4)+"年"+n.substring(4,6)+"月"+n.substring(6)+"日";var i=a("broadcast-template",s);$("#broadcast").html(i),t.getHistory(n)})},getHistory:function(t){var e={jsonrpc:"2.0",method:"EagleEyes.BroadcastHistory",id:54321,params:{date:t}};$.Func.ajax(e,function(t){var e=t.result,s=a("probability-template",e);$("#probability").html(s)})},getIndustryStock:function(t){var e={jsonrpc:"2.0",method:"EagleEyes.IndustryStock",id:54321,params:{blockid:885734}};$.Func.ajax(e,function(t){var e=t.result;console.log(e)})},getBlock:function(){var t={jsonrpc:"2.0",method:"EagleEyes.Block",id:54321,params:{}};$.Func.ajax(t,function(t){var e=t.result;if(console.log(e),e&&e.bkdata){e.colors=["bg-blue","bg-pink","bg-yellow","bg-blue","bg-pink","bg-yellow"];var s=a("block-template",e);$("#block").html(s)}else{var s='<li class="empty-li">暂无</li>';$("#block").html(s)}})},init:function(){var t=this;$.Func.getUserInfo(),$.User.wxgzh?t.getFundid(function(e){var s=$.User.userid;n.subscribeList(s,function(a){~$.inArray(e,a)?(t.getEye(),t.getBlock(),$("#subscribe").removeClass("hide")):($("#noSubscribe").removeClass("hide"),n.vipService(s,function(t){~$.inArray(e,t)?($("#noSubscribe").removeClass("hide"),$("#nosubscribeBtn").html('<a class="btn" href="../../pay/pay.html?fundid='+e+'"><img src="../res/img/hawkeye/yybb_btn.png" width="100%" alt=""/></a>')):n.checkFundFreeStatus(s,e,function(t){1==t?$("#nosubscribeBtn").html('<a href="javascript:;" class="btn js-tap" data-fundid="'+e+'" data-handler="subscribe"><img src="../res/img/hawkeye/yybb_btn.png" width="100%" alt=""/></a>'):$("#nosubscribeBtn").html('<a class="btn" href="../../pay/pay.html?fundid='+e+'"><img src="../res/img/hawkeye/yybb_btn.png" width="100%" alt=""/></a>')})}))})}):$("#noSubscribe").removeClass("hide"),this.bindEvent()}};s.exports=i});