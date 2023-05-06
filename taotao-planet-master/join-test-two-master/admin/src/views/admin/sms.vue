<template>
    <div>
        <p>
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
                <th>手机号</th>
                <th>验证码</th>
                <th>用途</th>
                <th>生成时间</th>
                <th>用途</th>
                
            </tr>
            </thead>

            <tbody>
            <tr v-for="sms in smss">
                <td>{{sms.id}}</td>
                <td>{{sms.mobile}}</td>
                <td>{{sms.code}}</td>
                <td>{{SMS_USE | optionKV(sms.use)}}</td>
                <td>{{sms.at}}</td>
                <td>{{SMS_STATUS | optionKV(sms.status)}}</td>
                
            </tr>
            </tbody>
        </table>

    </div>
</template>

<script>

import Pagination from '../../components/pagination.vue'
export default {
    components: {Pagination},
	name: 'Sms',
    data: function (){
        return {
            sms:{},
            smss:[],
            SMS_USE: SMS_USE,
            SMS_STATUS: SMS_STATUS,
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
            let url = "/business/admin/sms/list";
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
                    _this.smss = result.content.list;
                    //获得数据后渲染分页组件数据
                    _this.$refs.pagination.render(page,result.content.total);
                }
            );
        },//end method list
       
    },//end methods
}//end export
</script>