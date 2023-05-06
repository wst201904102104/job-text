<template>
    <div>
            <h4 class="lighter">
                <i class="ace-icon fa fa-hand-o-right icon-animated-hand-pointer blue"></i>
                <router-link to="/business/course" class="pink"> {{course.name}} </router-link>:

                <i class="ace-icon fa fa-hand-o-right icon-animated-hand-pointer blue"></i>
                <router-link to="/business/chapter" class="pink"> {{chapter.name}} </router-link>
            </h4>
        <hr>
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
        
        <table id="simple-table" class="table  table-bordered table-hover">
            <thead>
            <tr>
                <th>id</th>
                <th>标题</th>
                <th>视频</th>
                <th>时长</th>
                <th>收费</th>
                <th>顺序</th>
                <th>操作</th>
            </tr>
            </thead>

            <tbody>
            <tr v-for="section in sections">
                            <td>{{section.id}}</td>
                            <td>{{section.title}}</td>
                           
                            <td>{{section.video}}</td>
                            <td>{{section.time | formatSecond}}</td>
                            <td>{{SECTION_CHARGE | optionKV(section.charge)}}</td>
                            <td>{{section.sort}}</td>
                <td>
                    <div class="hidden-sm hidden-xs btn-group">
                        <button v-on:click="play(section)" class="btn btn-xs btn-info">
                            <i class="ace-icon fa fa-video-camera bigger-120"></i>
                          </button>
                        <button v-on:click="edit(section)" class="btn btn-xs btn-info">
                            <i class="ace-icon fa fa-pencil bigger-120"></i>
                        </button>
                        <button v-on:click="del(section.id)" class="btn btn-xs btn-danger">
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
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close" v-on:click="closeModal()"><span aria-hidden="true">&times;</span></button>
                        <h4 class="modal-title">表单</h4>
                    </div>
                    <div class="modal-body">
                        <form class="form-horizontal">
                                        <div class="form-group">
                                            <label class="col-sm-2 control-label">标题</label>
                                            <div class="col-sm-10">
                                                <input v-model="section.title" class="form-control" placeholder="标题,无错类型:String">
                                            </div>
                                        </div>
                                        
                                        <div class="form-group">
                                            <label class="col-sm-2 control-label">课程</label>
                                            <div class="col-sm-10">
                                                <p class="form-control">{{course.name}}</p>
                                                
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <label class="col-sm-2 control-label">大章</label>
                                            <div class="col-sm-10">
                                                <p class="form-control">{{chapter.name}}</p>
                                            </div>
                                        </div>
                                        
                                        <div class="form-group">
                                            <label class="col-sm-2 control-label">视频上传</label>
                                            <div class="col-sm-10">
                                                <big-file 
                                                v-bind:suffixs="['mp4']"
                                                v-bind:input-id="'video-upload'"
                                                v-bind:text="'上传视频'" 
                                                v-bind:use="FILE_USE.COURSE.key"
                                                v-bind:after-upload="afterUpload"
                                                v-bind:shard-size="10*1024*1024"></big-file>
                                                <div v-show="section.video" class="row">
                                                    <div class="col-md-9">
                                                        <video v-bind:src="section.video" id="video"  controls="controls"></video>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <label class="col-sm-2 control-label">时长</label>
                                            <div class="col-sm-10">
                                                <p class="form-control">{{section.time}}秒</p>
                                                
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <label class="col-sm-2 control-label">收费</label>
                                            <div class="col-sm-10">
                                                <select v-model="section.charge" class="form-control">
                                                    <option v-for="o in SECTION_CHARGE" v-bind:value="o.key">{{o.value}}</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <label class="col-sm-2 control-label">顺序</label>
                                            <div class="col-sm-10">
                                                <input v-model="section.sort" class="form-control" placeholder="顺序,无错类型:Integer">
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
        <div id="player-modal" class="modal fade" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close" v-on:click="closeModal()"><span aria-hidden="true">&times;</span></button>
                        <h4 class="modal-title">{{section.title}}</h4>
                    </div>
                    <div class="modal-body">
                        <form class="form-horizontal">
                            <div class="form-group">
                                
                                <div class="col-sm-12">
                                    <div v-show="section.video" class="row">
                                        <div class="col-md-12">
                                            <video v-bind:src="section.video" id="video"  controls="controls"></video>
                                        </div>
                                    </div>
                                </div>
                            </div>
                                        
                        </form>
                    </div>
                    
                </div><!-- /.modal-content -->
            </div><!-- /.modal-dialog -->
        </div><!-- /.modal player end-->
    </div>
