
var aboutme = "***京东夺宝岛抢拍-V 2.0-谁与争锋***\n"

console.log(aboutme);
console.log("有任何问题 %c QQ 244320233 Email:zhang1hang2@163.com", "color:red");
console.log("个人主页：http://zhanghang.org");


var code = "<div id='qp_div'>"
            + "最高出价<input type='text' id='qp_max_price' />&nbsp;&nbsp;&nbsp;&nbsp;"
            + "单次加价<input type='text' id='qp_add_price' value='1' />&nbsp;&nbsp;&nbsp;&nbsp;"
        + "<input type='button' value='自动抢拍' id='qp_btn_begin' class='qp_btn'/>&nbsp;&nbsp;&nbsp;&nbsp;"
        + "【程序倒计时有误差，so请在拍卖剩下30秒内再启动自动抢拍】<span id='say' style='color:red;'></span></div>";
$('body').prepend(code);

// 取商品拍卖编号
var num = queryNum();
var int = 0;
var remainTime = 0;

var host = "http://dbditem.jd.com"

$('#qp_btn_begin').on('click', function(){
    setTimeout(function repeatMe(){
        queryStatus(num);
        var offset = new Date().getTime() % 100;
        if (offset<50) {
            setTimeout(repeatMe,100+offset);
        } else{
            setTimeout(repeatMe, offset);
        }
        
    },100);
});


function queryNum() {
    var addr = window.location.href;
    var ind = addr.lastIndexOf('/');
    var num = addr.substring(ind+1)
    return num;
}

function bid(paimaiId, price) {
    console.info("抢拍中：" + price)
    var max = $('#qp_max_price').val()
    if (price*1.00 < max*1.00) {
        var url = "/services/bid.action?t=" + getRamdomNumber();
        var data = {paimaiId:paimaiId,price:price,proxyFlag:0,bidSource:0};
        jQuery.getJSON(url,data,function(jqXHR){
            if(jqXHR!=undefined){
                if(jqXHR.result=='200'){
                    console.info("恭喜您，出价成功:" + price);
                }else if(jqXHR.result=='login'){
                    window.location.href='http://passport.jd.com/new/login.aspx?ReturnUrl='+window.location.href;
                }else{
                    console.info("很抱歉，出价失败" + jqXHR.message);
                }
            }
        });
    } else {
        console.info("当前价：" + price +", 已超出你的报价最大值" + max)
    }
}

function getRamdomNumber(){
    var num=""; 
    for(var i=0;i<6;i++) 
    { 
        num+=Math.floor(Math.random()*10); 
    } 
    return num;
}

// 查询商品状态
function queryStatus(num) {
    var queryIF = host + "/json/current/queryList.action?paimaiIds="+num;
    $.get(queryIF, function(data) {
        var objs = $.parseJSON(data);
        var remainTime = objs[0].remainTime;
        var priceCurrent = objs[0].currentPrice;
        console.info("####"+remainTime+"#####"+priceCurrent);
        if (remainTime<201 && remainTime>0) {
            var addPrice = $('#qp_add_price').val()*1.00
            bid(num, priceCurrent * 1 + addPrice)
        }
    });
}







