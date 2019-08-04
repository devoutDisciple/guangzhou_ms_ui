import React from 'react';
import {
	Button, Checkbox, Form, Col, Row, Input, DatePicker, message, Tabs, Tooltip, Popconfirm
} from 'antd';
const { TabPane } = Tabs;
const FormItem = Form.Item;
// const { Option } = Select;
import Request from '../../../request/AxiosRequest';
import moment from 'moment';
import {inject, observer} from 'mobx-react';
import './index.less';
import FilterOrderStatus from '../../../util/FilterOrderStatus';

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
		sendtab: 1, // 配送的tab 1-等待派送 2-派送中 3-成功  4-取消   6-评价 7-退款
		orderList: [],
		selectedRowKeys: '',
		selectedRows: [],
		checkAll: false, // 是否全选
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

	// 改变单个按钮是否选择的时候
	checkboxClick(record) {
		console.log(record, 888);
		let orderList = this.state.orderList;
		for(let item of orderList) {
			if(item.id == record.id) {
				item.checked = !item.checked;
				break;
			}
		}
		this.setState({orderList});
	}

	// 点击全选的时候
	checkBoxAllClick() {
		let {checkAll, orderList} = this.state;
		this.setState({checkAll: !checkAll}, () => {
			orderList.map(item => item.checked = !checkAll);
			this.setState({orderList});
		});

	}

	// 点击查询
	async goodsSearchBtnClick() {
		let {positionActive, print, sendtab} = this.state;
		let value = this.props.form.getFieldsValue();
		console.log(value);
		if(value.time) {
			value.start_time = moment(value.start_time).format('YYYY-MM-DD HH:mm:ss');
			value.end_time = moment(value.end_time).format('YYYY-MM-DD HH:mm:ss');
		}
		console.log(positionActive, print, value);
		let params = {
			campus: positionActive,
			print: print,
			sendtab: sendtab,
			...value
		};
		let result = await Request.post('/order/getOrderByStatusAndPosition', params);
		console.log(result);
		let data = result.data || [];
		data.map((item, index) => {
			item.key = index;
			item.orderList = JSON.parse(item.orderList) || [];
			item.order_time = moment(item.order_time).format('YYYY-MM-DD HH:mm:ss');
		});
		this.setState({orderList: data});
	}

	// 批量派送
	async tokenOrders() {
		let data = [];
		let orderList = this.state.orderList;
		orderList.map(item => {
			item.checked ? data.push(item) : null;
		});
		if(data.length == 0) return message.warning('请勾选操作的订单');
		let params = [];
		data.map(item => {
			params.push({
				id: item.id,
				status: 2
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

	// 取消订单
	async cancelOrder(data) {
		let res = await Request.post('/order/updateStatus', {id: data.id, status: 4});
		if(res.data == 'success') {
			message.success('取消成功');
			return this.goodsSearchBtnClick();
		}
	}

	// 打印订单
	async allPrint() {
		let data = [];
		let orderList = this.state.orderList;
		orderList.map(item => {
			item.checked ? data.push(item) : null;
		});
		if(data.length == 0) return message.warning('请勾选操作的订单');
		let params = [];
		data.map(item => {
			params.push({
				id: item.id,
				print: 2
			});
		});
		let res = await Request.post('/order/updateMorePrint', {data: params});
		if(res.data == 'success') {
			message.success('操作成功');
			this.goodsSearchBtnClick();
		}
		setTimeout(() => {
			message.success('打印成功');
		}, 1000);
	}

	render() {
		let {position, positionActive, print, orderList, checkAll, sendtab} = this.state;
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
						<TabPane tab="等待派送" key="1" />
						<TabPane tab="派送中" key="2" />
						<TabPane tab="退款中" key="6" />
						<TabPane tab="成功的订单" key="3" />
						<TabPane tab="关闭的订单" key="4" />
					</Tabs>
				</Row>
				<Row className="shop_order_print">
					<Col className="shop_order_print_left" span={8}><Checkbox checked={checkAll} onChange={this.checkBoxAllClick.bind(this)}>全选</Checkbox></Col>
					<Col className="shop_order_print_center" span={8}>发货单:
						<Button onClick={this.printClick.bind(this, 'all')} type={print == 'all' ? 'primary' : null}>全部</Button>
						<Button onClick={this.printClick.bind(this, 1)} type={print == 1 ? 'primary' : null}>未打印</Button>
						<Button onClick={this.printClick.bind(this, 2)} type={print == 2 ? 'primary' : null}>已打印</Button>
					</Col>
					<Col className="shop_order_print_right" span={8}></Col>
				</Row>
				<div className='common_content'>
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
					{
						orderList && orderList.length != 0 ?
							orderList.map((item, index) => {
								return (
									<Row key={index} className="shop_order_table_chunk">
										<Row className="shop_order_table_content">
											<Row className="shop_order_table_content_title">
												<Checkbox
													onChange={this.checkboxClick.bind(this, item)}
													checked={item.checked}>
													订单号: {item.id}
												</Checkbox>
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
																			<Col span={12} className="common_table_tooltip">
																				<Tooltip placement="top" title={order.goodsName}>
																					{order.goodsName}
																				</Tooltip>
																			</Col>
																		</Col>
																		<Col span={8}>{order.price}</Col>
																		<Col span={8}>{order.num}</Col>
																	</Row>
																);
															})
															: null
													}
												</Col>
												<Col
													className="shop_order_table_content_table_right"
													span={15}
													style={{height: `${item.orderList.length * 100}px`, lineHeight: `${item.orderList.length * 100}px`}}>
													<Col className="shop_order_table_content_table_right_chunk" span={5}>{item.desc ? item.desc : '--'}</Col>
													<Col className="shop_order_table_content_table_right_chunk"span={5}>
														<Row className="shop_order_table_content_table_right_chunk_address">
															<Row>地址: {item.address}</Row>
															<Row>姓名: {item.people}</Row>
															<Row>电话: {item.phone}</Row>
														</Row>
													</Col>
													<Col
														className="shop_order_table_content_table_right_chunk"span={5}>
														{FilterOrderStatus.filterOrderStatus(item.status)}
														<Popconfirm placement="top" title="是否确认取消该订单" onConfirm={this.cancelOrder.bind(this, item)} okText="确认" cancelText="取消">
															<a href="javascript:;" style={{marginLeft: '5px', fontSize: '10px'}}>
															取消该订单
															</a>
     													</Popconfirm>
													</Col>
													<Col className="shop_order_table_content_table_right_chunk"span={5}>{item.total_price}</Col>
													<Col className="shop_order_table_content_table_right_chunk"span={4}>--</Col>
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
					<Button onClick={this.allPrint.bind(this)}>批量打印订单</Button>
					{
						sendtab == 1 ?
							<Button onClick={this.tokenOrders.bind(this)}>批量派送</Button>
							: null
					}
				</Row>
			</div>
		);
	}
}

const OrderForm = Form.create()(Order);
export default OrderForm;
