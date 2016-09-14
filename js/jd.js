
var aboutme = "***京东夺宝岛抢拍-V 2.0-谁与争锋***\n"

console.log(aboutme);
console.log("有任何问题 %c QQ 244320233 Email:zhang1hang2@163.com", "color:red");
console.log("个人主页：http://zhanghang.org");


var code = "<div id='qp_div'>"
            + "最高出价<input type='text' id='qp_max_price' />&nbsp;&nbsp;&nbsp;&nbsp;"
            + "单次加价<input type='text' id='qp_add_price' value='1' />&nbsp;&nbsp;&nbsp;&nbsp;"
        + "<input type='button' value='后台抢拍' id='qp_btn_begin' class='qp_btn'/>&nbsp;&nbsp;&nbsp;&nbsp;"
        + "<input type='checkbox' id='qp_chb_auth' class='qp_btn'/>全自动&nbsp;&nbsp;&nbsp;&nbsp;"
        + "【请在拍卖剩余时间最后几秒狂点“后台抢拍”按钮】<span id='say' style='color:red;'></span></div>";
$('body').prepend(code);

// 取商品拍卖编号
var num = queryNum();
// 取商品售价
//var priceSale = queryPriceSale();
var int = 0;
var remainTime = 0;


$('#qp_btn_begin').on('click', function(){
    runjob(num);
});



function queryNum() {
    var addr = window.location.href;
    var ind = addr.lastIndexOf('/');
    var num = addr.substring(ind+1)
    return num;
}

// 取商品商城售价
function queryPriceSale(){
    var priceSale = $('.product_intro > .intro_detail .auction_intro del').html()
    console.info(priceSale)
    priceSale = priceSale.substring(1)
    return priceSale
}

function runjob(num) {
    var host = "http://dbditem.jd.com"
    var currentInterface = host + "/services/currentList.action?paimaiIds="+num+"&callback=showData&t=1432893946478&callback=jQuery8717195&_=1432893946480"
    $.get(currentInterface, function(data) {
        var start = data.indexOf('[')
        var end = data.lastIndexOf(']') + 1
        data = data.substring(start, end)
        var objs = $.parseJSON(data)
        remainTime = objs[0].remainTime/1000
        var priceCurrent = objs[0].currentPrice

        console.info("商品当前报价："+priceCurrent + "剩余时间："+remainTime)
        if (int != 0) {
            window.clearInterval(int);
        }
        int = setInterval("timeMsg(remainTime)", 200)
        var addPrice = $('#qp_add_price').val()*1.00
        bid(num, priceCurrent * 1 + addPrice)
    });
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

function timeMsg(time) {
    if (remainTime>0){
        var auto = $('#qp_chb_auth').is(':checked');
        if (remainTime<0.9 && auto){
            runjob(num);
        }
        console.info("抢拍倒计时：[ " + remainTime + " s]");
        remainTime = remainTime-0.2;
    }
}






