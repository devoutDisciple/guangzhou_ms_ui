import React from 'react';
import {
	Button, Checkbox, Form, Col, Row, Input, DatePicker, message, Tabs
} from 'antd';
const { TabPane } = Tabs;
const FormItem = Form.Item;
// const { Option } = Select;
import Request from '../../../request/AxiosRequest';
import moment from 'moment';
import {inject, observer} from 'mobx-react';
import './index.less';

@inject('GlobalStore')
@observer
class Order extends React.Component{

	constructor(props) {
		super(props);
		this.globalStore = this.props.GlobalStore;
	}

	state = {
		campus: '',
		position: [],
		positionActive: 'all', // 默认选择全部  订单地址
		print: 'all', // 默认选择全部  发货单状态 1-未打印 2-打印 all-全部
		sendtab: 1, // 配送的tab 2-等待派送 3-派送中 4-成功  5-取消   6-评价 7-退款
		orderList: [],
		selectedRowKeys: '',
		selectedRows: [],
	}

	async componentDidMount() {
		// 获取商店位置信息
		await this.getShopDetail();
		// 查询商店订单信息
		await this.goodsSearchBtnClick();
	}

	// 获取商店位置数据
	async getShopDetail() {
		let shopid = this.globalStore.userinfo.shopid;
		let shop = await Request.get('/shop/getShopByShopid', {id: shopid});
		let campus = shop.data.campus || '';
		let result = await Request.get('/position/getPositionByCampus', {campus});
		let floor = JSON.parse(result.data.floor) || [];
		let position = [];
		floor.map(item => {
			if(item.children && item.children.length) {
				item.children.map(address => {
					position.push(`${item.name} ${address.name}`);
				});
			}
		});
		this.setState({
			campus, position
		});
	}

	// 位置按钮点击的时候
	positionClick(positionActive) {
		this.setState({positionActive}, () => this.goodsSearchBtnClick());
	}

	// 是否打印点击的时候后
	printClick(print) {
		this.setState({print}, () => this.goodsSearchBtnClick());
	}

	// 派送tab点击之后
	sendTabClick(status) {
		this.setState({sendtab: status}, () => this.goodsSearchBtnClick());
	}

	// 点击查询
	async goodsSearchBtnClick() {
		let {positionActive, print, sendtab} = this.state;
		let value = this.props.form.getFieldsValue();
		if(value.time) {
			value.start_time = moment(value.start_time).format('YYYY-MM-DD HH:mm:ss');
			value.end_time = moment(value.end_time).format('YYYY-MM-DD HH:mm:ss');
		}
		let params = {
			campus: positionActive,
			print: print,
			sendtab: sendtab,
			...value
		};
		let result = await Request.post('/order/getOrderByStatusAndPosition', params);
		let data = result.data || [];
		data.map((item, index) => {
			item.key = index;
			item.orderList = JSON.parse(item.orderList) || [];
		});
		this.setState({orderList: data});
	}

	// 全部接单
	async tokenOrders(status) {
		let data = this.state.selectedRows;
		let params = [];
		data.map(item => {
			params.push({
				id: item.id,
				status: status
			});
		});
		let res = await Request.post('/order/updateMoreStatus', {data: params});
		if(res.data == 'success') {
			message.success('操作成功');
			this.goodsSearchBtnClick();
		}
	}

	// 改变订单状态
	async onChangeOrderStatus(record, status) {
		let res = await Request.post('/order/updateStatus', {id: record.id, status});
		if(res.data == 'success') {
			message.success('更改成功');
			return this.goodsSearchBtnClick();
		}
	}

	// 打印订单
	printfOrder() {
		setTimeout(() => {
			message.success('打印成功');
		}, 1000);
	}


