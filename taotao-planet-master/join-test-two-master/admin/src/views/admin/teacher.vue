<template>
    <div>
        <p>
            <button v-on:click="add()" class="btn btn-white btn-default btn-round">
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

        <div class="row">
        <div v-for="teacher in teachers" class="col-md-3">
            <div>
            <span class="profile-picture">
                <img v-show="!teacher.image" class="editable img-responsive editable-click editable-empty" src="/static/image/teachers/header2.jpeg" v-bind:title="teacher.intro"/>
                <img v-show="teacher.image" class="editable img-responsive editable-click editable-empty" v-bind:src="teacher.image" v-bind:title="teacher.intro"/>
            </span>

            <div class="space-4"></div>

            <div class="width-85 label label-info label-xlg arrowed-in arrowed-in-right">
                <div class="inline position-relative">
                <a href="javascript:;" class="user-title-label dropdown-toggle" data-toggle="dropdown">
                    <i class="ace-icon fa fa-circle light-green"></i>
                    &nbsp;
                    <span class="white">{{teacher.position}}</span>
                </a>
                </div>
            </div>
            </div>

            <div class="space-6"></div>

            <div class="text-center">
            <a href="javascript:;" class="text-info bigger-110" v-bind:title="teacher.motto">
                <i class="ace-icon fa fa-user"></i>
                {{teacher.name}}【{{teacher.nickname}}】
            </a>
            </div>

            <div class="space-6"></div>

            <div class="profile-social-links align-center">
            <button v-on:click="edit(teacher)" class="btn btn-xs btn-info">
                <i class="ace-icon fa fa-pencil bigger-120"></i>
            </button>
            &nbsp;
            <button v-on:click="del(teacher.id)" class="btn btn-xs btn-danger">
                <i class="ace-icon fa fa-trash-o bigger-120"></i>
            </button>
            </div>

            <div class="hr hr16 dotted"></div>

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
                                <label class="col-sm-2 control-label">姓名</label>
                                <div class="col-sm-10">
                                    <input v-model="teacher.name" class="form-control" placeholder="姓名,无错类型:String">
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="col-sm-2 control-label">昵称</label>
                                <div class="col-sm-10">
                                    <input v-model="teacher.nickname" class="form-control" placeholder="昵称,无错类型:String">
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="col-sm-2 control-label">头像</label>
                                <div class="col-sm-10">
                                    <big-file 
                                    v-bind:suffixs="['jpg','jpeg','png']"
                                    v-bind:input-id="'image-upload'"
                                    v-bind:text="'上传头像'" 
                                    v-bind:use="FILE_USE.TEACHER.key"
                                    v-bind:after-upload="afterUpload"></big-file>
                                    <div v-show="teacher.image" class="row">
                                        <div class="col-md-4">
                                            <img v-bind:src="teacher.image" class="img-responsive">
                                        </div>
                                    </div>
                                    
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="col-sm-2 control-label">职位</label>
                                <div class="col-sm-10">
                                    <input v-model="teacher.position" class="form-control" placeholder="职位,无错类型:String">
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="col-sm-2 control-label">座右铭</label>
                                <div class="col-sm-10">
                                    <input v-model="teacher.motto" class="form-control" placeholder="座右铭,无错类型:String">
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="col-sm-2 control-label">简介</label>
                                <div class="col-sm-10">
                                    <textarea v-model="teacher.intro" class="form-control" placeholder="简介,无错类型:String">
                                    </textarea>
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

import Pagination from '../../components/pagination.vue'
// import File from '../../components/file.vue'
import BigFile from '../../components/big-file.vue'
export default {
    components: {Pagination,BigFile},
	name: 'Teacher',
    data: function (){
        return {
            teacher:{},
            teachers:[],
            FILE_USE:FILE_USE,//全局变量必须在局部变量引用 当前文件才能引用
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
            _this.teacher = {};//新增时 清空文本框中内容
            $("#form-modal").modal("show");
        },//end method add
        list(page){
            Loading.show();
            let _this = this;
            let url = "/business/admin/teacher/list";
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
                    _this.teachers = result.content.list;
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
                   || !Validator.require(_this.teacher.name, "姓名")
                   || !Validator.length(_this.teacher.name, "姓名", 1, 50)
                   || !Validator.length(_this.teacher.nickname, "昵称", 1, 50)
                   || !Validator.length(_this.teacher.image, "头像", 1, 100)
                   || !Validator.length(_this.teacher.position, "职位", 1, 50)
                   || !Validator.length(_this.teacher.motto, "座右铭", 1, 50)
                   || !Validator.length(_this.teacher.intro, "简介", 1, 500)
           ) {
               return;
           }

            Loading.show();
            let url = "/file/admin/file/save";
            _this.$ajax.post(url,_this.teacher,
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
        edit(teacher){
            let _this = this;
            // _this.teacher = teacher;
            //利jquery的extend方法解决 取消更新 表格假更新问题
            _this.teacher = $.extend({},teacher);
            $("#form-modal").modal("show");
        },//end method edit
        del(id){
            let _this = this;
            Confirm.show("删除后不可恢复,请三思而后行",function(){
                Loading.show();
                let url = "/business/admin/teacher/delete/";
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
        },//end method del
        
        afterUpload(data){
            let _this = this;
            _this.teacher.image = data.content.path;
            _this.$forceUpdate();
        }, //end method afterUpload  file.vue组件的回调函数

    },//end methods

}
</script>
  