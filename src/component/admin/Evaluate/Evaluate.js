import React from 'react';
import {
	Table, Tooltip
} from 'antd';
// // const { Option } = Select;
import Request from '../../../request/AxiosRequest';
import moment from 'moment';

export default class Evaluate extends React.Component{

	constructor(props) {
		super(props);
	}

	state = {
		evaluateList: []
	}

	async componentDidMount() {
		let result = await Request.get('/evaluate/getAll');
		let data = result.data;
		data.map(item => {
			item.key = item.id;
			item.create_time = moment(item.create_time).format('YYYY-MM-DD HH:mm:ss');
		});
		this.setState({
			evaluateList: data
		});
	}



	// 查看订单详情
	async onSearchOrderDetail() {

	}


	render() {
		let {evaluateList} = this.state;
		const columns = [
			{
				title: '用户名',
				dataIndex: 'username',
				key: 'username',
				align: 'center'
			},
			{
				title: '订单编号',
				dataIndex: 'orderid',
				key: 'orderid',
				align: 'center'
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
			},
			// {
			// 	title: '操作',
			// 	dataIndex: 'operation',
			// 	key: 'operation',
			// 	align: 'center',
			// 	render:(text, record) => {
			// 		return <span className="common_table_span">
			// 			<a href="javascript:;" onClick={this.onSearchOrderDetail.bind(this, record)}>订单详情</a>
			// 		</span>;
			// 	}
			// }
		];
		return (
			<div className='common'>
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
