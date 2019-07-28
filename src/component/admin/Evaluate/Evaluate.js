import React from 'react';
import {
	Table, Tooltip, Form, Select, Col
} from 'antd';
import Request from '../../../request/AxiosRequest';
import moment from 'moment';
const FormItem = Form.Item;
const Option = Select.Option;

class Evaluate extends React.Component{

	constructor(props) {
		super(props);
	}

	state = {
		evaluateList: [],
		shopid: '',
		shopList: []
	}

	async componentDidMount() {
		this.onSearchShop();
	}

	// 查询商店
	async onSearchShop() {
		let res = await Request.get('/shop/getAllForSelect');
		let shopList = res.data || [];
		if(shopList && shopList.length != 0) {
			let id = shopList[0].id;
			this.setState({
				shopid: id,
				shopList: shopList
			}, async () => {
				setTimeout(() => {
					this.props.form.setFieldsValue({
						shop: id,
					});
				}, 100);
				await this.onSearchEvaluateList();
			});
		}
	}

	// 下拉选择改变的时候
	selectChange(id) {
		this.setState({
			shopid: id,
		}, async () => {
			await this.onSearchEvaluateList();
		});
	}

	// 查询评价列表
	async onSearchEvaluateList() {
		let result = await Request.get('/evaluate/getEvaluateByShopId', {shopid: this.state.shopid});
		let data = result.data;
		data.map(item => {
			item.key = item.id;
			item.create_time = moment(item.create_time).format('YYYY-MM-DD HH:mm:ss');
		});
		this.setState({
			evaluateList: data
		});
	}


	render() {
		let {evaluateList, shopList} = this.state;
		const columns = [
			{
				title: '订单编号',
				dataIndex: 'orderid',
				key: 'orderid',
				align: 'center'
			},
			{
				title: '用户名',
				dataIndex: 'username',
				key: 'username',
				align: 'center'
			},
			{
				title: '用户头像',
				dataIndex: 'avatarUrl',
				key: 'avatarUrl',
				align: 'center',
				render: (text, record) => {
					return <img style={{width: '33px'}} src={record.avatarUrl}/>;
				}
			},
			{
				title: '商品名称',
				dataIndex: 'goodsName',
				key: 'goodsName',
				align: 'center'
			},
			{
				title: '描述',
				dataIndex: 'desc',
				key: 'desc',
				align: 'center',
				render: (text, record) => {
					return <Tooltip placement="top" title={record.desc}>
						<span className='common_table_ellipse'>{record.desc ? record.desc : '--'}</span>
					   </Tooltip>;
				}
			},
			{
				title: '商店评分',
				dataIndex: 'shop_grade',
				key: 'shop_grade',
				align: 'center'
			},
			{
				title: '骑手评分',
				dataIndex: 'sender_grade',
				key: 'sender_grade',
				align: 'center'
			},
			{
				title: '创建时间',
				dataIndex: 'create_time',
				key: 'create_time',
				align: 'center'
			}
		];
		const { getFieldDecorator } = this.props.form;
		const formItemLayout = {
			labelCol: { span: 4 },
			wrapperCol: { span: 20 },
		};
		return (
			<div className='common'>
				<div className='common_search'>
					<Form {...formItemLayout}>
						<Col span={6}>
							<FormItem
								label="商店">
								{getFieldDecorator('shop', {
									rules: [{
										required: true,
										message: '请选择',
									}],
								})(
									<Select placeholder="请选择" onChange={this.selectChange.bind(this)}>
										{
											shopList && shopList.length != 0 ?
												shopList.map(item => {
													return <Option key={item.id} value={item.id}>{item.name}</Option>;
												})
												: null
										}
									</Select>
								)}
							</FormItem>
						</Col>
					</Form>
				</div>
				<div className='common_content'>
					<Table
						bordered
						dataSource={evaluateList}
						columns={columns}
						pagination={
							{
								total: evaluateList.length,
								showTotal: (total) => `共 ${total} 条`
							}
						}/>
				</div>
			</div>
		);
	}
}

const EvaluateForm = Form.create()(Evaluate);
export default EvaluateForm;
