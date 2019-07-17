import React from 'react';
import { Menu, Icon } from 'antd';

export default class MyMenu extends React.Component {

	constructor(props) {
		super(props);
	}

	state = {
		selectedKeys: '/home/campus'
	}

	componentDidMount() {
		let hash = location.hash;
		let selectedKeys = '';
		if(hash.startsWith('#')) {
			selectedKeys = hash.split('#')[1];
			this.setState({
				selectedKeys: selectedKeys
			});
		}
	}

	onSelect(data) {
		console.log(data);
		let key = data.key;
		location.hash = '#' + key;
		this.setState({
			selectedKeys: key
		});
	}

	render() {
		return (
			<Menu
				mode="inline"
				theme="dark"
				onSelect={this.onSelect.bind(this)}
				selectedKeys={[this.state.selectedKeys]}
				inlineCollapsed={false}>

				<Menu.Item key="/home/campus">
					<Icon type="inbox" />
					<span>校区管理</span>
				</Menu.Item>
				<Menu.Item key="/home/member">
					<Icon type="inbox" />
					<span>会员管理</span>
				</Menu.Item>
				<Menu.Item key="/home/swiper">
					<Icon type="pie-chart" />
					<span>首页轮播图</span>
				</Menu.Item>
				<Menu.Item key="/home/shop">
					<Icon type="pie-chart" />
					<span>商店管理</span>
				</Menu.Item>
				<Menu.Item key="/home/goods">
					<Icon type="inbox" />
					<span>菜品管理</span>
				</Menu.Item>
				<Menu.Item key="/home/today">
					<Icon type="inbox" />
					<span>今日推荐</span>
				</Menu.Item>
				{/* <Menu.Item key="/home/">
					<Icon type="inbox" />
					<span>意见反馈</span>
				</Menu.Item> */}
				<Menu.Item key="/home/order">
					<Icon type="inbox" />
					<span>订单管理</span>
				</Menu.Item>
				<Menu.Item key="/home/money">
					<Icon type="inbox" />
					<span>提现管理</span>
				</Menu.Item>
				<Menu.Item key="/home/evaluate">
					<Icon type="inbox" />
					<span>用户评价</span>
				</Menu.Item>
				<Menu.Item key="/home/data">
					<Icon type="inbox" />
					<span>数据汇总</span>
				</Menu.Item>
			</Menu>
		);
	}
}
