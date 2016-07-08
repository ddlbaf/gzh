define("fund/detail",["libs/pie","libs/template"],function(t,e,n){var i=t("libs/pie"),a=t("libs/template");a.helper("numToPercent",function(t){return(100*t).toFixed(2)+"%"}),a.helper("dateFormate",function(t){var e=t.substring(0,10).split("-");return e[0]+"年"+e[1]+"月"+e[2]+"日"}),a.helper("getNowDate",function(){var t=new Date,e="yyyy-MM-dd h:m:s",n={"M+":t.getMonth()+1,"d+":t.getDate(),"h+":t.getHours(),"m+":t.getMinutes(),"s+":t.getSeconds(),"q+":Math.floor((t.getMonth()+3)/3),"S+":t.getMilliseconds()};/(y+)/i.test(e)&&(e=e.replace(RegExp.$1,(t.getFullYear()+"").substr(4-RegExp.$1.length)));for(var i in n)new RegExp("("+i+")").test(e)&&(e=e.replace(RegExp.$1,1==RegExp.$1.length?n[i]:("00"+n[i]).substr((""+n[i]).length)));return e});var r={bindEvent:function(){$("body").delegate(".js-tap",$.Func.TAP,function(t){var e=$(this).data("handler");r[e]&&r[e].call(this)})},holdingList:function(t){var e=this,n={jsonrpc:"2.0",method:"Fund.FundHoldStockNoCategory",id:54321,params:{Fundid:t}};$.Func.ajax(n,function(n){var i=n.result,r=0,d=[];$.each(i.data,function(t,e){r+=e.percent,d.push({volume:e.volume,percent:e.percent,label:e.stockname})}),d.push({percent:1-r,label:"现金"});var o=a("holding-template",i);$("#holdingList").html(o),e.renderPage(t,r,d)})},operatingList:function(t){var e={jsonrpc:"2.0",method:"Fund.FundOperateRecord",id:54321,params:{Fundid:t,Count:2}};$.Func.ajax(e,function(e){var n=e.result;n.fundid=t;var i=a("operating-template",n);$("#operatingList").html(i)})},pay:function(){var t=r.fundid;location.href="../../pay/pay.html?fundid="+t},renderPage:function(t,e,n){var i=this,r={jsonrpc:"2.0",method:"Fund.FundInfo",id:54321,params:{fundid:t}};$.Func.ajax(r,function(t){var r=t.result;r.data[0].per=e;var d=a("info-template",r.data[0]);$("#info").html(d),i.renderPie(n)})},renderPie:function(t){new i({selector:"#canvas_fan",data:t})},init:function(){this.fundid=$.Func.getParam("fundid"),this.fundid&&(this.holdingList(this.fundid),this.operatingList(this.fundid),this.bindEvent())}};n.exports=r});