</template>

<script>

import Pagination from '../../components/pagination.vue'
import BigFile from '../../components/big-file.vue'
export default {
    components: {Pagination,BigFile},
	name: 'Section',
    data: function (){
        return {
            section:{},
            sections:[],
            SECTION_CHARGE: SECTION_CHARGE,
            chapter:{},
            course:{},
            FILE_USE:FILE_USE,
        }
    },
    mounted: function (){
        //页面初始化完成之后 就加载网络数据
        let _this = this;

         //取出course数据  过滤一下 因为数据有可能是空

        let course = SessionStorage.get(SESSION_KEY_COURSE) || {};
        let chapter = SessionStorage.get(SESSION_KEY_CHAPTER) || {};
        if(Tool.isEmpty(course) || Tool.isEmpty(chapter)){
            _this.$router.push("/welcome");
        }//end if
        _this.course = course;
        _this.chapter = chapter;
        //初始为 5条每页
        _this.$refs.pagination.size = 5;
        _this.list(1);//初始化查找第一页数据

        _this.$parent.activeSidebar("business-course-sidebar");

    },
    methods:{

        add(){
            let _this = this;
            _this.section = {};//新增时 清空文本框中内容
            $("#form-modal").modal("show");
        },//end method add
        list(page){
            Loading.show();
            let _this = this;
            let url = "/business/admin/section/list";
            _this.$ajax.get(url,{
                params:{
                    page:encodeURI(page),
                    size:encodeURI(_this.$refs.pagination.size),
                    //$refs获取子组件
                    chapterId:_this.chapter.id,
                    courseId:_this.chapter.courseId,
                }
            }).then(
                (response)=>{
                    Loading.hide();

                    let result = response.data;
                    //给双向绑定数据赋值
                    _this.sections = result.content.list;
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
                   || !Validator.require(_this.section.title, "标题")
                   || !Validator.length(_this.section.title, "标题", 1, 50)
                   || !Validator.length(_this.section.video, "视频", 1, 200)
           ) {
               return;
           }
           //这步保证 小节 与 章 课程关联起来
            _this.section.chapterId = _this.chapter.id;
            _this.section.courseId = _this.chapter.courseId;

            Loading.show();
            let url = "/business/admin/section/save";
            _this.$ajax.post(url,_this.section,
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
        edit(section){
            let _this = this;
            // _this.section = section;
            //利jquery的extend方法解决 取消更新 表格假更新问题
            _this.section = $.extend({},section);
            $("#form-modal").modal("show");
        },//end method edit
        del(id){
            let _this = this;
            Confirm.show("删除后不可恢复,请三思而后行",function(){
                Loading.show();
                let url = "/business/admin/section/delete/";
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
        //文件上传的回调函数
        afterUpload(data){
            // 注意这里有个bug 
            //当video 标签第一次赋值后
            //再次给video 的src赋值 视频是不会正确加载的
            //因为section表中记录了一个之前的视频地址显示模态框时已经给video赋值了
            //所以动态绑定video src 改变值并没有改变视频
            let _this = this;
            _this.section.video = data.content.path;
            //重新加载video空间 解决上面提到的bug
            this.$nextTick(function () {
                $("#video").load();
            });
            _this.$forceUpdate();
            _this.getTime();
            
        }, //end method afterUpload  file.vue组件的回调函数
        // 获取视频时长
        getTime(){
            let _this = this;
            //上传功能后无法立即获得视频时长 所以延时获得
            setTimeout(function () {
                let ele = document.getElementById("video");
                _this.section.time = parseInt(ele.duration, 10);
            }, 1000);
        },//end method getTime

         /**
       * 播放视频
       * @param section
       */
      play(section) {
        let _this = this;
        _this.section = $.extend({},section);
        $("#player-modal").modal("show");

        // let _this = this;
        // this.$nextTick(function () {
        //     $("#videoPlayer").load();
        // });
        // console.log(section.video);
        
        // let player = document.getElementById("myVideo");
        // player.play();
        
      },//end method play

      closeModal(){
        var myVideo = document.getElementsByTagName('video');
        for(let i =0; i < myVideo.length;i++){
            myVideo[i].pause();
        }
        // myVideo.pause();
      },//end method closeModal

      


    },//end methods

}
</script>
<!-- 控制video 显示区域大小的样式 -->
<style scoped>
    video {
      width: 100%;
      height: auto;
      margin-top: 10px;
    }
</style>