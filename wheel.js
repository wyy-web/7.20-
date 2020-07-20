// 无缝轮播图 windows  String 元素的选择器  要放入轮播图的窗口
//传入的是选择器  opts是json格式:  实现轮播图的各种选项
//img 数组 要包含轮播图片的数组
//links 数组  图片链接地址
//imgColor  数组  图片的颜色,用于全屏显示的颜色拼接
//imgSize  数组  图片大小 第一个参数代表宽  第二个参数代表高
//btnColor  String 按钮的颜色
//btnActive  String  获得焦点的按钮的颜色
//btnPos  数组  第一个参数代表x的位置  第二个参数代表y的位置


//一个函数里面实现了多种功能  用面向对象的方式,把它当作一个对象->创建窗口的方法,按钮的方法,有轮播的方法
function wheel(wins,opts,runOpts){
    //参数初始化
    var wins=document.querySelector(wins);
    var win=wins;
    if(!(wins&&wins.nodeType==1)){
        console.error("窗口元素not find");
        return;
    }

//图片的地址添加一个
opts.imgs.push(opts.imgs[0]); //把第一张图片加进去,不用再赋值,加进去就可以了 
//图片的链接添加一个
opts.links.push(opts.links[0]); 
//图片颜色
opts.imgColor.push(opts.imgColor[0]);


var imgLength=opts.imgs.length;//+1长度改变,数组没变
if(imgLength==1){
    console.error("没有传入相应的轮播内容");
        return;
}
var imgSize=opts.imgSize;
if(!(imgSize instanceof Array)){//instanceof通过返回一个布尔值来指出，这个对象是否是这个特定类或者是它的子类的一个实例。
    console.error("请输入合法的尺寸类型");
}
if(imgSize.length==0){
    imgSize[0]=document.documentElement.clientWidth;//获取浏览器窗口的宽度,参数没有传,设置为默认值
    imgSize[1]=400;
}
//some对数组中的每个元素都执行一次指定的函数（callback），直到此函数返回 true，如果发现这个元素，some 将返回 true，如果回调函数对每个元素执行后都返回 false ，some 将返回 false。它只对数组中的非空元素执行指定的函数，没有赋值或者已经删除的元素将被忽略。
if(imgSize.some(function(val){
    return val==0;
})){
    for(var i=0;i<2;i++){
        if(imgSize[i]==0){
            imgSize[i]=500;
        }
    }
}
var btnColor=opts.btnColor||"green";
var btnActive=opts.btnActive||"red";
var btnPos=opts.btnPos||["center","20"];
var runOpts=runOpts||{};
var time=0;
if(runOpts.time){
    time=runOpts.time*1000;
}else{
    time =5000;
}

var eachTime=0;
if(runOpts.eachTime){
    eachTime=runOpts.eachTime*1000;
}else{
    eachTime =500;
}

var runStyle="null";
if(runOpts.runStyle=="linear"||!(runOpts.runStyle)){
    runStyle=Tween.Linear;
}else if(runOpts.runStyle=="in"){
    runStyle=Tween.Quad.easeIn;
}else if(runOpts.runStyle=="out"){
    runStyle=Tween.Quad.easeOut;
}


//创建html结构和样式
//1.win样式    cssText一次性可以设置多个样式
wins.style.cssText="width:100%;height:"+imgSize[1]+"px;overflow:hidden;position:relative;";
//添加容器
var box=document.createElement("div");
box.style.cssText="width:"+imgLength*100+"%;height:100%;";
wins.appendChild(box);//放到父元素中



//创建每一个轮播图
for(var i=0;i<imgLength;i++){
    var divList=document.createElement("div");
    divList.style.cssText=`float:screenLeft;width: ${100/imgLength}%;height:100%;background:${opts.imgColor[i]}`;//用单引号可以随便换行,双引号不行

    var link=document.createElement("a");
    link.href=opts.links[i];
    console.log(imgSize);
    link.style.cssText="width:"+imgSize[0]+"px;height:"+imgSize[1]+"px;display:block;marign:auto;background:url("+opts.imgs[i]+")no-repeat 0 0";//no-repeat不重复铺 
    divList.appendChild(link);
    box.appendChild(divList);
}


// //创建按钮
var btnBox=document.createElement("div");
btnBox.style.cssText="width:120px;height:20px;position:absolute;left:0;right:0;margin:auto;bottom:"+btnPos[1]+"px";
var btns=[];

for(var i=0;i<imgLength-1;i++){
    var bgcolor=i==0?btnActive:btnColor;
    console.log(bgcolor);
    var btn=document.createElement("div");
    btn.style.cssText="width:20px;height:20px;background:"+bgcolor+";border-radius:50%;margin:0 10px;cursor:pointer;float:left";
    btnBox.appendChild(btn);
    btns.push(btn);
}
wins.appendChild(btnBox);


//进行轮播
var winW = parseInt(getComputedStyle(win, null).width);
    
        // console.log(css(box,"width",100));
        //轮播的初始位置
        var num=0;
        //运动的函数
        function move() {
            //每次轮播要加1
            num++;
            //当运动到最后一张的处理逻辑
            if (num > btns.length - 1) {
                //当运动完最后一张,需要即时回到第一张
                animate(box, {
                    "margin-left": -num * winW
                }, eachTime, runStyle, function () {
                    box.style.marginLeft = 0;
                });
                //将位置再回拨到第一张
                num = 0;
            } else {
                //除了最后一张以外的运动方式
                animate(box, {
                    "marginLeft": -num * winW
                },eachTime,runStyle)
            }
            //按钮随着轮播的变化而变化
            for (var i = 0; i < btns.length; i++) {
                btns[i].style.background = btnColor;
            }
            btns[num].style.background = btnActive;
        }
    
        //自动轮播 每隔三秒,运动一次
        var t = setInterval(move,time)
    
    
        //按钮轮播
        //通过按钮进行切换
        for (let i = 0; i < btns.length; i++) {
            //给每一个按钮添加事件
            btns[i].onclick = function () {
                num = i;//将当前点击的按钮和轮播的值进行关联
                //点击的时候的运动方式
                animate(box, {
                    "margin-left": -num * winW
                }, eachTime,runStyle)
                //点击的时候按钮的变化
                for (var j = 0; j < btns.length; j++) {
                    btns[j].style.background = btnColor;
                }
                btns[num].style.background = btnActive;
            }
        }
    
    
        //鼠标移入移出
        //当鼠标移入时,停止轮播
    
        win.onmouseover = function () {
            clearInterval(t);
        }
        //当鼠标离开时,继续动画
        win.onmouseout = function () {
            t = setInterval(move, 3000)
        }


 }








