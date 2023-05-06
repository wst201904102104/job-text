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
            <div v-for="course in courses" class="col-md-4">
                <div class="thumbnail search-thumbnail">
                    <img v-show="!course.image" class="media-object" src="/static/image/demo_class.png">
                    <img v-show="course.image" class="media-object" v-bind:src="course.image" >
                    <div class="caption">
                        <div class="clearfix">
                            <span class="pull-right label label-grey info-label">
                            {{COURSE_LEVEL | optionKV(course.level)}}
                            </span>
                            <span class="pull-right label label-grey info-label">
                            {{COURSE_CHARGE | optionKV(course.charge)}}
                            </span>
                            <span class="pull-right label label-grey info-label">
                            {{COURSE_STATUS | optionKV(course.status)}}
                            </span>
                        </div>
                        <h3 class="search-title">
                            <a href="#" class="blue">{{course.name}}</a>
                        </h3>
                         <div v-for="teacher in teachers.filter(t=>{return t.id===course.teacherId})" class="profile-activity clearfix">
                            <div>
                                <img v-show="!teacher.image" class="pull-left" src="/ace/assets/images/avatars/avatar5.png">
                                <img v-show="teacher.image" class="pull-left" v-bind:src="teacher.image">
                                <a class="user" href="#"> {{teacher.name}} </a>
                                <br>
                                {{teacher.position}}
                            </div>
                        </div>
                        <p>
                            <span class="blue bolder bigger-150">{{course.price}}&nbsp;<i class="fa fa-rmb"></i></span>&nbsp;
                        </p>
                        <p>{{course.summary}}</p>
                        <p>
                            <span class="badge badge-info">{{course.id}}</span>
                            <span class="badge badge-info">排序:{{course.sort}}</span>
                            <span class="badge badge-info">{{course.time| formatSecond}}</span>
                        </p>
                        <p>
                            <button v-on:click="toChapter(course)" class="btn btn-white btn-xs btn-info btn-round">
                            <i class="ace-icon fa  bigger-120">大章</i>
                            </button>
                            <!-- <button v-on:click="editContent(course)" class="btn btn-white btn-xs btn-info btn-round">内容</button>-->
                            <button v-on:click="toContent(course)" class="btn btn-white btn-xs btn-info btn-round">
                            <i class="ace-icon fa  bigger-120">内容</i>
                            </button>
                            <button v-on:click="edit(course)" class="btn btn-white btn-xs btn-info btn-round">
                            <i class="ace-icon fa  bigger-120">编辑</i>
                            </button>
                            <button v-on:click="openSortModal(course)" class="btn btn-white btn-xs btn-info btn-round">
                            <i class="ace-icon fa  bigger-120">排序</i>
                            </button>
                            <button v-on:click="del(course.id)" class="btn btn-white btn-xs btn-warning btn-round">
                                <i class="ace-icon fa  bigger-120">删除</i>
                            </button>
                        </p>
                    </div>
                </div>
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
                            <label class="col-sm-2 control-label">分类</label>
                            <div class="col-sm-10">
                                <ul id="tree" class="ztree"></ul>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">封面</label>
                            <div class="col-sm-10">
                                <big-file 
                                v-bind:suffixs="['jpg','jpeg','png']"
                                v-bind:input-id="'image-upload'"
                                v-bind:text="'上传封面'" 
                                v-bind:use="FILE_USE.COURSE.key"
                                v-bind:after-upload="afterUpload"></big-file>
                                <div v-show="course.image" class="row">
                                    <div class="col-md-4">
                                        <img v-bind:src="course.image" class="img-responsive">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">名称</label>
                            <div class="col-sm-10">
                                <input v-model="course.name" class="form-control" placeholder="名称,无错类型:String">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">讲师</label>
                            <div class="col-sm-10">
                                <select v-model="course.teacherId" class="form-control">
                                    <option v-for="o in teachers" v-bind:value="o.id" >{{o.name}}</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">概述</label>
                            <div class="col-sm-10">
                                <textarea v-model="course.summary" class="form-control" placeholder="概述,无错类型:String">
                                </textarea>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">时长</label>
                            <div class="col-sm-10">
                                <input v-model="course.time" class="form-control" placeholder="时长,无错类型:Integer">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">价格（元）</label>
                            <div class="col-sm-10">
                                <input v-model="course.price" class="form-control" placeholder="价格（元）,无错类型:BigDecimal">
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label class="col-sm-2 control-label">级别</label>
                            <div class="col-sm-10">
                                <select v-model="course.level" class="form-control">
                                    <option v-for="o in COURSE_LEVEL" v-bind:value="o.key" >{{o.value}}</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">收费</label>
                            <div class="col-sm-10">
                                <select v-model="course.charge" class="form-control">
                                    <option v-for="o in COURSE_CHARGE" v-bind:value="o.key" >{{o.value}}</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">状态</label>
                            <div class="col-sm-10">
                                <select v-model="course.status" class="form-control">
                                    <option v-for="o in COURSE_STATUS" v-bind:value="o.key" >{{o.value}}</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">报名数</label>
                            <div class="col-sm-10">
                                <input v-model="course.enroll" class="form-control" placeholder="报名数,无错类型:Integer">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">顺序</label>
                            <div class="col-sm-10">
                                <input v-model="course.sort" class="form-control" placeholder="顺序,无错类型:Integer" disabled>
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
    <!-- 富文本编辑器 modal-->
     <!-- 排序 modal-->
    <div id="course-sort-modal" class="modal fade" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title">排序</h4>
                </div>
                <div class="modal-body">
                    <form class="form-horizontal">
                        <div class="form-group">
                            <label class="control-label col-lg-3">
                            当前排序
                            </label>
                             <div class="col-lg-9">
                              <input class="form-control" v-model="sort.oldSort" name="oldSort" disabled>
                            </div>
                        </div>
                        <div class="form-group">
                           <label class="control-label col-lg-3">
                            新排序
                            </label>
                            <div class="col-lg-9">
                              <input class="form-control" v-model="sort.newSort" name="newSort">
                            </div>
                        </div>

                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
                    <button v-on:click="updateSort()" type="button" class="btn btn-primary">保存</button>
                </div>
            </div><!-- /.modal-content -->
        </div><!-- /.modal-dialog -->
    </div> <!-- /.排序 modal-->
