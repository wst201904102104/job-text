<template>
  <div class="main-container">
			<div class="main-content">
				<div class="row">
					<div class="col-sm-10 col-sm-offset-1">
						<div class="login-container">
							<div class="center">
								<h1>
									<i class="ace-icon fa fa-leaf green"></i>
									<span class="red">后台登录</span>
									
								</h1>
								<h4 class="blue" id="id-company-text">&copy; 豆丁科技有限公司</h4>
							</div>

							<div class="space-6"></div>

							<div class="position-relative">
								<div id="login-box" class="login-box visible widget-box no-border">
									<div class="widget-body">
										<div class="widget-main">
											<h4 class="header blue lighter bigger">
												<i class="ace-icon fa fa-coffee green"></i>
												请输入用户名密码
											</h4>

											<div class="space-6"></div>

											<form>
												<fieldset>
													<label class="block clearfix">
														<span class="block input-icon input-icon-right">
															<input v-model="user.loginName" type="text" class="form-control" placeholder="用户名" />
															<i class="ace-icon fa fa-user"></i>
														</span>
													</label>

													<label class="block clearfix">
														<span class="block input-icon input-icon-right">
															<input v-model="user.password" type="password" class="form-control" placeholder="密码" />
															<i class="ace-icon fa fa-lock"></i>
														</span>
													</label>

													<label class="block clearfix">
														<span class="block input-icon input-icon-right">
														  <div class="input-group">
															<input v-model="user.imageCode" type="text" class="form-control" placeholder="验证码">
															<span class="input-group-addon" id="basic-addon2">
															  <img v-on:click="loadImageCode()" id="image-code" alt="验证码"/>
															</span>
														  </div>
														</span>
													  </label>

													<div class="space"></div>

													<div class="clearfix">
														<label class="inline">
															<input v-model="remember" type="checkbox" class="ace" />
															<span class="lbl">记住我</span>
														</label>

														<button type="button" 
														class="width-35 pull-right btn btn-sm btn-primary"
														v-on:click="login()">
															<i class="ace-icon fa fa-key"></i>
															<span class="bigger-110">登录</span>
														</button>
													</div>

													<div class="space-4"></div>
												</fieldset>
											</form>

											

											<div class="space-6"></div>

											
										</div><!-- /.widget-main -->

									
									</div><!-- /.widget-body -->
								</div><!-- /.login-box -->
								
							</div><!-- /.position-relative -->
						</div>
					</div><!-- /.col -->
				</div><!-- /.row -->
			</div><!-- /.main-content -->
</div><!-- /.main-container -->
</template>

<script>

export default {
	name: 'Login',
	data: function (){
        return {
            user:{},
			remember:true,
			imageCodeToken:"",
        }
    },
	mounted: function (){
		// 使用生命周期函数 解决页面样式添加问题
		let _this = this;
		$("body").removeClass("login-layout light-login");
        $("body").attr("class", "no-skin");

		let rememberUser = LocalStorage.get(LOCAL_KEY_REMEMBER_USER);
		if(rememberUser){
			_this.user = rememberUser;
		}

		// 初始时加载一次验证码图片
		_this.loadImageCode();
	},
	methods:{
	
		login(){

			let _this = this;
			
			let passwordLoacl = hex_md5(_this.user.password);
			let rememberUser = LocalStorage.get(LOCAL_KEY_REMEMBER_USER) || {};
			if(passwordLoacl !== rememberUser.md5){
				_this.user.password = hex_md5(_this.user.password + KEY);
			}
			
			_this.user.imageCodeToken = _this.imageCodeToken;

            Loading.show();
            let url = "/system/admin/user/login";
            _this.$ajax.post(url,_this.user,
            ).then(
                (response)=>{
					
                    Loading.hide();
					let result = response.data;
					if(result.success){
						//应用会话缓存 不怕刷新
						//保存用户登录信息
						// SessionStorage.set("USER",result.content);
						let loginUser = result.content;
						Tool.setLoginUser(loginUser);
						if(_this.remember){
							let passwordLoacl = hex_md5(_this.user.password);
							
							// 记住我 要求浏览器关闭退出之后 在打开还能够记住 所以要Loaclstorage
							LocalStorage.set(LOCAL_KEY_REMEMBER_USER,{
								loginName:loginUser.loginName,
								password:_this.user.password, 
								md5:passwordLoacl,
							})
						}else{
							LocalStorage.set(LOCAL_KEY_REMEMBER_USER,null);
						}
						_this.$router.push("/welcome");
					}else{
						//后台返回的错误信息 提示给前端
						Toast.warning(result.message);
						_this.user.password = "";
						_this.loadImageCode();
					}
                }
            );
		},//end method login
		loadImageCode(){
			let _this = this;
			_this.imageCodeToken = Tool.uuid(8);
			let url = _this.$ajax.defaults.baseURL + 'system/admin/kaptcha/image-code/' + _this.imageCodeToken;
			console.log("image url:",url);
			$('#image-code').attr('src',url);
		},//end method loadImageCode
		
	},//end methods 
}//end export

</script>

<style scoped>
	.input-group-addon {
		padding: 0;
	}
</style>