	render() {
		let {position, positionActive, print, orderList} = this.state;
		const { getFieldDecorator } = this.props.form;
		const formItemLayout = {
			labelCol: { span: 8 },
			wrapperCol: { span: 16 },
		};
		return (
			<div className='common shop_order'>
				<Row className='shop_order_title'>
					<Button
						onClick={this.positionClick.bind(this, 'all')}
						type={positionActive == 'all' ? 'primary' : null}>全部订单</Button>
					{
						position && position.length != 0 ?
							position.map((item, index) => {
								return <Button
									key={index}
									type={positionActive == item ? 'primary' : null}
									onClick={this.positionClick.bind(this, item)}>{item}</Button>;
							})
							: null
					}
				</Row>
				<div className='shop_order_search'>
					<Form {...formItemLayout}>
						<Row>
							<Col span={4}>
								<FormItem
									label="宝贝名称">
									{getFieldDecorator('name')(
										<Input placeholder="请输入"/>
									)}
								</FormItem>
							</Col>
							<Col span={4}>
								<FormItem
									label="买家名称">
									{getFieldDecorator('people')(
										<Input placeholder="请输入"/>
									)}
								</FormItem>
							</Col>
							<Col span={4}>
								<FormItem
									label="订单编号">
									{getFieldDecorator('id')(
										<Input placeholder="请输入"/>
									)}
								</FormItem>
							</Col>
							<Col span={4}>
								<FormItem label="成交时间：从" colon={false}>
									{getFieldDecorator('start_time')(
										<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />,
									)}
								</FormItem>
							</Col>
							<Col span={4}>
								<FormItem label="到" colon={false}>
									{getFieldDecorator('end_time')(
										<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />,
									)}
								</FormItem>
							</Col>
							<Col span={3} offset={1}>
								<Button className='goods_search_btn' onClick={this.goodsSearchBtnClick.bind(this)} type='primary'>查询</Button>
							</Col>
						</Row>
					</Form>
				</div>
				<Row className="shop_order_tabs">
					<Tabs defaultActiveKey="1" onTabClick={this.sendTabClick.bind(this)}>
						<TabPane tab="未接订单" key="1">
						</TabPane>
						<TabPane tab="等待派送" key="2">
						</TabPane>
						<TabPane tab="派送中" key="3">
						</TabPane>
						<TabPane tab="退款中" key="7">
						</TabPane>
						<TabPane tab="成功的订单" key="4">
						</TabPane>
						<TabPane tab="关闭的订单" key="5">
						</TabPane>
					</Tabs>
				</Row>
				<Row className="shop_order_print">
					<Col className="shop_order_print_left" span={8}><Checkbox>全选</Checkbox></Col>
					<Col className="shop_order_print_center" span={8}>发货单:
						<Button onClick={this.printClick.bind(this, 'all')} type={print == 'all' ? 'primary' : null}>全部</Button>
						<Button onClick={this.printClick.bind(this, 1)} type={print == 1 ? 'primary' : null}>未打印</Button>
						<Button onClick={this.printClick.bind(this, 2)} type={print == 2 ? 'primary' : null}>已打印</Button>
					</Col>
					<Col className="shop_order_print_right" span={8}></Col>
				</Row>
				<div className='common_content'>
					{
						orderList && orderList.length != 0 ?
							orderList.map((item, index) => {
								return (
									<Row key={index} className="shop_order_table_chunk">
										<Row className="shop_order_table_title">
											<Col span={3}>宝贝</Col>
											<Col span={3}>单价</Col>
											<Col span={3}>数量</Col>
											<Col span={3}>备注</Col>
											<Col span={3}>收货信息</Col>
											<Col span={3}>交易状态</Col>
											<Col span={3}>实收款</Col>
											<Col span={3}>评价</Col>
										</Row>
										<Row className="shop_order_table_content">
											<Row className="shop_order_table_content_title">
												<Checkbox>订单号: {item.id}</Checkbox>
												<span>创建时间：{item.order_time}</span>
											</Row>
											<Row className="shop_order_table_content_table">
												<Col className="shop_order_table_content_table_left" span={9}>
													{
														item.orderList && item.orderList.length != 0 ?
															item.orderList.map((order, i) => {
																return (
																	<Row className="shop_order_table_content_table_left_chunk" key={i}>
																		<Col span={8}>
																			<Col span={12}><img src={order.goodsUrl}/></Col>
																			<Col span={12}>{order.goodsName}</Col>
																		</Col>
																		<Col span={8}>回锅肉</Col>
																		<Col span={8}>回锅肉</Col>
																	</Row>
																);
															})
															: null
													}

													<Row className="shop_order_table_content_table_left_chunk">
														<Col span={6}>
															<Col span={12}><img src="http://www.bws666.com/goods/6NC95A944CZK-1564499305142.jpg"/></Col>
															<Col span={12}>回锅肉</Col>
														</Col>
														<Col span={6}>回锅肉</Col>
														<Col span={6}>回锅肉</Col>
														<Col span={6}>回锅肉</Col>
													</Row>
												</Col>
												<Col
													className="shop_order_table_content_table_right"
													span={14}
													style={{height: '200px', lineHeight: '200px'}}>
													<Col className="shop_order_table_content_table_right_chunk" span={5}>回锅肉</Col>
													<Col className="shop_order_table_content_table_right_chunk"span={5}>回锅肉</Col>
													<Col className="shop_order_table_content_table_right_chunk"span={5}>回锅肉</Col>
													<Col className="shop_order_table_content_table_right_chunk"span={5}>回锅肉</Col>
													<Col className="shop_order_table_content_table_right_chunk"span={4}>回锅肉</Col>
												</Col>
											</Row>
										</Row>
									</Row>
								);
							})
							: null
					}

				</div>
				<Row className="shop_order_fixed">
					<Button>批量派送</Button>
					<Button>批量打印订单</Button>
				</Row>
			</div>
		);
	}
}

const OrderForm = Form.create()(Order);
export default OrderForm;
