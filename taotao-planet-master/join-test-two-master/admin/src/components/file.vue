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
    name: 'file',
    props: {
      text: {
        default: "上传文件"
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
    },
    data: function () {
      return {
      }
    },
    methods: {
      uploadFile(){
            let _this = this;
            let formData = new window.FormData();
            let file = _this.$refs.file.files[0]; //找到ref别名

            let suffixs = _this.suffixs;
            let fileName = file.name;
            let suf = fileName.substring(fileName.lastIndexOf(".")+1,fileName.length).toLowerCase();
            console.log(suf);
            let validateSuffix = false;

            for(let i =0; i < suffixs.length;i++){
                if(suffixs[i].toLowerCase()===suf){
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


            //key:"file" 必须与后端controller参数名一致
            formData.append("file",file);
            formData.append("use",_this.use);//文件分类 (课程图,讲师头像)
            Loading.show();
            // let url = "/file/admin/upload"
            let url = "/file/admin/oss-simple"
            _this.$ajax.post(url,formData).then((response)=>{
                Loading.hide();
                let image = response.data.content;
                console.log(image);

                _this.afterUpload(response.data)
                // _this.teacher.image = image;
                //解决连续选相同文件 onchange 后续不被触发的bug
                //每次上传之后 清空文本框的值
                $("#"+_this.inputId+"-input").val("");
                
            });//end post
        },//end method uploadImage
        selectFile(){
            let _this = this;
            // $("#file-upload-input").trigger("click");
            $("#"+_this.inputId+"-input").trigger("click");
        },//end method selecdtIamge()
    }//end methods 
  }//end export
</script>

