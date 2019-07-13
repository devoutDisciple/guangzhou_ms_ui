import React from 'react';
import { Menu, Icon } from 'antd';
const { SubMenu }  = Menu;

export default class MyMenu extends React.Component {

	onClickMenu({key}) {
		location.hash = key;
	}



	render() {
		return (
			<Menu
				mode="inline"
				theme="dark"
				onClick={this.onClickMenu.bind(this)}
				defaultSelectedKeys={['/home/campus']}
				inlineCollapsed={false}>
				<Menu.Item key="/home/campus">
					<Icon type="inbox" />
					<span>校区管理</span>
				</Menu.Item>
				<Menu.Item key="/home/swiper">
					<Icon type="pie-chart" />
					<span>首页轮播图</span>
				</Menu.Item>
				<Menu.Item key="/home/shop">
					<Icon type="pie-chart" />
					<span>商店管理</span>
				</Menu.Item>
				<Menu.Item key="4">
					<Icon type="inbox" />
					<span>菜品录入</span>
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
				<Menu.Item key="9">
					<Icon type="inbox" />
					<span>会员管理</span>
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
