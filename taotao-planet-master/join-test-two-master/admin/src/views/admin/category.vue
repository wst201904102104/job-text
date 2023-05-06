<template>
    <div>
        <div class="row">
            <div class="col-md-6">
      <p>
            <button v-on:click="add1()" class="btn btn-white btn-default btn-round">
                <i class="ace-icon fa fa-edit"></i>
                新增一级分类
            </button>
            &nbsp;
            <button v-on:click="all()" class="btn btn-white btn-default btn-round">
                <i class="ace-icon fa fa-refresh"></i>
                刷新
            </button>
        </p>
        <table id="level1-table" class="table  table-bordered table-hover">
            <thead>
            <tr>
                <th>id</th>
                <th>名称</th>
                <th>顺序</th>
                <th>操作</th>
            </tr>
            </thead>

            <tbody>
            <tr v-for="category in level1" v-on:click="onClickLevel1(category)" v-bind:class="{'active':category.id === active.id}">
                            <td>{{category.id}}</td>
                            <td>{{category.name}}</td>
                            <td>{{category.sort}}</td>
                <td>
                    <div class="hidden-sm hidden-xs btn-group">
                        <button v-on:click="edit(category)" class="btn btn-xs btn-info">
                            <i class="ace-icon fa fa-pencil bigger-120"></i>
                        </button>
                        <button v-on:click="del(category.id)" class="btn btn-xs btn-danger">
                            <i class="ace-icon fa fa-trash-o bigger-120"></i>
                        </button>
                    </div>
                </td>
            </tr>
            </tbody>
        </table>
            </div>
            <div class="col-md-6">
      <p>
            <button v-on:click="add2()" class="btn btn-white btn-default btn-round">
                <i class="ace-icon fa fa-edit"></i>
                新增二级分类
            </button>
        </p>
        <table id="level2-table" class="table  table-bordered table-hover">
            <thead>
            <tr>
                <th>id</th>
                <th>名称</th>
                <th>顺序</th>
                <th>操作</th>
            </tr>
            </thead>

            <tbody>
            <tr v-for="category in level2">
                            <td>{{category.id}}</td>
                            <td>{{category.name}}</td>
                            <td>{{category.sort}}</td>
                <td>
                    <div class="hidden-sm hidden-xs btn-group">
                        <button v-on:click="edit(category)" class="btn btn-xs btn-info">
                            <i class="ace-icon fa fa-pencil bigger-120"></i>
                        </button>
                        <button v-on:click="del(category.id)" class="btn btn-xs btn-danger">
                            <i class="ace-icon fa fa-trash-o bigger-120"></i>
                        </button>
                    </div>
                </td>
            </tr>
            </tbody>
        </table>
            </div>
        </div>

        <div id="form-modal" class="modal fade" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        <h4 class="modal-title">表单</h4>
                    </div>
                    <div class="modal-body">
                        <form class="form-horizontal">
                                        <div class="form-group">
                                            <label class="col-sm-2 control-label">父分类</label>
                                            <div class="col-sm-10">
                                                <p class="form-control-static">{{active.name || "无"}}</p>
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <label class="col-sm-2 control-label">名称</label>
                                            <div class="col-sm-10">
                                                <input v-model="category.name" class="form-control" placeholder="名称,无错类型:String">
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <label class="col-sm-2 control-label">顺序</label>
                                            <div class="col-sm-10">
                                                <input v-model="category.sort" class="form-control" placeholder="顺序,无错类型:Integer">
                                            </div>
                                        </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
                        <button v-on:click="save()" type="button" class="btn btn-primary">保存</button>
                    </div>
                </div><!-- /.modal-content -->
            </div><!-- /.modal-dialog -->
        </div><!-- /.modal -->
    </div>
</template>

<script>


