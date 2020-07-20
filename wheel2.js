function wheel(wins,opts,runOpts){
    //初始化参数
    this.init(wins,opts,runOpts);
    //获取窗口
    this.getWin();
    //创建盒子
    this.creatBox();
    //创建轮播列表
    this.creatList();
    //创建按钮
    this.creatBtn();
    //自动轮播
    this.autoMove();
    //点击播放
    this.clickMove();
}
wheel.prototype={
    init(wins,opts,runOpts){
        this.opts=opts;
        this.runOpts=runOpts;
        var wins=document.querySelector(wins);
    var win=wins;
    if(!(wins&&wins.nodeType==1)){
        console.error("窗口元素not find");
        return;
    }
this.wins=this.win=wins;
//图片的地址添加一个
opts.imgs.push(opts.imgs[0]); //把第一张图片加进去,不用再赋值,加进去就可以了 
//图片的链接添加一个
opts.links.push(opts.links[0]); 
//图片颜色
opts.imgColor.push(opts.imgColor[0]);


this.imgLength=opts.imgs.length;//+1长度改变,数组没变
if(this.imgLength==1){
    console.error("没有传入相应的轮播内容");
        return;
}
this.imgSize=opts.imgSize;
if(!(this.imgSize instanceof Array)){//instanceof通过返回一个布尔值来指出，这个对象是否是这个特定类或者是它的子类的一个实例。
    console.error("请输入合法的尺寸类型");
}
if(this.imgSize.length==0){
    this.imgSize[0]=document.documentElement.clientWidth;//获取浏览器窗口的宽度,参数没有传,设置为默认值
    this.imgSize[1]=400;
}
//some对数组中的每个元素都执行一次指定的函数（callback），直到此函数返回 true，如果发现这个元素，some 将返回 true，如果回调函数对每个元素执行后都返回 false ，some 将返回 false。它只对数组中的非空元素执行指定的函数，没有赋值或者已经删除的元素将被忽略。
if(this.imgSize.some(function(val){
    return val==0;
})){
    for(var i=0;i<2;i++){
        if(this.imgSize[i]==0){
            this.imgSize[i]=500;
        }
    }
}
this.btnColor=opts.btnColor||"green";
this.btnActive=opts.btnActive||"red";
this.btnPos=opts.btnPos||["center","20"];
this.runOpts=runOpts||{};
this.time=0;
if(runOpts.time){
    this.time=runOpts.time*1000;
}else{
    this.time =5000;
}

this.eachTime=0;
if(runOpts.eachTime){
    this.eachTime=runOpts.eachTime*1000;
}else{
    this.eachTime =500;
}

this.runStyle="null";
if(runOpts.runStyle=="linear"||!(runOpts.runStyle)){
    this.runStyle=Tween.Linear;
}else if(runOpts.runStyle=="in"){
    this.runStyle=Tween.Quad.easeIn;
}else if(runOpts.runStyle=="out"){
    this.runStyle=Tween.Quad.easeOut;
}

    },
    getWin(){
        this.wins.style.cssText="width:100%;height:"+this.imgSize[1]+"px;overflow:hidden;position:relative;";
    },
    creatBox(){
        this.box=document.createElement("div");
        this.box.style.cssText="width:"+this.imgLength*100+"%;height:100%;";
        this.wins.appendChild(this.box);//放到父元素中

    },
    creatList(){
        for(var i=0;i<this.imgLength;i++){
            var divList=document.createElement("div");
            divList.style.cssText=`float:screenLeft;width: ${100/this.imgLength}%;height:100%;background:${this.opts.imgColor[i]}`;//用单引号可以随便换行,双引号不行
        
            var link=document.createElement("a");
            link.href=this.opts.links[i];
            link.style.cssText="width:"+this.imgSize[0]+"px;height:"+this.imgSize[1]+"px;display:block;marign:auto;background:url("+this.opts.imgs[i]+")no-repeat 0 0";//no-repeat不重复铺 
            divList.appendChild(link);
            this.box.appendChild(divList);
        }
    },
    creatBtn(){
        var btnBox=document.createElement("div");
btnBox.style.cssText="width:120px;height:20px;position:absolute;left:0;right:0;margin:auto;bottom:"+this.btnPos[1]+"px";
this.btns=[];

for(var i=0;i<this.imgLength-1;i++){
    var bgcolor=i==0?this.btnActive:this.btnColor;
    var btn=document.createElement("div");
    btn.style.cssText="width:20px;height:20px;background:"+bgcolor+";border-radius:50%;margin:0 10px;cursor:pointer;float:left";
   btnBox.appendChild(btn);
    this.btns.push(btn);
}
this.wins.appendChild(btnBox);

    },
    autoMove() {
        //获取窗口大小
        this.winW = parseInt(getComputedStyle(this.wins, null).width);

        //自动轮播
        this.num = 0;
        // console.log(this.btns.length-1);

        this.t = setInterval(function () {
            this.num++;
            console.log(this.num);
            if (this.num > this.btns.length - 1) {
                animate(this.box, {
                    "marginLeft": -this.num * this.winW
                }, this.movetime, this.moveStyle, function () {
                    this.box.style.marginLeft = 0;
                });
                this.num = 0;
            } else {
                animate(this.box, {
                    "marginLeft": -this.num * this.winW
                }, this.movetime, this.moveStyle)
            }

            for (var i = 0; i < this.btns.length; i++) {
                this.btns[i].style.background = this.btnColor;
            }
            this.btns[num].style.background = this.btnActive;
        }, this.time)
    },
    clickMove() {
        for (let i = 0; i < this.btns.length; i++) {
            this.btns[i].onclick = function () {
                this.num = i;
                animate(this.box, {
                    "marginLeft": -this.num * this.winW
                }, this.movetime)

                for (var j = 0; j < this.btns.length; j++) {
                    this.btns[j].style.background = this.btnColor;
                }
                this.btns[num].style.background = this.btnActive;
            }
        }
    }


}