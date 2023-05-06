<template>
    <div>
        <p>

            <button v-on:click="list(1)" class="btn btn-white btn-default btn-round">
                <i class="ace-icon fa fa-refresh"></i>
                刷新
            </button>
        </p>
        <div class="row">
            <div class="col-md-6">
              <textarea id="resource-textarea" class="form-control" v-model="resourceStr" name="resource" rows="10"></textarea>
              <br>
              <button id="save-btn" type="button" class="btn btn-primary" v-on:click="save()">
                保存
              </button>
            </div>
            <div class="col-md-6">
              <ul id="tree" class="ztree"></ul>
            </div>
          </div>
        
    </div>
</template>

<script>

// import Pagination from '../../components/pagination.vue'
export default {
    components: {},
	name: 'Resource',
    data: function (){
        return {
            resource:{},
            resources:[],
            resourceStr:"",
            tree: {},
        }
    },
    mounted: function (){
        //页面初始化完成之后 就加载网络数据
        let _this = this;
        //初始为 5条每页
        // _this.$refs.pagination.size = 5;
        _this.list();//初始化查找第一页数据
       
    },
    methods:{

        
        list(){
            Loading.show();
            let _this = this;
            // let url = "/system/admin/resource/list";
            let url = "/system/admin/resource/load-tree";
            _this.$ajax.get(url).then(
                (response)=>{
                    Loading.hide();

                    let result = response.data;
                    //给双向绑定数据赋值
                    _this.resources = result.content;
                    //获得数据后渲染分页组件数据
                    // _this.$refs.pagination.render(page,result.content.total);
                    //初始化数结构
                    _this.initTree();
                }
            );
        },//end method list
       save(){
           let _this = this;
            //保存校验
            if (Tool.isEmpty(_this.resourceStr)) {
                Toast.warning("资源不能为空！");
                return;
            }
            let json = JSON.parse(_this.resourceStr);

            Loading.show();
            let url = "/system/admin/resource/save";
            //把json数据传递给后台  后台解析json然后插入数据库中
            _this.$ajax.post(url,json,
            ).then(
                (response)=>{
                    Loading.hide();

                     let result = response.data;
                     if(result.success){
                         $("#form-modal").modal("hide");
                         //刷新列表
                         _this.list(1);
                         Toast.success("保存成功!");
                     }else{
                         //后台返回的错误信息 提示给前端
                         Toast.warning(result.message);
                     }
                }
            );
        },//end method save
        del(id){
            let _this = this;
            Confirm.show("删除后不可恢复,请三思而后行",function(){
                Loading.show();
                let url = "/system/admin/resource/delete/";
                _this.$ajax.delete(url+id).then(
                    (response)=>{
                        Loading.hide();

                        let result = response.data;
                        if(result.success){
                            _this.list(1);
                            Toast.success("删除成功");
                        }
                    }) //end del then
            })//end show
        },//end methods del
         /**
       * 初始资源树
       */
      initTree() {
        let _this = this;
        let setting = {
          data: {
            simpleData: {
              idKey: "id",
              pIdKey: "parent",
              rootPId: "",
              // enable: true
            }
          }
        };

        _this.zTree = $.fn.zTree.init($("#tree"), setting, _this.resources);
        _this.zTree.expandAll(true);
      },//endmethod initTree
    },//end methods
}//end export
</script>