;(function(){
    var defaults = {
        type:'image/jpeg' // 图片类型
    };
    var ImgCompress = function(options){
        var newOptions = Object.assign(defaults,options);
        ImgCompress.prototype.init(newOptions);
    };
    ImgCompress.prototype = {
        init:function(options){
            var self = this;
            var canvas = this.createCanvas();
            this.changeEvent(this.$(options.id),function(){
                var file = self.$(options.id).files[0];
                self.base64(file,canvas,options,function(data){
                    options.success(data);
                });
            })
        },
        createCanvas:function(){ // 创建canvas
            var canvas = document.getElementById('ImgCompressCanvas');
            if(!canvas){
                var canvasTag = document.createElement('canvas');
                canvasTag.setAttribute('id','ImgCompressCanvas');
                canvasTag.setAttribute('style','display:none;');
                document.body.appendChild(canvasTag);
                canvas = document.getElementById('ImgCompressCanvas');
            }
            return canvas;
        },
        imgScaleW:function(maxWidth,width,height){
            console.log(maxWidth);
            var imgScale = {};
            var w = 0;
            var h = 0;
            //图片宽高都小于压缩宽高或者没有设置压缩大小，则不压缩
            if(width <= maxWidth && height <= maxWidth || !maxWidth){
                imgScale = {
                    width:width,
                    height:height
                }
            }else{
                //  按照最宽的一边等比压缩
                if(width >= height){

                    w = maxWidth;
                    h = Math.ceil(maxWidth * height / width);
                }else{
                    h = maxWidth;
                    w = Math.ceil(maxWidth * width / height);
                }
                imgScale = {
                    width:w,
                    height:h
                }
            }
            return imgScale;
        },
        base64:function(file,canvas,options,callback){
            var reader = new FileReader();
            var image = new Image();
            var canvas = canvas;
            var ctx = canvas.getContext("2d");
            var self = this;
            reader.onload = function(){
                var result = this.result;
                image.onload = function(){
                    var imgScale = self.imgScaleW(options.maxWidth || 1000,this.width,this.height);
                    canvas.width = imgScale.width;
                    canvas.height = imgScale.height;
                    ctx.drawImage(image,0,0,imgScale.width,imgScale.height);
                    var dataURL = canvas.toDataURL(options.type,options.opacity || 0.5);
                    ctx.clearRect(0,0,imgScale.width,imgScale.height);
                    document.getElementById(options.id).value = '';   //清空input  file
                    callback(dataURL);
                };
                image.src = result;
            };
            reader.readAsDataURL(file);
        },
        changeEvent:function(id,callback){
            id.addEventListener('change',callback,false);
        },
        $:function(id){
            return document.getElementById(id);
        }
    }
    window.ImgCompress = ImgCompress;
})();