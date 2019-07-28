import React from 'react';
import {Card, Row, Button} from 'antd';
import Request from '../../../request/AxiosRequest';
import './index.less';
import echarts from 'echarts';

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
		this.setState({
			totalData: data || {
				userNum: 0,
				orders: 0,
				orderMoney: 0,
				shops: 0
			}
		});
		this.initMember();
		this.onsearchUsers();
	}

	async onsearchUsers() {
		// /count/num
		let res = await Request.get('/count/users');
		console.log(res.data, 789);
	}

	initMember() {
		// 基于准备好的dom，初始化echarts实例
		var myChart = echarts.init(document.getElementById('data_member'));
		let options = {
			color: ['#3398DB'],
			tooltip : {
				trigger: 'axis',
				axisPointer : {            // 坐标轴指示器，坐标轴触发有效
					type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
				}
			},
			grid: {
				left: '1%',
				right: '1%',
				bottom: '3%',
				containLabel: true
			},
			xAxis : [
				{
					type : 'category',
					data : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
					axisTick: {
						alignWithLabel: true
					}
				}
			],
			yAxis : [
				{
					type : 'value'
				}
			],
			series : [
				{
					name:'直接访问',
					type:'bar',
					barWidth: '60%',
					data:[10, 52, 200, 334, 390, 330, 220]
				}
			]
		};
		// 绘制图表
		myChart.setOption(options);
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
				<Row className="data_common_detail">
					<Row className="data_common_detail_title">
						<div className="data_common_detail_title_left">会员报表</div>
						<div className="data_common_detail_title_right">
							<Button type="primary">本周</Button>
							<Button>本月</Button>
							<Button>本年</Button>
						</div>
					</Row>
					<Row id="data_member" className="data_common_detail_content"></Row>
				</Row>
			</div>
		);
	}
}
