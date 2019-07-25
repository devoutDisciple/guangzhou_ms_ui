import React from 'react';
import { Layout } from 'antd';
const { Sider, Content, Footer } = Layout;
import Menu from '../Menu/Menu';
import MyHeader from './Header';
import { Route, Switch } from 'react-router-dom';
import {inject, observer} from 'mobx-react';
import './index.less';

// 管理员
import Swiper from '../admin/Swiper/Swiper';
import Campus from '../admin/Campus/Campus';
import Shop from '../admin/Shop/Shop';
import Goods from '../admin/Goods/Goods';
import Member from '../admin/Member/Member';
import Today from '../admin/Today/Today';
import Order from '../admin/Order/Order';
import Money from '../admin/Money/Money';
import Evaluate from '../admin/Evaluate/Evaluate';
import Data from '../admin/Data/Data';

// 商店
import MyShop from '../shop/MyShop/MyShop';

@inject('GlobalStore')
@observer
export default class MyLayout extends React.Component{

	constructor(props) {
		super(props);
		this.globalStore = this.props.GlobalStore;
	}

	componentDidMount() {
	}

	render() {
		let {role} = this.globalStore.userinfo;
		return (
			<React.Fragment>
				<Layout>
					<Sider className="root_layout_sider">
						<div className="root_layout_sider_header">
                            贝沃思管理后台
						</div>
						<Menu />
					</Sider>
					<Content className="root_layout_content">
						<MyHeader />
						<div className='content'>
							{
								role == 1 ?
									<Switch>
										<Route exact path="/home" component={Campus} />
										<Route path="/home/swiper" component={Swiper} />
										<Route path="/home/campus" component={Campus} />
										<Route path="/home/shop" component={Shop} />
										<Route path="/home/goods" component={Goods} />
										<Route path="/home/member" component={Member} />
										<Route path="/home/today" component={Today} />
										<Route path="/home/order" component={Order} />
										<Route path="/home/money" component={Money} />
										<Route path="/home/evaluate" component={Evaluate} />
										<Route path="/home/data" component={Data} />
									</Switch>
									:
									<Switch>
										<Route exact path="/home/shop/my" component={MyShop} />
									</Switch>
							}

						</div>
					</Content>
				</Layout>
				<Footer className="root_layout_footer">专业小程序开发者 微信号： 15906672702 </Footer>
			</React.Fragment>
		);
	}
}
