<template>
    <div class="chapter">
        <h4 class="lighter">
            <i class="ace-icon fa fa-hand-o-right icon-animated-hand-pointer blue"></i>
            <router-link to="/business/course" class="pink"> {{course.name}} </router-link>
        </h4>
        <hr>
        <p>
            <router-link to="/business/course">
                 <i class="ace-icon fa fa-edit"></i>
                返回课程
            </router-link>
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
        <pagination ref="pagination" v-bind:list="list"></pagination>
        <table id="simple-table" class="table  table-bordered table-hover">
        <thead>
           <tr>
                <th>ID</th>
                <th>名称</th>
                
                <th>操作</th>
           </tr>
        </thead>
        <tbody>
            <!--
                v-bind:key="chapter.id"  要保证key的唯一性 key重复会报错
                Vue 2.2.0+的版本里，当在组件中使用v-for时，key是必须的。
                不加上就会报错 可以通过更改设置 去掉该验证
                https://blog.csdn.net/qq_36451496/article/details/90632705
            -->
            <tr v-for='chapter in chapters' v-bind:key="chapter.id">
                <td>
                    {{chapter.id}}
                </td>
                <td>
                    {{chapter.name}}
                </td>
               
                <td>
                    <div class="hidden-sm hidden-xs btn-group">
                     
                        <button v-on:click="toSection(chapter)" class="btn btn-white btn-xs btn-info btn-round">
                            <i class="ace-icon fa  bigger-120">小节</i>
                        </button>
                        <button v-on:click="edit(chapter)" class="btn btn-xs btn-info">
                            <i class="ace-icon fa bigger-120">
                            修改
                            </i>
                            
                        </button>
                        <button v-on:click="del(chapter.id)"  class="btn btn-xs btn-danger">
                            <i class="ace-icon fa  bigger-120">
                            删除
                            </i>
                            
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
                        <label class="col-sm-2 control-label">名称</label>
                        <div class="col-sm-10">
                            <input v-model="chapter.name" class="form-control" placeholder="名称">
                        </div>
                    </div>
               
                        <div class="form-group">
                           <label class="col-sm-2 control-label">课程</label>
                        <div class="col-sm-10">
                            <p class="form-control-static">{{course.name}}</p>
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
// jquery$符号 需要npm install jquery后 import之后才能使用
// import $ from 'jquery'
//1.引入子组件pagination
// import Pagination from "../../components/pagination.vue"
import Pagination from '../../components/pagination.vue'
//2.父组件中 建立componets关联
//3.在template中应用组件



export default {
    components: {Pagination},
	name: 'Chapter',
    data: function (){
        return {
            chapter:{},
            chapters:[],
            course:{},
        }
    },
    mounted: function (){
        //页面初始化完成之后 就加载网络数据
        let _this = this;

        //取出course数据  过滤一下 因为数据有可能是空
        let course = SessionStorage.get(SESSION_KEY_COURSE) || {};
        if(Tool.isEmpty(course)){
            _this.$router.push("/welcome");
        }//end if
        _this.course = course;

        //初始为 5条每页
        _this.$refs.pagination.size = 5;
        _this.list(1);//初始化查找第一页数据

        _this.$parent.activeSidebar("business-course-sidebar");

    },//end mounted
    methods:{

        add(){
            let _this = this;
            _this.chapter = {};//新增时 清空文本框中内容
            $("#form-modal").modal("show");
        },//end method add
        list(page){
            Loading.show();
            let _this = this;
            let url = "/business/admin/chapter/list";
            _this.$ajax.get(url,{
                params:{
                    page:encodeURI(page),
                    size:encodeURI(_this.$refs.pagination.size),
                    courseId:_this.course.id,
                    //$refs获取子组件
                }
            }).then(
                (response)=>{
                    Loading.hide();
                    
                    let result = response.data;
                    //给双向绑定数据赋值
                    _this.chapters = result.content.list;
                    //获得数据后渲染分页组件数据
                    _this.$refs.pagination.render(page,result.content.total);
                }
            );     
        },//end method list

        /*  form 表单 post请求 没有跨域问题了
        save(){
            let _this = this;
            let url = "http://127.0.0.1:9000/business/admin/chapter/save";
            _this.$ajax.post(url,_this.chapter,{
                headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                      }
            }
            ).then(
                (response)=>{
                    console.log("保存大章!",response)
                }
            );     
        },//end method save
        */  
        //  默认流方式 POST 请求 没有跨域问题了
       save(){
           let _this = this;
           
           if(!Validator.require(_this.chapter.name,"名称")
           ||!Validator.length(_this.chapter.courseId,"课程ID",1,8)){
               return;
           }
           _this.chapter.courseId = _this.course.id;
            Loading.show();
            let url = "/business/admin/chapter/save";
            _this.$ajax.post(url,_this.chapter,
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
        edit(chapter){
            let _this = this;
            // _this.chapter = chapter;
            //利jquery的extend方法解决 取消更新 表格假更新问题
            _this.chapter = $.extend({},chapter);
            $("#form-modal").modal("show");
        },//end method edit     
        del(id){
            let _this = this;
            Confirm.show("删除后不可恢复,请三思而后行",function(){
                Loading.show();
                let url = "/business/admin/chapter/delete/";
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
        toSection(chapter){
            let _this = this;
            SessionStorage.set(SESSION_KEY_CHAPTER,chapter);
            _this.$router.push("/business/section")
        },//end method toSection

    },//end methods
	
}//end export
</script>