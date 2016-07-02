define(function(require, exports, module) {

    var Pie = require('libs/piechart');
    var template = require('libs/template');

    template.helper('numToPercent', function (number) {
        return (number*100).toFixed(2) + '%'
    });

    template.helper('dateFormate', function (createdate) {
        var date = createdate.substring(0, 10).split('-');
        return date[0] + '年' + date[1] + '月' + date[2] + '日';
    });

    template.helper('getNowDate', function () {
        var now = new Date();
        var format = 'yyyy-MM-dd h:m:s';
        var date = {
            "M+": now.getMonth() + 1,
            "d+": now.getDate(),
            "h+": now.getHours(),
            "m+": now.getMinutes(),
            "s+": now.getSeconds(),
            "q+": Math.floor((now.getMonth() + 3) / 3),
            "S+": now.getMilliseconds()
        };
        if (/(y+)/i.test(format)) {
            format = format.replace(RegExp.$1, (now.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        for (var k in date) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1
                    ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
            }
        }
        return format;
    });

    var Action = {
        bindEvent : function(){
            $('body').delegate('.js-tap', $.Func.TAP, function(e){
                var handler = $(this).data('handler');
                Action[handler] && Action[handler].call(this);
            })
        },
        //持仓详情
        holdingList: function(fundid){
            var that = this;
            var param = {
                "jsonrpc": "2.0",
                "method": "Fund.FundHoldStockNoCategory",
                "id": 54321,
                "params" : {
                    "Fundid": fundid
                }
            };
            $.Func.ajax(param, function(data){
                var result = data.result;
                var per = 0;
                var pieArray = [];
                var colors = ['#2196F3', '#9B58B5', '#FF8806','#2196F3', '#9B58B5', '#FF8806','#2196F3', '#9B58B5', '#FF8806'];

                //获取持仓各项比例,制作圆饼图
                $.each(result.data, function(i, t){
                    per += t.percent;
                    pieArray.push({
                        data: t.percent, //该项数值（必填）
                        //ratio: t.percent,  //该项比例（可选，若不设置，则程序将通过data自行计算比例）
                        fillStyle: colors[i], //该项扇形填充色（必填）
                        label: t.stockname //该项名称（可选）
                    });

                })
                pieArray.push({
                    data: 1-per, //该项数值（必填）
                    //ratio: t.percent,  //该项比例（可选，若不设置，则程序将通过data自行计算比例）
                    fillStyle: '#FF8806', //该项扇形填充色（必填）
                    label: '现金' //该项名称（可选）
                });


                var html = template('holding-template', result);
                $('#holdingList').html(html);
                that.renderPage(fundid, per, pieArray);
            })
        },
        //最新调仓
        operatingList: function(fundid){
            var param = {
                "jsonrpc": "2.0",
                "method": "Fund.FundOperateRecord",
                "id": 54321,
                "params" : {
                    "Fundid": fundid,
                    "Count" : 2
                }
            };
            $.Func.ajax(param, function(data){
                var result = data.result;
                result.fundid = fundid;
                //console.log(result);
                var html = template('operating-template', result);
                $('#operatingList').html(html);
            })
        },
        //渲染页面
        renderPage : function(fundid, per, pieArray){
            var that = this;
            var param = {
                "jsonrpc": "2.0",
                "method": "Fund.FundInfo",
                "id": 54321,
                "params" : {
                    "fundid": fundid
                }
            };
            $.Func.ajax(param, function(data){
                var result = data.result;
                result.data[0].per = per;
                //console.log(result);
                var html = template('info-template', result.data[0]);
                $('#info').html(html);

                that.renderPie(pieArray);
            })
        },
        renderPie: function(pieArray){
            new Pie({
                selector: '#canvas_fan',  //canvas容器（可选，若不设置，则默认容器为 '#canvas'）
                lineWidth: 1,  //文本指向线的宽度（可选，若不设置，则默认值为1）
                autoline: 20,  //文本指向线的长度（可选，若不设置，则默认值为20）
                radio: 0.50,  //设置文本中心位置（可选，若不设置，则默认值为0.60）
                per: 0.90,  //设置比例至少为多少时在扇形里面显示文本（可选，若不设置，则默认值为0.10）
                textAttr: {
                    fontSize: 9,  //文本字号（可选，若不设置，则默认值为12）
                    fontWeight: 'normal',  //文本是否加粗（可选，若不设置，则默认值为' normal'）
                    fontFamily: 'Microsoft YaHei'  //文本字体（可选，若不设置，则默认值为 'Helvetica Neue'）
                },
                padding: 10,  //canvas内边距（可选，若不设置，则默认值为10）
                radius: 80,  //半径（可选，若不设置，则程序将根据canvas尺寸和padding值自行计算半径）
                animateEnble: true,  //是否开启360度动态画图（可选，若不设置，则默认值为 true）
                type: 1  //1是点击放大效果，2是点击移动效果（可选，若不设置，则默认值为1）
            }).draw(pieArray);
        },
        init : function(){
            var fundid = $.Func.getParam('fundid');
            this.holdingList(fundid);
            this.operatingList(fundid);
            //this.bindEvent();
        }
    }

    module.exports = Action;
});