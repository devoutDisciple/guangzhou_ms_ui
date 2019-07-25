import React from 'react';
import {Card, Row, Button, Col} from 'antd';
import './index.less';
import request from '../../../request/AxiosRequest';
import {inject, observer} from 'mobx-react';

@inject('GlobalStore')
@observer
export default class Order extends React.Component{

	constructor(props) {
		super(props);
		this.globalStore = this.props.GlobalStore;
	}

	state = {
		orderNum: 0,
		orderPrice: 0
	}

	async componentDidMount() {
		// await this.globalStore.getLogin();
		let shopid = this.globalStore.userinfo.shopid;
		setTimeout(() => {
			this.getData(shopid);
		}, 100);
	}

	async getData(shopid) {
		if(!shopid) {
			setTimeout(() => {
				let shopid = this.globalStore.userinfo.shopid;
				this.getData(shopid);
			}, 100);
			return;
		}
		let res = await request.get('/order/getDataByShopid', {id: shopid});
		let data = res.data;
		this.setState({
			orderNum: data.orderNum || 0,
			orderPrice: data.orderPrice || 0
		});
	}

	render() {
		let {orderNum, orderPrice} = this.state;
		return (
			<div className='data'>
				<div className='data_little_charts'>
					<Card title="订单总量(单)" className="data_little_charts_cart">
						<span>{orderNum}</span>
					</Card>
					<Card title="销售总量(元)" className="data_little_charts_cart">
						<span>{orderPrice}</span>
					</Card>
				</div>
				<Row className="data_common_detail">
					<Row className="data_common_detail_title">
						<div className="data_common_detail_title_left">销售报表</div>
						<div className="data_common_detail_title_right">
							<Button type="primary">本周</Button>
							<Button>本月</Button>
							<Button>本年</Button>
						</div>
					</Row>
					<Row id="data_member" className="data_common_detail_content"></Row>
				</Row>
				<Row className="shop_detail">
					<Col className='shop_detail_col' span={12}>
						<span className='shop_detail_label'>名称：</span>
						<span className='shop_detail_content'>一点点奶茶</span>
					</Col>
					<Col className='shop_detail_col' span={12}>
						<span className='shop_detail_label'>所属区域：</span>
						<span className='shop_detail_content'>北京大学</span>
					</Col>
					<Col className='shop_detail_col' span={12}>
						<span className='shop_detail_label'>月售：</span>
						<span className='shop_detail_content'>100</span>
					</Col>
					<Col className='shop_detail_col' span={12}>
						<span className='shop_detail_label'>地址：</span>
						<span className='shop_detail_content'>故宫博物院</span>
					</Col>
					<Col className='shop_detail_col' span={12}>
						<span className='shop_detail_label'>起送费：</span>
						<span className='shop_detail_content'>80</span>
					</Col>
					<Col className='shop_detail_col' span={12}>
						<span className='shop_detail_label'>配送费：</span>
						<span className='shop_detail_content'>10</span>
					</Col>
					<Col className='shop_detail_col' span={12}>
						<span className='shop_detail_label'>营业时间：</span>
						<span className='shop_detail_content'>08:00-15:00</span>
					</Col>
				</Row>
			</div>
		);
	}
}
