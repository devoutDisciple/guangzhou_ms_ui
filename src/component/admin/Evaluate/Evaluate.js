import React from 'react';
import {
	Table, Tooltip, Form, Col, Input, Button
} from 'antd';
import Request from '../../../request/AxiosRequest';
import moment from 'moment';
const FormItem = Form.Item;

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
		this.onSearchEvaluateList();
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
		let value = this.props.form.getFieldsValue();
		console.log(value, 8989);
		let result = await Request.get('/evaluate/getEvaluate', value);
		let data = result.data || [];
		let list = [];
		data.map(item => {
			item.key = item.id;
			item.create_time = moment(item.create_time).format('YYYY-MM-DD HH:mm:ss');
			if(item.shopName.includes(name)) list.push(item);
		});
		this.setState({
			evaluateList: list
		});
	}


	render() {
		let {evaluateList} = this.state;
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
				title: '菜品名称',
				dataIndex: 'goodsName',
				key: 'goodsName',
				align: 'center'
			},
			{
				title: '商店名称',
				dataIndex: 'shopName',
				key: 'shopName',
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
					<Form className="common_search_form" {...formItemLayout}>
						<Col span={6}>
							<FormItem
								label="商店名称">
								{getFieldDecorator('name')(
									<Input placeholder="请输入商店名称" />
								)}
							</FormItem>
						</Col>
						<Col span={6} offset={1}>
							<Button type='primary' onClick={this.onSearchEvaluateList.bind(this)}>查询</Button>
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
