import React from 'react';
// // const { Card } = Select;
import {Card} from 'antd';
import Request from '../../request/AxiosRequest';
import './index.less';

export default class data extends React.Component{

	constructor(props) {
		super(props);
	}

	state = {
		totalData: {
			userNum: 0,
			orders: 0,
			orderMoney: 0,
			shops: 0
		},
	}

	async componentDidMount() {
		// /count/num
		let res = await Request.get('/count/num');
		let data = res.data;
		console.log(data, 999);
		this.setState({
			totalData: data || {}
		});
	}



	render() {
		let {totalData} = this.state;
		return (
			<div className='data'>
				<div className='data_little_charts'>
					<Card title="会员注册量" className="data_little_charts_cart">
						<span>{totalData.userNum}</span>
					</Card>
					<Card title="销售额" className="data_little_charts_cart">
						<span>{totalData.orderMoney}</span>
					</Card>
					<Card title="订单总量" className="data_little_charts_cart">
						<span>{totalData.orders}</span>
					</Card>
					<Card title="店铺总量" className="data_little_charts_cart">
						<span>{totalData.shops}</span>
					</Card>
				</div>
			</div>
		);
	}
}
