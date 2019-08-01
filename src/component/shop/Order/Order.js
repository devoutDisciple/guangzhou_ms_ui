import React from 'react';
import {
	Button, Table, Form, Col, Row, Input, DatePicker, message
} from 'antd';
const FormItem = Form.Item;
// const { Option } = Select;
import Request from '../../../request/AxiosRequest';
import moment from 'moment';
import {inject, observer} from 'mobx-react';
import FilterOrderStatus from '../../../util/FilterOrderStatus';
import './index.less';
const { RangePicker } = DatePicker;

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
		statusActive: 9, // 默认选择全部  订单是否打印
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

	// 订单状态点击的时候后
	statusClick(statusActive) {
		this.setState({statusActive}, () => this.goodsSearchBtnClick());
	}

	// 点击查询
	async goodsSearchBtnClick() {
		let {positionActive, statusActive} = this.state;
		let value = this.props.form.getFieldsValue();
		console.log(value);
		if(value.time) {
			value.start_time = moment(moment(value.time[0]).format('YYYY-MM-DD HH:mm:ss'));
			value.end_time = moment(moment(value.time[1]).format('YYYY-MM-DD HH:mm:ss'));
		}
		console.log(positionActive, statusActive, value);
		let params = {
			campus: positionActive,
			status: statusActive,
			...value
		};
		let result = await Request.post('/order/getOrderByStatusAndPosition', params);
		console.log(result);
		let data = result.data || [];
		data.map((item, index) => item.key = index);
		this.setState({orderList: data});
	}

	// 全部接单
	async tokenOrders(status) {
		let data = this.state.selectedRows;
		console.log(data);
		let params = [];
		data.map(item => {
			params.push({
				id: item.id,
				status: status
			});
		});
		let res = await Request.post('/order/updateMoreStatus', {data: params});
		console.log(res);
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
		let {orderList, position, positionActive, statusActive, selectedRows} = this.state;
		const rowSelection = {
			onChange: (selectedRowKeys, selectedRows) => {
				console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
				this.setState({
					selectedRowKeys, selectedRows
				});
			}
		};
		let address = {
			title: '收餐地址',
			dataIndex: 'address',
			key: 'address',
			align: 'center'
		};
		if(positionActive != 'all') {
			address.render = (value, row, index) => {
				const obj = {
					children: value,
					props: {},
				};
				if(index == 0) {
					obj.props.rowSpan = 6;
					return obj;
				}
				obj.props.colSpan = 0;
				return obj;
			};
		}
		const columns = [
			{
				title: '订单编号',
				dataIndex: 'id',
				key: 'id',
				align: 'center'
			},
			{
				title: '会员名称',
				dataIndex: 'username',
				key: 'username',
				align: 'center'
			},
			{
				title: '会员电话',
				dataIndex: 'userPhone',
				key: 'userPhone',
				align: 'center'
			},
			{
				title: '收餐人名称',
				dataIndex: 'people',
				key: 'people',
				align: 'center'
			},
			{
				title: '收餐人联系方式',
				dataIndex: 'phone',
				key: 'phone',
				align: 'center'
			},
			{...address},
			{
				title: '订单详情',
				dataIndex: 'detail',
				key: 'detail',
				align: 'center',
				render: (text, record) => {
					let orderList = JSON.parse(record.orderList) || [];
					return (
						<span>
							{
								orderList.map((item, index) => {
									return (
										<Row className="shop_order_detail" key={index}>
											<span className="shop_order_detail_img"><img className='common_table_img' src={item.goodsUrl}/></span>
											<span className="shop_order_detail_name">{item.goodsName}</span>
											<span className="shop_order_detail_num">x{item.num}</span>
										</Row>
									);
								})
							}
						</span>
					);
				}
			},
			{
				title: '订单总价',
				dataIndex: 'total_price',
				key: 'shopName',
				align: 'center'
			},
			{
				title: '订单时间',
				dataIndex: 'order_time',
				key: 'order_time',
				align: 'center',
				render: (text) => {
					return <span>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</span>;
				}
			},
			{
				title: '订单状态',
				dataIndex: 'status',
				key: 'status',
				align: 'center',
				render: (text, record) => {
					let status = record.status;
					if(status == 1 || status == 2 || status == 3) return <span style={{color: '#f3cf19'}}>{FilterOrderStatus.filterOrderStatus(record.status)}</span>;
					if(status == 4 || status == 6) return <span style={{color: '#008dff'}}>{FilterOrderStatus.filterOrderStatus(record.status)}</span>;
					if(status == 5) return <span style={{color: 'red'}}>{FilterOrderStatus.filterOrderStatus(record.status)}</span>;
				}
			},
			{
				title: '操作',
				dataIndex: 'operation',
				key: 'operation',
				align: 'center',
				render:(text, record) => {
					let status = record.status;
					return <span className="common_table_span">
						{
							status == 1 ?
								<a href="javascript:;" onClick={this.onChangeOrderStatus.bind(this, record, 2)}>接单</a>
								: <a href="javascript:;" disabled>接单</a>
						}
						{
							status == 2 ?
								<a href="javascript:;" onClick={this.onChangeOrderStatus.bind(this, record, 3)}>派送中</a>
								: <a href="javascript:;" disabled>派送中</a>
						}
						{
							status == 3 ?
								<a href="javascript:;" onClick={this.onChangeOrderStatus.bind(this, record, 4)}>订单完成</a>
								: <a href="javascript:;" disabled>订单完成</a>
						}
						{
							status != 4 && status != 5 && status != 6 ?
								<span>
									<a href="javascript:;" onClick={this.onChangeOrderStatus.bind(this, record, 5)}>取消该订单</a>
									<a href="javascript:;" onClick={this.printfOrder.bind(this, record)}>打印订单</a>
								</span>
								:
								<span>
									<a href="javascript:;" disabled>取消该订单</a>
									<a href="javascript:;" disabled>打印订单</a>
								</span>
						}
					</span>;
				}
			}
		];
		const { getFieldDecorator } = this.props.form;
		const formItemLayout = {
			labelCol: { span: 4 },
			wrapperCol: { span: 20 },
		};
		return (
			<div className='common'>
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
				<div className='common_search shop_order_search'>
					<Form {...formItemLayout}>
						<Row>
							<Col span={6}>
								<FormItem
									label="宝贝名称">
									{getFieldDecorator('name')(
										<Input placeholder="请输入"/>
									)}
								</FormItem>
							</Col>
							<Col span={6} offset={1}>
								<FormItem
									label="买家名称">
									{getFieldDecorator('people')(
										<Input placeholder="请输入"/>
									)}
								</FormItem>
							</Col>
							<Col span={6} offset={1}>
								<FormItem
									label="订单编号">
									{getFieldDecorator('id')(
										<Input placeholder="请输入"/>
									)}
								</FormItem>
							</Col>
						</Row>
						<Row>
							<Col span={6}>
								<FormItem
									label="订单时间">
									{getFieldDecorator('time')(
										<RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
									)}
								</FormItem>
							</Col>
							<Col span={6} offset={1}>
								<Button className='goods_search_btn' onClick={this.goodsSearchBtnClick.bind(this)} type='primary'>查询</Button>
							</Col>
						</Row>
					</Form>
				</div>
				<Row className='shop_order_title'>
					<Col span={18}>
						<Button
							onClick={this.statusClick.bind(this, 9)}
							type={statusActive == 9 ? 'primary' : null}>全部</Button>
						<Button
							onClick={this.statusClick.bind(this, 1)}
							type={statusActive == 1 ? 'primary' : null}>未打印</Button>
						<Button
							onClick={this.statusClick.bind(this, 2)}
							type={statusActive == 2 ? 'primary' : null}>已打印</Button>
						<Button
							onClick={this.statusClick.bind(this, 3)}
							type={statusActive == 3 ? 'primary' : null}>配送中</Button>
						<Button
							onClick={this.statusClick.bind(this, 4)}
							type={statusActive == 4 ? 'primary' : null}>已完成</Button>
						<Button
							onClick={this.statusClick.bind(this, 5)}
							type={statusActive == 5 ? 'primary' : null}>关闭订单</Button>
					</Col>
					<Col span={6} className="shop_order_btn_right">
						{
							statusActive == 1 ?
								<Button
									disabled={selectedRows.length == 0}
									onClick={this.tokenOrders.bind(this, 2)}
									type='primary'>全部打印</Button>
								: null
						}
						{
							statusActive == 2 ?
								<Button
									disabled={selectedRows.length == 0}
									onClick={this.tokenOrders.bind(this, 3)}
									type='primary'>全部派送</Button>
								: null
						}
						{
							statusActive == 3 ?
								<Button
									disabled={selectedRows.length == 0}
									onClick={this.tokenOrders.bind(this, 4)}
									type='primary'>全部完成</Button>
								: null
						}
					</Col>
				</Row>
				<div className='common_content'>
					<Table
						bordered
						dataSource={orderList}
						columns={columns}
						rowSelection={rowSelection}
						pagination={
							{
								total: orderList.length,
								showTotal: (total) => `共 ${total} 条`
							}
						}/>
				</div>
			</div>
		);
	}
}

const OrderForm = Form.create()(Order);
export default OrderForm;