export default {
	name: 'Category',
    data: function (){
        return {
            category:{},
            categorys:[],
            level1:[],
            level2:[],
            active:{},
        }
    },
    mounted: function (){
        //页面初始化完成之后 就加载网络数据
        let _this = this;
        //初始为 5条每页
        
        _this.all();//初始化查找第一页数据

    },
    methods:{

        add(){
            let _this = this;
            _this.category = {};//新增时 清空文本框中内容
            $("#form-modal").modal("show");
        },//end method add
        all(){
            Loading.show();
            let _this = this;
            let url = "/business/admin/category/all";
            _this.$ajax.get(url).then(
                (response)=>{
                    Loading.hide();
                    let result = response.data;
                    //给双向绑定数据赋值
                    _this.categorys = result.content;
                    //把所有记录格式化成树形结构
                    _this.level1 = [];  //清空防止刷新bug
                    for(let i = 0; i < _this.categorys.length;i++){
                        let c = _this.categorys[i];
                        if(c.parent === '00000000'){
                            _this.level1.push(c);
                            for(let j = 0; j < _this.categorys.length;j++){
                                let innerc = _this.categorys[j];
                                if(innerc.parent === c.id){
                                    if(Tool.isEmpty(c.children)){
                                        c.children = []; //定义一个数组
                                    }
                                    c.children.push(innerc);
                                }//inner if
                            }//end inner for
                        }//end if
                    }//end for

                    //自动触发刷新,解决要增加二级分后 需要点击一级分类才能刷新出二级问题
                    //界面需的渲染需要等VUE绑定好变量后才做,所以需要演示100ms
                    //为什么写在这个方法中,因为在生命周期函数中调用了all方法,每次vue渲染都会调用声明周期
                    //随意些在这里一定会被调用,而且是在页面渲染完成后调用
                    //vue 与 jquery都用时 有可能导致延时问题 遇到这种问题不奇怪
                    _this.level2 = [];
                    setTimeout(function(){
                        $("tr.active").trigger("click");
                    },100);

                }//end  response
            );//end then
        },//end method all
       save(){
           let _this = this;
            //保存校验
           //用1!=1来抵消第一个的|| 这样代码就达到了最简化
           if (1 != 1
                   || !Validator.require(_this.category.parent, "父id")
                   || !Validator.require(_this.category.name, "名称")
                   || !Validator.length(_this.category.name, "名称", 1, 50)
           ) {
               return;
           }

            Loading.show();
            let url = "/business/admin/category/save";
            _this.$ajax.post(url,_this.category,
            ).then(
                (response)=>{
                    Loading.hide();

                     let result = response.data;
                     if(result.success){
                         $("#form-modal").modal("hide");
                         //刷新列表
                         _this.all();
                         Toast.success("保存成功!");
                     }else{
                         //后台返回的错误信息 提示给前端
                         Toast.warning(result.message);
                     }
                }
            );
        },//end method save
        edit(category){
            let _this = this;
            // _this.category = category;
            //利jquery的extend方法解决 取消更新 表格假更新问题
            _this.category = $.extend({},category);
            $("#form-modal").modal("show");
        },//end method edit
        del(id){
            let _this = this;
            Confirm.show("删除后不可恢复,请三思而后行",function(){
                Loading.show();
                let url = "/business/admin/category/delete/";
                _this.$ajax.delete(url+id).then(
                    (response)=>{
                        Loading.hide();

                        let result = response.data;
                        if(result.success){
                            _this.all();
                            Toast.success("删除成功");
                        }
                    }) //end del then
            })//end show
        },//end methods del
        onClickLevel1(category){
            let _this = this;
            _this.active = category;
            _this.level2 = category.children;

            
        },//end method onClickLevel1
        add1(){
            let _this = this;
            _this.active = {};
            _this.level2 = [];
            _this.category = {
                parent:'00000000'
            };
            $("#form-modal").modal("show");
        },//end method add1
        add2(){
            let _this = this;
            if(Tool.isEmpty(_this.active)){
                Toast.warning("请先点击一级分类");
                return;
            }//end if
            _this.category = {
                parent:_this.active.id,
            };
            $(".modal").modal("show");
        },//end method add2
    },//end methods
}//end ex
</script>
<style scoped>
.active td{
    background-color: #d6e9c6 !important;
}
</style>