<template>
    <div>
        <p>
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
                <th>相对路径</th>
                <th>文件名</th>
                <th>后缀</th>
                <th>大小</th>
                <th>用途</th>
            </tr>
            </thead>

            <tbody>
            <tr v-for="file in files">
                            <td>{{file.id}}</td>
                            <td>{{file.path}}</td>
                            <td>{{file.name}}</td>
                            <td>{{file.suffix}}</td>
                            <td>{{file.size | formatFileSize}}</td>
                            <td>{{FILE_USE | optionKV(file.use)}}</td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>

import Pagination from '../../components/pagination.vue'
export default {
    components: {Pagination},
	name: 'File',
    data: function (){
        return {
            file:{},
            files:[],
            FILE_USE:FILE_USE,
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

       
        list(page){
            Loading.show();
            let _this = this;
            let url = "/file/admin/file/list";
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
                    _this.files = result.content.list;
                    //获得数据后渲染分页组件数据
                    _this.$refs.pagination.render(page,result.content.total);
                }
            );
        },//end method list
      
       
    },//end methods

}
</script>