</div>
</template>

<script>

import Pagination from '../../components/pagination.vue'
// import File from '../../components/file.vue'
import BigFile from '../../components/big-file.vue'
export default {
    components: {Pagination,BigFile},
	name: 'Course',
    data: function (){
        return {
            course:{},
            courses:[],
            COURSE_LEVEL:COURSE_LEVEL,
            COURSE_CHARGE:COURSE_CHARGE,
            COURSE_STATUS:COURSE_STATUS,
            categorys:[],
            tree:{},
            saveContentLabel:"",
            sort: {
                id:"",
                oldSort:0,
                newSort:0
            },
            teachers:[],
            FILE_USE:FILE_USE,
            files:[],
        }//end return
    },//end data
    mounted: function (){
        //页面初始化完成之后 就加载网络数据
        let _this = this;
        //初始为 5条每页
        _this.$refs.pagination.size = 5;
        //初始化ztree
        _this.allCategory();
        _this.allTeacher();
        _this.list(1);//初始化查找第一页数据

    },
    methods:{

        add(){
            let _this = this;
            _this.course = {
                //新增的时候 给一个默认排序 当前分页的总条数 + 1
                sort:_this.$refs.pagination.total + 1
            };//新增时 清空文本框中内容
            _this.tree.checkAllNodes(false); //去除所有选中
            $("#form-modal").modal("show");
        },//end method add
        list(page){
            Loading.show();
            let _this = this;
            let url = "/business/admin/course/list";
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
                    _this.courses = result.content.list;
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
                   || !Validator.require(_this.course.name, "名称")
                   || !Validator.length(_this.course.name, "名称", 1, 50)
                   || !Validator.length(_this.course.summary, "概述", 1, 2000)
                   || !Validator.length(_this.course.image, "封面", 1, 100)
           ) {
               return;
           }

           //获得分类相关内容
            let categorys = _this.tree.getCheckedNodes();
            //course.categorys 这个categorys是哪里来的?
            if(Tool.isEmpty(categorys)){
                Toast.warning("请选择分类");
                return;
            }
            _this.course.categorys = categorys;

            Loading.show();
            let url = "/business/admin/course/save";
            _this.$ajax.post(url,_this.course,
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
        edit(course){
            let _this = this;
            // _this.course = course;
            //利jquery的extend方法解决 取消更新 表格假更新问题
            _this.course = $.extend({},course);
            //分类树 选中项
            _this.listCategory(course.id);
            $("#form-modal").modal("show");
        },//end method edit
        del(id){
            let _this = this;
            Confirm.show("删除后不可恢复,请三思而后行",function(){
                Loading.show();
                let url = "/business/admin/course/delete/";
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
        toChapter(course){
             //页面-页面 数据传递
            //1.通过sessionStorage 共享数据   页面刷新数据丢失
            //2.vuex store 页面刷新数据丢失
            //3.localStorage  本地存储 不会丢失数据
            let _this = this;
            SessionStorage.set(SESSION_KEY_COURSE,course);
            _this.$router.push("/business/chapter")

        },//end method toChapter
        toContent(course){
             //页面-页面 数据传递
            //1.通过sessionStorage 共享数据   页面刷新数据丢失
            //2.vuex store 页面刷新数据丢失
            //3.localStorage  本地存储 不会丢失数据
            let _this = this;
            SessionStorage.set(SESSION_KEY_COURSE,course);
            _this.$router.push("/business/content")

        },//end method toChapter
        allCategory(){
            Loading.show();
            let _this = this;
            let url = "/business/admin/category/all";
            _this.$ajax.get(url).then(
                (response)=>{
                    Loading.hide();
                    let result = response.data;
                    //给双向绑定数据赋值
                    _this.categorys = result.content;
                    _this.initTree();
                    
                }//end  response
            );//end then
        },//end method all
        initTree(){
            let _this = this;
            let setting = {
                check: {
                    enable: true
                },
                data: {
                    simpleData: {
                        idKey:"id",
                        pIdKey:"parent",
                        rootPId:"00000000",
                        enable:true
                    }
                }//end data 用于配置关键字段 把tree关键字与我们category字段关联
            };//end setting

            let zNodes = _this.categorys;
            _this.tree = $.fn.zTree.init($("#tree"),setting,zNodes);

            //展开所有节点
            _this.tree.expandAll(false);

        },//end method initTree
        listCategory(courseId){
            let _this = this;
            Loading.show();
            let url = "/business/admin/course/list-category/" + courseId; 
            _this.$ajax.post(url).then((response)=>{
                Loading.hide();
                console.log("查找课程下所有分类:",response);
                
                let categorys = response.data.content;

                //选中分类树
                _this.tree.checkAllNodes(false);
                for(let i = 0;i < categorys.length; i++){
                    let node = _this.tree.getNodeByParam("id",categorys[i].categoryId);
                    _this.tree.checkNode(node,true);
                }//end for
            });//end post
        },//end method listCategory
        //富文本编辑框
        editContent(course){
            let _this = this;
            let id = course.id;
            //summernote 是富文本js中的方法 初始化大小
            $("#content").summernote({
                focus:true,//open
                height:300,//高度
            });
            //清空历史内容
            $("#content").summernote('code','');
            _this.saveContentLabel = "";

           
            Loading.show();
            let url = "/business/admin/course/find-content/"+id;
            _this.$ajax.get(url).then(
                (response)=>{
                    Loading.hide();
                    let result = response.data;
                    if(result.success){

                        $("#course-content-modal").modal({backdrop:'static',keyboard:false});
                        if(result.content){
                            $("#content").summernote('code',result.content.content);
                        }// inner if
                        _this.course = course; //保存对象到全局
                          //加载内容列表 要在保存全局course之后 否则获得不到courseId
                        _this.listContentFiles();
                        
                        //自动保存 setInterval HTML5 内置函数
                        let saveContentInterval = setInterval(function(){
                            _this.saveContent();
                        },5000);
                        //关闭内容框 时清除自动保存任务
                        $("#course-content-modal").on('hidden.bs.modal',function(e){
                            clearInterval(saveContentInterval);
                        });
                        
                    }else {
                        Toast.warning(result.message);
                    }//end else
                }//end  response
            );//end then
        },//end method editContent

        saveContent(){
            let _this = this;
            let content = $("#content").summernote("code");
            // Loading.show();
            let url = "/business/admin/course/save-content"; 
            _this.$ajax.post(url,{
                id:_this.course.id,
                content:content
            }).then((response)=>{
                // Loading.hide();
                let result = response.data;
                if(result.success){
                    // Toast.success("内容保存成功");
                    let now = Tool.dateFormat("mm:ss");
                    _this.saveContentLabel = "最后保存时间: " + now;
                }else {
                     Toast.waring(result.message);
                }
            });//end post
        },//end method saveContent
        openSortModal(course){
                let _this = this;
                _this.sort = {
                    id:course.id,
                    oldSort:course.sort,
                    newSort:course.sort
                };
                _this.course = course;
                $("#course-sort-modal").modal("show");

        },//end method openSortModal
        updateSort(){
            let _this = this;
            if(_this.sort.newSort === _this.sort.oldSort){
                Toast.waring("排序没有变化");
                return;
            }

            Loading.show();
            let url = "/business/admin/course/sort";
            _this.$ajax.post(url,_this.sort).then((response)=>{
                let result = response.data;
                if(result.success){
                    Toast.success("更新排序成功");
                    $("#course-sort-modal").modal("hide");
                    _this.list(1);
                }else{
                    Toast.error("更新排序失败");
                }
            });//end post


        },//end method updateSort

        allTeacher(){
            Loading.show();
            let _this = this;
            let url = "/business/admin/teacher/all";
            _this.$ajax.get(url).then(
                (response)=>{
                    Loading.hide();
                    let result = response.data;
                    //给双向绑定数据赋值
                    _this.teachers = result.content;
                    
                    
                }//end  response
            );//end then
        },//end method allTeachers
        afterUpload(data){
            let _this = this;
            _this.course.image = data.content.path;
            console.log("文件上传完成回调afterUpload:"+data.content.path)
        }, //end method afterUpload  file.vue组件的回调函数
        //富文本内容中的文件



    },//end methods

}
</script>