import {
	observable,
	action,
	runInAction
} from 'mobx';
import request from '../../request/AxiosRequest';

class ShopStore {

    // 轮播图list
    @observable
	list = [];

	 // 校区list
	 @observable
	 campus = [];

	 // 设置校区
	 @action
	 setCampus(data) {
		 this.campus = data;
	 }

	@action
	 setList(data) {
    	this.list = data;
	 }

	// 获取所有店铺信息
	@action
	 async getAll() {
	 	try {
			 let shop = await request.get('/shop/all');
	 		runInAction(() => {
				 let data = shop.data || [];
				 data.map(item => {
					 item.key = item.id;
				 });
				 this.setList(shop.data || []);
	 		});
	 	} catch (error) {
	 		console.log(error);
	 	}
	 }

	 // 新增商铺
	@action
	async addShop(data) {
		try {
			let shop = await request.post('/shop/add', data);
			return shop;
		} catch (error) {
			console.log(error);
		}
	}



	  //  获取校区
	  @action
	   async getCampus(values) {
		   try {
			   let res = await request.get('/position/all', values);
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
export default new ShopStore();
