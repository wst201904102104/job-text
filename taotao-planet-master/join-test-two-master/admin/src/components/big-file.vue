<template>
    <div>
      <button type="button" v-on:click="selectFile()" class="btn btn-white btn-default btn-round">
        <i class="ace-icon fa fa-upload"></i>
        {{text}}
      </button>
      <input class="hidden" type="file" ref="file" v-on:change="uploadFile()" v-bind:id="inputId+'-input'">
    </div>
  </template>
  
  <script>
  export default {
      name: 'big-file',
      props: {
        text: {
          default: "上传大文件"
        },
        inputId: {
          default: "file-upload"
        },
        suffixs: {
          default: []
        },
        use: {
          default: ""
        },
        afterUpload: {
          type: Function,
          default: null
        },
        shardSize:{
          default: 5 * 1024 * 1024 //默认分片大小5MB
        }
      },
      data: function () {
        return {
          // file:{},
        }
      },
      methods: {

        uploadFile(){
              let _this = this;
              let formData = new window.FormData();
              
              let file = _this.$refs.file.files[0]; //找到ref别名
              
              console.log("file:",file);
              // _this.file = file;//文件保存成全局对象 在引用file通过全局对象引用
              //生成文件表示 同一个文件重复生成的标识是相同的
              // let key = hex_md5(file);
              //md5 hex_md5(字符串) 如果直接用file会产生缓存上一次问题
              //因为File是对象类型 hex_md5要的是字符串
              let key = hex_md5(file.name+file.size+file.type);
              let key10 = parseInt(key,16);
              let key62 = Tool._10to62(key10); //key62 最短


              let suffixs = _this.suffixs;
              let fileName = file.name;
              let suffix = fileName.substring(fileName.lastIndexOf(".")+1,fileName.length).toLowerCase();
              console.log(suffix);
              let validateSuffix = false;
  
              for(let i =0; i < suffixs.length;i++){
                  if(suffixs[i].toLowerCase()===suffix){
                      validateSuffix = true;
                      break;
                  }
              }
              if(!validateSuffix){
                  Toast.warning("文件格式不正确!"+suffixs.join(","));
                                  
                  //解决连续选相同文件 onchange 后续不被触发的bug
                  //每次上传之后 清空文本框的值
                  $("#"+_this.inputId+"-input").val("");
                  return;
              }
            console.log("文件分片上传开始");
            //文件分片
            // let shardSize = 5 * 1024 * 1024; //一个分片5MB大小
            let shardSize = _this.shardSize;
            let shardIndex = 1; //分片索引 1标识第一个分片 不要从0开始
            let size = file.size; 
            let shardTotal = Math.ceil(size / shardSize); //总片数

            let param = {
                'shardIndex': shardIndex,
                'shardSize': shardSize,
                'shardTotal': shardTotal,
                'use': _this.use,
                'name': file.name,
                'suffix': suffix,
                'size': file.size,
                'key': key62
                };
            // _this.upload(param);
            //参数准备完毕之后调用check方法 校验后台分片是否为断点
            _this.check(param);

            
            

          },//end method uploadImage
          //计算分片
          getFileShard(shardIndex,shardSize){
            let _this = this;
            let file = _this.$refs.file.files[0];
            //引用全局file 就没有只能生成2片分片的bug了
            // let file = _this.file;
            let start = (shardIndex - 1) * shardSize;	//当前分片起始位置
            let end = Math.min(file.size, start + shardSize); //当前分片结束位置
            let fileShard = file.slice(start, end); //从文件中截取当前的分片数据
            return fileShard;
          },//end method
          upload(param){

            let _this = this;
            let shardIndex = param.shardIndex;
            let shardTotal = param.shardTotal;
            let shardSize = param.shardSize;

            //获得分片
            let fileShard = _this.getFileShard(shardIndex,shardSize);
            //图片转化成Base64 传递
            let fileReader = new FileReader();
              //增加事件监听
              fileReader.onload = function(e){

                //初始进度
                Progress.show(parseInt((shardIndex -1 ) * 100 / shardTotal));

                let base64 = e.target.result;
                //给param对象增加一个shard参数
                param.shard = base64;

                let url = "/file/admin/file/upload"
                //let url = "/file/admin/oss-append"
                _this.$ajax.post(url,param).then((response)=>{
                  
                   let resp = response.data;
                   Progress.show(parseInt(shardIndex * 100 / shardTotal));
                    //如果当前分片索引 小于 总的片数
                    if(shardIndex < shardTotal){
                        //上传下一个分片,递归调用
                        param.shardIndex = param.shardIndex + 1;
                        //测试断点 续传
                        // if(param.shardIndex == 3) return;
                        _this.upload(param);
                    }else{
                      
                      _this.afterUpload(resp)
                      Progress.hide();
                      //解决连续选相同文件 onchange 后续不被触发的bug
                       //每次上传之后 清空文本框的值
                       //该代码 导致后续获取不到file对象
                       //把该代码移到else中 就解决了该bug 
                       //等待所有分片都上传完成之后在清空文本框的值
                      $("#"+_this.inputId+"-input").val("");
                    }
          
                    
                });//end post

              }//end onload
              fileReader.readAsDataURL(fileShard);
          },//end method upload
          selectFile(){
              let _this = this;
              // $("#file-upload-input").trigger("click");
              $("#"+_this.inputId+"-input").trigger("click");
          },//end method selecdtIamge()
           /**
       * 检查文件状态，是否已上传过？传到第几个分片？
       */
        check (param) {
          let _this = this;
            let url = "/file/admin/file/check/";
          // let url = "/file/admin/oss-check/";
          _this.$ajax.get( url + param.key).then((response)=>{
            let resp = response.data;
            console.log("请求/file/admin/oss-check/:返回值:response"+response)
            console.log("请求/file/admin/oss-check/:返回值:response.data"+response.data)
        
            if (resp.success) {
              let obj = resp.content;
              if (!obj) {
                param.shardIndex = 1;
                console.log("没有找到文件记录，从分片1开始上传");
                _this.upload(param);
              } else if (obj.shardIndex === obj.shardTotal) {
                // 已上传分片 = 分片总数，说明已全部上传完，不需要再上传
                Toast.success("文件极速秒传成功！");
                _this.afterUpload(resp);
                $("#" + _this.inputId + "-input").val("");
              }  else {
                param.shardIndex = obj.shardIndex + 1;
                console.log("找到文件记录，从分片" + param.shardIndex + "开始上传");
                _this.upload(param);
              }
            } else {
              Toast.warning("文件上传失败");
              $("#" + _this.inputId + "-input").val("");
            }
          })
        },//end method check
      }//end methods 
    }//end export
  </script>
  
  