import React from 'react';
import {Card, Row, Button, Col} from 'antd';
import './index.less';
import request from '../../../request/AxiosRequest';
import {inject, observer} from 'mobx-react';
import echarts from 'echarts';

@inject('GlobalStore')
@observer
export default class Order extends React.Component{

	constructor(props) {
		super(props);
		this.globalStore = this.props.GlobalStore;
	}

	state = {
		orderNum: 0,
		orderPrice: 0,
		todayNum: 0,
		todayMoney: 0,
		salesType: 1,
		moneyType: 1,
	}

	async componentDidMount() {
		// await this.globalStore.getLogin();
		let shopid = this.globalStore.userinfo.shopid;
		setTimeout(() => {
			// 获取商店数据汇总
			this.getData(shopid);
			// 获取销售量的数据汇总
			this.getSalesByShopid(shopid);
			// 获取销售额的数据汇总
			this.getSalesMoneyByShopid(shopid);
		}, 100);
	}


	// 点击销售量按钮
	async onClickSalesBtn(type) {
		this.setState({
			salesType: type
		}, () => this.getSalesByShopid(type));
	}

	// 点击销售量按钮
	async onClickMoneyBtn(type) {
		this.setState({
			moneyType: type
		}, () => this.getSalesMoneyByShopid(type));
	}

	// 获取本周销售总量
	async getSalesByShopid(type) {
		let shopid = this.globalStore.userinfo.shopid;
		let res = await request.get('/order/getSalesByShopid', {shopid: shopid, type: type});
		let myChart = echarts.init(document.getElementById('data_member1'));
		let data = res.data || [];
		let echartsData = [];
		data.map(item => {
			echartsData.push({value: [item.days, item.count]});
		});
		let option = {
			grid: {
				left: '3%',
				right: '4%',
				bottom: '3%',
				containLabel: true
			},
			tooltip: {
				trigger: 'axis'
			},
			xAxis:  {
				type: 'time',
				boundaryGap: false,
				splitLine:{
					show:false
				}
			},
			yAxis: {
				type: 'value',
				axisLabel: {
					formatter: '{value} 单'
				},
			},
			series: [{
				name:'销售量',
				type:'line',
				data: echartsData,
				lineStyle: {
					color: '#2fc25b',
				}
			}]
		};
		// 使用刚指定的配置项和数据显示图表。
		myChart.setOption(option);
	}

	// 获得销售额数据汇总
	async getSalesMoneyByShopid(type) {
		let shopid = this.globalStore.userinfo.shopid;
		let res = await request.get('/order/getMoneyByShopid', {shopid: shopid, type: type});
		let myChart = echarts.init(document.getElementById('data_member2'));
		let data = res.data || [];
		let echartsData = [];
		data.map(item => {
			echartsData.push({value: [item.days, Number(item.money)]});
		});
		let option = {
			grid: {
				left: '3%',
				right: '4%',
				bottom: '3%',
				containLabel: true
			},
			tooltip: {
				trigger: 'axis'
			},
			xAxis:  {
				type: 'time',
				boundaryGap: false,
				splitLine:{
					show:false
				}
			},
			yAxis: {
				type: 'value',
				axisLabel: {
					formatter: '{value} 元'
				}
			},
			series: [{
				name:'销售额',
				type:'line',
				data: echartsData,
				lineStyle: {
					color: '#1890ff'
				}
			}]
		};
		console.log(option, 8);
		// 使用刚指定的配置项和数据显示图表。
		myChart.setOption(option);
	}

	async getData(shopid) {
		let res = await request.get('/order/getDataByShopid', {shopid: shopid});
		let data = res.data;
		this.setState({
			orderNum: data.orderNum || 0,
			orderPrice: data.orderPrice || 0,
			todayNum: data.todayNum && data.todayNum.length != 0 && data.todayNum[0].count ? data.todayNum[0].count : 0,
			todayMoney: data.todayMoney && data.todayMoney.length != 0 && data.todayMoney[0].count ? data.todayMoney[0].count : 0
		});
	}

	render() {
		let {orderNum, orderPrice, moneyType, salesType, todayNum, todayMoney} = this.state;
		return (
			<div className='data'>
				<div className='data_little_charts'>
					<Card title="今日订单量(单)" className="data_little_charts_cart">
						<span>{todayNum}</span>
					</Card>
					<Card title="今日销售额(单)" className="data_little_charts_cart">
						<span>{todayMoney}</span>
					</Card>
					<Card title="订单总量(单)" className="data_little_charts_cart">
						<span>{orderNum}</span>
					</Card>
					<Card title="总销售额(元)" className="data_little_charts_cart">
						<span>{orderPrice}</span>
					</Card>
				</div>
				<Row className="data_common_detail">
					<Row className="data_common_detail_title">
						<div className="data_common_detail_title_left">订单数量</div>
						<div className="data_common_detail_title_right">
							<Button type={salesType == 1 ? 'primary' : null} onClick={this.onClickSalesBtn.bind(this, 1)}>本周</Button>
							<Button type={salesType == 2 ? 'primary' : null} onClick={this.onClickSalesBtn.bind(this, 2)}>本月</Button>
							<Button type={salesType == 3 ? 'primary' : null} onClick={this.onClickSalesBtn.bind(this, 3)}>本年</Button>
						</div>
					</Row>
					<Row id="data_member1" className="data_common_detail_content"></Row>
				</Row>
				<Row className="data_common_detail">
					<Row className="data_common_detail_title">
						<div className="data_common_detail_title_left">销售额</div>
						<div className="data_common_detail_title_right">
							<Button type={moneyType == 1 ? 'primary' : null} onClick={this.onClickMoneyBtn.bind(this, 1)}>本周</Button>
							<Button type={moneyType == 2 ? 'primary' : null} onClick={this.onClickMoneyBtn.bind(this, 2)}>本月</Button>
							<Button type={moneyType == 3 ? 'primary' : null} onClick={this.onClickMoneyBtn.bind(this, 3)}>本年</Button>
						</div>
					</Row>
					<Row id="data_member2" className="data_common_detail_content"></Row>
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
