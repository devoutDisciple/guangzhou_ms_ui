import {
	observable,
	action,
	runInAction
} from 'mobx';
import request from '../../request/AxiosRequest';

class GlobalStore {

	// login的loading效果
	@observable
	loginLoading = true;

	// 是否登录
    @observable
	isLogin = false;

	// 用户信息
	@observable
	userinfo = {

	}

    // 校区list
    @observable
	campus = [];

	@action
    setUserinfo(data) {
    	this.userinfo = data;
    }

    // loading的动画效果
    @action
	setLoading(boolean) {
    	this.loginLoading = boolean;
	}

	// 用户是否登录
	@action
    setLogin(boolean) {
    	this.isLogin = boolean;
    }

	// 设置校区
	@action
	setCampus(data) {
		this.campus = data;
	}

    // 查看当前用户是否登录
    @action
	async getLogin() {
    	this.setLoading(true);
    	try {
    		let user = await request.get('/account/isLogin');
    		runInAction(() => {
				console.log(user, 222);
				this.setUserinfo({
					username: user.data.username,
					role: user.data.role
				});
    			this.setLoading(false);
    		});
    	} catch (error) {
    		this.setLoading(false);
    		console.log(error);
    	}
	}

	 // 用户登录
	 @action
	 async login(values) {
		 this.setLogin(false);
		 try {
			 let user = await request.post('/account/login', values);
			 runInAction(() => {
				 this.setUserinfo({
					 username: user.data.username,
					 role: user.data.role
				 });
				 location.href = '/home';
				 this.setLogin(true);
			 });
		 } catch (error) {
			 console.log(444);
			 this.setLogin(false);
			 console.log(error);
		 }
    }

	// 退出登录
	@action
	 async logout() {
	 	try {
	 		await request.get('/account/logout');
	 		runInAction(() => {
	 			this.setUserinfo({
	 				username: '',
	 				role: ''
	 			});
	 			location.href = '/login';
	 		});
	 	} catch (error) {
	 		this.setUserinfo({
	 			username: '',
	 			role: ''
	 		});
	 		location.href = '/login';
	 		console.log(error);
	 	}
	 }

	//  获取校区
	@action
	 async getCampus() {
	 	try {
	 		let res = await request.get('/position/all');
	 		runInAction(() => {
				let data = res.data || [];
				data.map(item => {
					item.key = item.id;
				});
				this.setCampus(data || []);
	 		});
	 	} catch (error) {
	 		console.log(error);
	 	}
	 }
}
export default new GlobalStore();
