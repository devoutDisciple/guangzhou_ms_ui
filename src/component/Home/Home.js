import React from 'react';
import { Layout } from 'antd';
const { Sider, Content, Footer } = Layout;
import Menu from '../Menu/Menu';
import MyHeader from './Header';
import { Route, Switch } from 'react-router-dom';
import {inject, observer} from 'mobx-react';
import './index.less';
import logo from '../../asserts/logo.png';

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
import Adver from '../admin/Adver/Adver';
import Rate from '../admin/Rate/Rate';
import Options from '../admin/Options/Options';

// 厨房
import MyShop from '../shop/MyShop/MyShop';
import ShopGoods from '../shop/Goods/Goods';
import ShopOrder from '../shop/Order/Order';
import ShopBill from '../shop/Bill/Bill';
import ShopData from '../shop/Data/Data';

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
                            贝沃思工作台
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
										<Route path="/home/rate" component={Rate} />
										<Route path="/home/adver" component={Adver} />
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
										<Route path="/home/options" component={Options} />
									</Switch>
									:
									<Switch>
										<Route exact path="/home/shop/data" component={ShopData} />
										<Route exact path="/home/shop/my" component={MyShop} />
										<Route exact path="/home/shop/goods" component={ShopGoods} />
										<Route exact path="/home/shop/order" component={ShopOrder} />
										<Route exact path="/home/shop/bill" component={ShopBill} />
									</Switch>
							}

						</div>
					</Content>
				</Layout>
				<Footer className="root_layout_footer">
					<img src={logo}/>
					<span>贝沃思私厨</span>
				</Footer>
			</React.Fragment>
		);
	}
}
