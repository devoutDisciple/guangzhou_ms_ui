import React from 'react';
import {
	Button, Table, message, Form, Select, Col, Card, Row
} from 'antd';
const FormItem = Form.Item;
const { Option } = Select;
import Request from '../../../request/AxiosRequest';
import moment from 'moment';
import {inject, observer} from 'mobx-react';
import FilterOrderStatus from '../../../util/FilterOrderStatus';
import './index.less';

@inject('GlobalStore')
@observer
class Order extends React.Component{

	constructor(props) {
		super(props);
		this.globalStore = this.props.GlobalStore;
	}

	state = {
		oderList: [], // 全部订单
		selectType: 1, // 默认选择全部订单
		showData: [], // 列表订单
		classfyByAddressData: [], // 通过地址对订单分类
	}

	async componentDidMount() {
		this.props.form.setFieldsValue({status: '1'});
		// 查询所有订单
		await this.onSearchOrder();
	}

	// 查询所有订单
	async onSearchOrder() {
		let shopid = this.globalStore.userinfo.shopid;
		let res = await Request.get('/order/getListByShopid', {shopid: shopid});
		let data = res.data || [];
		data.map(item => {
			item.key = item.id;
			item.order_time = moment(item.order_time).format('YYYY-MM-DD HH:mm:ss');
		});
		console.log(this.state.selectType, 6789);
		this.setState({oderList: data}, () => {
			this.selectChange(this.state.selectType);
		});
	}

	// 但选择未接订单的时候，对数据进行分类
	async classifyByAddress() {
		let showData = this.state.showData;
		let data = [];
		showData.map((item => {
			let flag = false; // 默认没有
			data.map(list => {
				if(item.address == list.address) {
					flag = true;
					list.data.push(item);
				}
			});
			if(!flag) {
				data.push({
					address: item.address,
					data: [item]
				});
			}
		}));
		console.log(data, 888);
		this.setState({
			classfyByAddressData: data
		});
	}

	// 改变订单状态
	async onChangeOrderStatus(record, status) {
		let res = await Request.post('/order/updateStatus', {id: record.id, status});
		if(res.data == 'success') {
			message.success('更改成功');
			return this.onSearchOrder();
		}
	}

	// 下拉框改变的时候
	selectChange(value) {
		console.log(value, 333);
		this.setState({selectType: value});
		let orderlist = this.state.oderList;
		// 全部订单
		if(value == 1) {
			this.setState({
				showData: orderlist
			});
		}
		// 未接订单
		if(value == 2) {
			let showData = orderlist.filter(item => {
				if(item.status == 1) return true;
				return false;
			});
			this.setState({showData}, () => {
				// 对数据进行分类
				this.classifyByAddress();
			});
		}
		// 派送中订单
		if(value == 3) {
			let showData = orderlist.filter(item => {
				if(item.status == 2 || item.status == 3) return true;
				return false;
			});
			this.setState({showData}, () => {
				// 对数据进行分类
				this.classifyByAddress();
			});
		}
		// 已经完成订单
		if(value == 4) {
			let showData = orderlist.filter(item => {
				if(item.status == 4 || item.status == 6) return true;
				return false;
			});
			this.setState({showData});
		}
	}

	// 全部接单
	async tokenOrders(data, status) {
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
			this.onSearchOrder();
		}
	}

	// 打印订单
	printfOrder() {
		setTimeout(() => {
			message.success('打印成功');
		}, 1000);
	}

	render() {
		let {showData, selectType, classfyByAddressData} = this.state;
		const { getFieldDecorator } = this.props.form;
		const formItemLayout = {
			labelCol: { span: 4 },
			wrapperCol: { span: 20 },
		};
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
			{
				title: '收餐地址',
				dataIndex: 'address',
				key: 'address',
				align: 'center'
			},
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
				align: 'center'
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
		return (
			<div className='common'>
				<div className='common_search'>
					<Form {...formItemLayout}>
						<Col span={6}>
							<FormItem
								label="订单状态">
								{getFieldDecorator('status', {
									rules: [{
										required: true,
										message: '请选择',
									}],
								})(
									<Select placeholder="请选择" onChange={this.selectChange.bind(this)}>
										<Option value="1">全部订单</Option>
										<Option value="2">未接订单</Option>
										<Option value="3">派送中订单</Option>
										<Option value="4">已完成订单</Option>
									</Select>
								)}
							</FormItem>
						</Col>
						<Col span={6} offset={1}>
							<Button className='goods_search_btn' type='primary'>查询</Button>
						</Col>
					</Form>
				</div>
				{
					selectType == 2 || selectType == 3?
						<div className="shop_order_container">
							{
								classfyByAddressData.map((item, index) => {
									return (
										<Card
											className="shop_order_container_cart"
											key={index}
											title={`收货地址：${item.address}`}
											extra={<a href="javascript:;" onClick={this.tokenOrders.bind(this, item.data, selectType == 2 ? 2 : 4)}>{item.data, selectType == 2 ? '全部接单' : '派送完成'}</a>}>
											<Table
												bordered
												dataSource={item.data}
												columns={columns}
												pagination={false}/>
										</Card>
									);
								})
							}
						</div>
						:
						<div className='common_content'>
							<Table
								bordered
								dataSource={showData}
								columns={columns}
								pagination={
									{
										total: showData.length,
										showTotal: (total) => `共 ${total} 条`
									}
								}/>
						</div>
				}
			</div>
		);
	}
}

const OrderForm = Form.create()(Order);
export default OrderForm;
