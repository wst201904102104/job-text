<template>
    <div>
        <p>
            <button v-show="hasResource('010101')" v-on:click="add()" class="btn btn-white btn-default btn-round">
                <i class="ace-icon fa fa-edit"></i>
                新增
            </button>
            &nbsp;
            <button v-on:click="list(1)" class="btn btn-white btn-default btn-round">
                <i class="ace-icon fa fa-refresh"></i>
                刷新
            </button>
        </p>

        <pagination ref="pagination" v-bind:list="list" v-bind:itemCount="8"></pagination>

        <table id="simple-table" class="table  table-bordered table-hover">
            <thead>
            <tr>
                                        <th>id</th>
                        <th>登陆名</th>
                        <th>昵称</th>
                        <th>密码</th>
                <th>操作</th>
            </tr>
            </thead>

            <tbody>
            <tr v-for="user in users">
                            <td>{{user.id}}</td>
                            <td>{{user.loginName}}</td>
                            <td>{{user.name}}</td>
                            <td>{{user.password}}</td>
                <td>
                    <div class="hidden-sm hidden-xs btn-group">
                        <button v-show="hasResource('010103')" v-on:click="editPassword(user)" class="btn btn-xs btn-info">
                            <i class="ace-icon fa fa-key bigger-120"></i>
                        </button>
                        <button v-show="hasResource('010101')" v-on:click="edit(user)" class="btn btn-xs btn-info">
                            <i class="ace-icon fa fa-pencil bigger-120"></i>
                        </button>
                        <button v-show="hasResource('010102')" v-on:click="del(user.id)" class="btn btn-xs btn-danger">
                            <i class="ace-icon fa fa-trash-o bigger-120"></i>
                        </button>
                    </div>
                </td>
            </tr>
            </tbody>
        </table>

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
                                            <label class="col-sm-2 control-label">登陆名</label>
                                            <div class="col-sm-10">
                                                <!-- v-bind:disabled="user.id" 如果id存在 值为true 不可编辑-->
                                                <input v-bind:disabled="user.id" v-model="user.loginName" class="form-control" placeholder="登陆名,无错类型:String">
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <label class="col-sm-2 control-label">昵称</label>
                                            <div class="col-sm-10">
                                                <input v-model="user.name" class="form-control" placeholder="昵称,无错类型:String">
                                            </div>
                                        </div>
                                        <!-- 如果是修改操作,不允许修改密码,所以隐藏掉密码框 -->
                                        <div v-show="!user.id" class="form-group">
                                            <label class="col-sm-2 control-label">密码</label>
                                            <div class="col-sm-10">
                                                <input v-model="user.password" class="form-control" placeholder="密码,无错类型:String">
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
        <div id="edit-password-modal" class="modal fade" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        <h4 class="modal-title">表单</h4>
                    </div>
                    <div class="modal-body">
                        <form class="form-horizontal">
                            <div class="form-group">
                                <label class="col-sm-2 control-label">新密码</label>
                                <div class="col-sm-10">
                                    <input type="password" v-model="user.password" class="form-control" placeholder="密码,无错类型:String">
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
                        <button v-on:click="savePassword()" type="button" class="btn btn-primary">保存密码</button>
                    </div>
                </div><!-- /.modal-content -->
            </div><!-- /.modal-dialog -->
        </div><!-- /.modal -->
    </div>
</template>

<script>

import Pagination from '../../components/pagination.vue'
export default {
    components: {Pagination},
	name: 'User',
    data: function (){
        return {
            user:{},
            users:[]
        }
    },
    mounted: function (){
        //页面初始化完成之后 就加载网络数据
        let _this = this;
        //初始为 5条每页
        _this.$refs.pagination.size = 5;
        _this.list(1);//初始化查找第一页数据

    },
    methods:{

        add(){
            let _this = this;
            _this.user = {};//新增时 清空文本框中内容
            $("#form-modal").modal("show");
        },//end method add
        list(page){
            Loading.show();
            let _this = this;
            let url = "/system/admin/user/list";
            _this.$ajax.get(url,{
                params:{
                    page:encodeURI(page),
                    size:encodeURI(_this.$refs.pagination.size),
                    //$refs获取子组件
                }
            }).then(
                (response)=>{
                    Loading.hide();

                    let result = response.data;
                    //给双向绑定数据赋值
                    _this.users = result.content.list;
                    //获得数据后渲染分页组件数据
                    _this.$refs.pagination.render(page,result.content.total);
                }
            );
        },//end method list
       save(){
           let _this = this;
            //保存校验
           //用1!=1来抵消第一个的|| 这样代码就达到了最简化
           if (1 != 1
                   || !Validator.require(_this.user.loginName, "登陆名")
                   || !Validator.length(_this.user.loginName, "登陆名", 1, 50)
                   || !Validator.length(_this.user.name, "昵称", 1, 50)
                   || !Validator.require(_this.user.password, "密码")
           ) {
               return;
           }

           //KEY md5.js 中声明的盐值
           _this.user.password = hex_md5(_this.user.password + KEY);

            Loading.show();
            let url = "/system/admin/user/save";
            _this.$ajax.post(url,_this.user,
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
        edit(user){
            let _this = this;
            // _this.user = user;
            //利jquery的extend方法解决 取消更新 表格假更新问题
            _this.user = $.extend({},user);
            $("#form-modal").modal("show");
        },//end method edit
        del(id){
            let _this = this;
            Confirm.show("删除后不可恢复,请三思而后行",function(){
                Loading.show();
                let url = "/system/admin/user/delete/";
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
        editPassword(user){
            let _this = this;
            //利jquery的extend方法解决 取消更新 表格假更新问题
            _this.user = $.extend({},user);
            _this.user.password = null;
            $("#edit-password-modal").modal("show");
        },//end method editPassword

        savePassword(){
           let _this = this;

           if (1 != 1 || !Validator.require(_this.user.password, "密码")) {
               return;
           }

           //KEY md5.js 中声明的盐值
           _this.user.password = hex_md5(_this.user.password + KEY);

            Loading.show();
            let url = "/system/admin/user/save-password";
            _this.$ajax.post(url,_this.user,
            ).then(
                (response)=>{
                    Loading.hide();

                     let result = response.data;
                     if(result.success){
                         $("#edit-password-modal").modal("hide");
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

        /**
       * 查找是否有权限
       * @param id
       */
      hasResource(id) {
        return Tool.hasResource(id);
      },

    },//end methods
}//end export
</script>