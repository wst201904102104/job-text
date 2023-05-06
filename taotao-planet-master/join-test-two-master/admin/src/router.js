import Vue from "vue"
import Router from "vue-router"
import Login from "./views/login.vue"
import Admin from "./views/admin.vue"
import Welcome from "./views/admin/welcome.vue"
import Chapter from "./views/admin/chapter.vue"
import Section from "./views/admin/section.vue"
import Course from "./views/admin/course.vue"
import Category from "./views/admin/category.vue"
import Teacher from "./views/admin/teacher.vue"
import File from "./views/admin/file.vue"
import Content from "./views/admin/content.vue"
import User from "./views/admin/user.vue"
import Resource from "./views/admin/resource.vue"
import Role from "./views/admin/role.vue"
import Member from "./views/admin/member.vue"
import Sms from "./views/admin/sms.vue"
/*
import Index from "./views/index.vue"
import List from "./views/list.vue"
import Detail from "./views/detail.vue"
*/

Vue.use(Router);


export default new Router({
    mode: "history",
    base: process.env.BASE_URL,
    routes: [
        //第一个路由,是默认访问页面路径
        {
            path: "*",
            redirect: "/login",
        }, 
        {
            path: "",
            redirect: "/login",
        }, 
        //login页面路径
        {
            path:"/login",
            component: Login
        },
        // admin管理页面路径 
        /*
        {
            path:"/admin",
            component: Admin,
            children:[
                {       
                    //admin 子组件 页面 
                    //注意子路由页面 不要加 /杠开头哦            
                    path:"welcome",
                    component: Welcome,
                },
                {       
                    //admin 子组件 页面 
                    //注意子路由页面 不要加 /杠开头哦            
                    path:"business/chapter",
                    component: Chapter,
                },
            ]
        },
        为了能够直接使用 /welcome 访问子页面 而不是非要加上/admin/welcome
        做如下结构更改
        1.path: /admin 改为 path: "/"
        2.所有模块 增加name属性
        */
        {
            path:"/",
            name:"admin",
            component: Admin,
            meta: {
                loginRequire: true
            },
            children:[
                {       
                    //admin 子组件 页面 
                    //注意子路由页面 不要加 /杠开头哦            
                    path:"welcome",
                    name:"welcome",
                    component: Welcome,
                },
                {       
                    //admin 子组件 页面 
                    //注意子路由页面 不要加 /杠开头哦            
                    path:"business/chapter",
                    name:"business/chapter",
                    component: Chapter,
                },
                {       
                    //admin 子组件 页面 
                    //注意子路由页面 不要加 /杠开头哦            
                    path:"business/section",
                    name:"business/section",
                    component: Section,
                },
                {       
                    //admin 子组件 页面 
                    //注意子路由页面 不要加 /杠开头哦            
                    path:"business/course",
                    name:"business/course",
                    component: Course,
                },
                {       
                    //admin 子组件 页面 
                    //注意子路由页面 不要加 /杠开头哦            
                    path:"business/category",
                    name:"business/category",
                    component: Category,
                },
                {       
                    //admin 子组件 页面 
                    //注意子路由页面 不要加 /杠开头哦            
                    path:"business/teacher",
                    name:"business/teacher",
                    component: Teacher,
                },
                {       
                    //admin 子组件 页面 
                    //注意子路由页面 不要加 /杠开头哦            
                    path:"file/file",
                    name:"file/file",
                    component: File,
                },
                {       
                    //admin 子组件 页面 
                    //注意子路由页面 不要加 /杠开头哦            
                    path:"business/content",
                    name:"business/content",
                    component: Content,
                },
                {       
                    //admin 子组件 页面 
                    //注意子路由页面 不要加 /杠开头哦            
                    path:"system/user",
                    name:"system/user",
                    component: User,
                },
                {       
                    //admin 子组件 页面 
                    //注意子路由页面 不要加 /杠开头哦            
                    path:"system/resource",
                    name:"system/resource",
                    component: Resource,
                },
                {       
                    //admin 子组件 页面 
                    //注意子路由页面 不要加 /杠开头哦            
                    path:"system/role",
                    name:"system/role",
                    component: Role,
                },
                {       
                  //admin 子组件 页面 
                  //注意子路由页面 不要加 /杠开头哦            
                  path:"business/member",
                  name:"business/member",
                  component: Member,
                },
                {       
                  //admin 子组件 页面 
                  //注意子路由页面 不要加 /杠开头哦            
                  path:"business/sms",
                  name:"business/sms",
                  component: Sms,
                },
            ]
        },
 
    ]
})
