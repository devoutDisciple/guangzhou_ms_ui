export default {
	filterOrderStatus: function(status) {
		let data = '';
		// 1-未支付 2-商家未接单 3-商家接单 4-派送中 5-订单完成 6-已取消 7-已评价
		switch(Number(status)) {
		case 1:
			data = '商家未接单';
			break;
		case 2:
			data = '商家接单';
			break;
		case 3:
			data = '派送中';
			break;
		case 4:
			data = '订单完成';
			break;
		case 5:
			data = '已取消';
			break;
		case 6:
			data = '已评价';
			break;
		}
		return data;
	},
	// 支付类型
	filterBillType: function(status) {
		let data = '';
		// 1-支付宝 2-银行卡
		switch(Number(status)) {
		case 1:
			data = '支付宝';
			break;
		case 2:
			data = '银行卡';
			break;
		}
		return data;
	},
	// 支付状态
	filterBillStatus: function(status) {
		let data = '';
		// 1-支付宝 2-银行卡
		switch(Number(status)) {
		case 1:
			data = '待审批';
			break;
		case 2:
			data = '拒绝';
			break;
		case 3:
			data = '已支付';
			break;
		case 4:
			data = '已撤销';
			break;
		}
		return data;
	},
};
