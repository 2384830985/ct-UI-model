/**
 * Created by Administrator on 2018/3/1.
 */
//  当前版本 0.12
;(function(){
    //initializing是为了解决我们之前说的继承导致原型有多余参数的问题。当我们直接将父类的实例赋值给子类原型时。是会调用一次父类的构造函数的。所以这边会把真正的构造流程放到init函数里面，通过initializing来表示当前是不是处于构造原型阶段，为true的话就不会调用init。
    //fnTest用来匹配代码里面有没有使用super关键字。对于一些浏览器`function(){xyz;}`会生成个字符串，并且会把里面的代码弄出来，有的浏览器就不会。`/xyz/.test(function(){xyz;})`为true代表浏览器支持看到函数的内部代码，所以用`/\b_super\b/`来匹配。如果不行，就不管三七二十一。所有的函数都算有super关键字，于是就是个必定匹配的正则。
    var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;

    // The base Class implementation (does nothing)
    // 超级父类
    this.Class = function(){};

    // Create a new Class that inherits from this class
    // 生成一个类，这个类会具有extend方法用于继续继承下去
    Class.extend = function(prop) {
        //保留当前类，一般是父类的原型
        //this指向父类。初次时指向Class超级父类
        var _super = this.prototype;

        // Instantiate a base class (but only create the instance,
        // don't run the init constructor)
        //开关 用来使原型赋值时不调用真正的构成流程
        initializing = true;
        var prototype = new this();
        initializing = false;

        // Copy the properties over onto the new prototype
        for (var name in prop) {
            // Check if we're overwriting an existing function
            //这边其实就是很简单的将prop的属性混入到子类的原型上。如果是函数我们就要做一些特殊处理
            prototype[name] = typeof prop[name] == "function" &&
            typeof _super[name] == "function" && fnTest.test(prop[name]) ?
                (function(name, fn){
                    //通过闭包，返回一个新的操作函数.在外面包一层，这样我们可以做些额外的处理
                    return function() {
                        var tmp = this._super;

                        // Add a new ._super() method that is the same method
                        // but on the super-class
                        // 调用一个函数时，会给this注入一个_super方法用来调用父类的同名方法
                        this._super = _super[name];

                        // The method only need to be bound temporarily, so we
                        // remove it when we're done executing
                        //因为上面的赋值，是的这边的fn里面可以通过_super调用到父类同名方法
                        var ret = fn.apply(this, arguments);
                        //离开时 保存现场环境，恢复值。
                        this._super = tmp;

                        return ret;
                    };
                })(name, prop[name]) :
                prop[name];
        }

        // 这边是返回的类，其实就是我们返回的子类
        function Class() {
            // All construction is actually done in the init method
            if ( !initializing && this.init )
                this.init.apply(this, arguments);
        }

        // 赋值原型链，完成继承
        Class.prototype = prototype;

        // 改变constructor引用
        Class.prototype.constructor = Class;

        // 为子类也添加extend方法
        Class.extend = arguments.callee;

        return Class;
    };
})();
//---------------------------------------------------上面是class类
;(function (window) {//轮播图插件
    var Interval;//定时器
    var _start = function (that) {
        Interval = setInterval(function () {
            if (that.ImgListLength===that.index||that.ImgListLength<that.index){
                that.index=0
            }else {
                that.index++
            }
            that.fadIn(that.index)
        },that.time)
    };
    var _bind = function (that) {
        var htmlContent = '';
        htmlContent +=
            '<div>';
        for (var i=0;i<that.ImgListLength;i++){
            htmlContent +=
                '<div class="t-Carousel-content">'+
                '<img class="t-Carousel-img" src="'+this.ImgList[i]+'" alt="">'+
                '</div>'
        }
        htmlContent +=
            '</div>'+
            '<div class="t-Carousel-Choice" style="margin-left:'+that.ChoiceDivLenght+'">';
        for (var i=0;i<that.ImgListLength;i++){
            htmlContent += '<div></div>'
        }
        htmlContent +=
            '</div>'+
            '<div class="t-Carousel-left">'+
            '<svg class="icon" width="40px" height="40px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path fill="#dbdbdb" d="M670.977781 808.954249c-5.300726 0-10.596336-2.045589-14.603603-6.126534L368.69006 509.86743c-7.818059-7.961322-7.818059-20.717857 0-28.67918l287.684118-292.960285c7.92039-8.065699 20.877493-8.182356 28.942169-0.26299 8.065699 7.919367 8.182356 20.877493 0.264013 28.942169L411.976936 495.526817l273.603425 278.620695c7.918343 8.064676 7.801686 21.022803-0.264013 28.942169C681.331593 807.002804 676.153664 808.954249 670.977781 808.954249z" /></svg>'+
            '</div>'+
            '<div class="t-Carousel-right">'+
            '<svg class="icon" width="40px" height="40px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path fill="#dbdbdb" d="M383.291616 808.954249c-5.175883 0-10.353812-1.950422-14.338566-5.862521-8.064676-7.919367-8.182356-20.877493-0.26299-28.942169l273.602402-278.620695L368.69006 216.907145c-7.919367-8.064676-7.801686-21.022803 0.26299-28.942169 8.065699-7.918343 21.022803-7.80271 28.942169 0.26299l287.685141 292.960285c7.818059 7.961322 7.818059 20.717857 0 28.67918L397.895219 802.826692C393.887952 806.907637 388.591319 808.954249 383.291616 808.954249z" /></svg>'+
            '</div>';
        $(that.ContentDOM).html(htmlContent);//插入dom
        _start(that)
    };
    var _bindDom = function (that) {
        $(that.DomComtentImg).hover(function () {//绑定DOM
            that.fadIn(that.index);
            clearInterval(Interval)
        },function () {
            _start(that)
        });
        $(that.DomCarouselLeft).hover(function () {//绑定DOM
            clearInterval(Interval)
        });
        $(that.DomCarouselLeft).click(function () {//绑定DOM
            if (that.index===0||that.index<0){
                that.index = that.ImgListLength-1
            }else {
                --that.index
            }
            that.fadIn(that.index)
        });
        $(that.DomCarouselRight).hover(function () {//绑定DOM
            clearInterval(Interval)
        });
        $(that.DomCarouselRight).click(function () {//绑定DOM
            if (that.ImgListLength<that.index||that.ImgListLength-1===that.index){
                that.index = 0
            }else {
                ++that.index
            };
            that.fadIn(that.index)
        });
        $(that.DomChoice).hover(function () {
            that.fadIn($(that.DomChoice).index(this));
            clearInterval(Interval)
        })
    };
    function Carousel(options) {
        this.time = options.time || 3000;
        this.index = 0;
        this.ImgListLength = options.ImgList.length; //长度
        this.ImgList = options.ImgList; //图片数据 （必填）
        this.ContentDOM = options.id;//容器DOM （必填）
        this.DomComtentImg = '.t-Carousel-content';//img容器DOM
        this.DomChoice = '.t-Carousel-Choice div';//下面圆圈
        this.ChoiceDivLenght = '-' + this.ImgListLength*17.55/2 + 'px';//圆圈的总长度为了适应居中
        this.DomCarouselLeft = '.t-Carousel-left';//向左
        this.DomCarouselRight = '.t-Carousel-right';//向右
        _bind(this);
        _bindDom(this)
    }
    Carousel.prototype= {
        init: function () {},
        fadIn:function (index) {
            $(this.DomComtentImg).eq(index).fadeIn().siblings().fadeOut()
            $(this.DomChoice).eq(index).addClass('t-Carousel-background').siblings().removeClass('t-Carousel-background')
        }
    };
    window.Carousel = Carousel
}(window));
//    -----------------------------------------------上面的是轮播图
var EjectAlert = Class.extend({ //alert
    bind: function (that) {//默认绑定
        $("body").append(
            '<div class="mydialog123">'+
            '<span class="close123">×</span>'+
            '<div class="mydialog-cont">'+
            '<div class="cont123">'+that.content+'</div>'+
            '</div>'+
            '<div class="footer123">'+
            '<span class="btn123 t_ok_alert">'+that.okValue+'</span>'+
            '<span class="btn123 t_remove_alert">'+that.closeValue+'</span>'+
            '</div>' +
            '</div>'
        );
        $(that.DOMxx).on('click',function () {
            that.removeAlert()
        });
        $(that.DOMclose).on('click',function () {
            that.removeAlert();
            return that.close()
        });
        $(that.DOMok).on('click',function () {
            that.removeAlert();
            return that.ok()
        })
    },
    init:function(options){//默认加载
        this.okValue = options.okValue|| '确定'; //ok里面的字
        this.ok = options.ok;           //ok的方法
        this.close = options.close;     //取消的方法
        this.closeValue = options.closeValue||'取消';//取消里面的字
        this.content = options.content||'我是里面的内容'; //里面的内容
        this.DOMxx = '.close123'; //X的dom节点
        this.DOMclose = '.t_remove_alert'; //close的dom节点
        this.DOMok = '.t_ok_alert'; //ok的dom节点
        this.show()
    },
    show: function () {
        if ($('.mydialog123').length===0){     //出现
            this.bind(this)
        }
    },
    hide: function () {  //隐藏
        this.removeAlert()
    },
    ok: function () {    //点击确定
        return true
    },
    close : function () { //点击取消
        return true
    },
    removeAlert : function () { //点击取消
        $('.mydialog123').remove()
    }
})
var ChiTu = (function () {
    return {
        EjectAlertL:function (res) {//绑定alert
            return new EjectAlert(res);
        },
        TCarousel:function (res) {//绑定轮播图
            return new Carousel(res);
        }
    }
}());
