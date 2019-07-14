import React from 'react';
import { Menu, Icon } from 'antd';
const { SubMenu }  = Menu;

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
				<Menu.Item key="5">
					<Icon type="inbox" />
					<span>今日推荐</span>
				</Menu.Item>
				<Menu.Item key="6">
					<Icon type="inbox" />
					<span>综合排序</span>
				</Menu.Item>
				<Menu.Item key="7">
					<Icon type="inbox" />
					<span>提现管理</span>
				</Menu.Item>
				<Menu.Item key="8">
					<Icon type="inbox" />
					<span>营收报表</span>
				</Menu.Item>

				<Menu.Item key="10">
					<Icon type="inbox" />
					<span>意见反馈</span>
				</Menu.Item>
				<SubMenu
					key="sub1"
					title={
						<span>
							<Icon type="mail" />
							<span>Navigation One</span>
						</span>
					}>
					<Menu.Item key="9">Option 5</Menu.Item>
					<Menu.Item key="6">Option 6</Menu.Item>
					<Menu.Item key="7">Option 7</Menu.Item>
					<Menu.Item key="8">Option 8</Menu.Item>
				</SubMenu>
			</Menu>
		);
	}
}
