import React from 'react';
import {Card, Row, Button} from 'antd';
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
		alreadyMoney: 0, //已经提现金额
		resMoney: 0, // 可提现金额，
		adminMoney: 0, // 平台营收
		salesCharts: false, // 是否展示图表
		moneyCharts: false, // 是否展示图表
	}

	async componentDidMount() {
		setTimeout(() => {
			// 获取厨房数据汇总
			this.getData();
			// 获取销售量的数据汇总
			this.getSales(1);
			// 获取销售额的数据汇总
			this.getSalesMoney(1);
		}, 100);
		this.getMoneyBillAlready();
	}



	// 获取已提现金额和可提现金额
	async getMoneyBillAlready() {
		let res = await request.get('/bill/getBillMoneyReady');
		let data = res.data;
		this.setState({
			alreadyMoney: data.alreadyMoney || 0, //已经提现金额
			resMoney: data.resMoney || 0, // 可提现金额
			adminMoney: data.adminMoney || 0, // 平台营收
		});
	}


	// 点击销售量按钮
	async onClickSalesBtn(type) {
		this.setState({
			salesType: type
		}, () => this.getSales(type));
	}

	// 点击销售量按钮
	async onClickMoneyBtn(type) {
		this.setState({
			moneyType: type
		}, () => this.getSalesMoney(type));
	}

	// 获取本周销售总量
	async getSales(type) {
		let res = await request.get('/order/getSales', {type: type});
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
	async getSalesMoney(type) {
		let res = await request.get('/order/getMoney', {type: type});
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
		// 使用刚指定的配置项和数据显示图表。
		myChart.setOption(option);
	}

	async getData() {
		let res = await request.get('/order/getData');
		let data = res.data;
		this.setState({
			orderNum: data.orderNum || 0,
			orderPrice: data.orderPrice || 0,
			todayNum: data.todayNum && data.todayNum.length != 0 && data.todayNum[0].count ? data.todayNum[0].count : 0,
			todayMoney: data.todayMoney && data.todayMoney.length != 0 && data.todayMoney[0].count ? data.todayMoney[0].count : 0
		});
	}

	render() {
		// alreadyMoney: data.alreadyMoney || 0, //已经提现金额
		// resMoney: data.resMoney || 0, // 可提现金额
		let {
			orderNum,
			orderPrice,
			moneyType,
			salesType,
			todayNum,
			todayMoney,
			alreadyMoney,
			resMoney,
			adminMoney,
		} = this.state;
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
					<Card title="已提现(元)" className="data_little_charts_cart">
						<span>{alreadyMoney}</span>
					</Card>
					<Card title="可提现金额(元)" className="data_little_charts_cart">
						<span>{resMoney}</span>
					</Card>
					<Card title="平台营收(元)" className="data_little_charts_cart">
						<span>{adminMoney}</span>
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
					<Row id="data_member1" className="data_common_detail_content">

					</Row>
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
			</div>
		);
	}
}
