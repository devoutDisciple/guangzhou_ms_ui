import React from 'react';
import Request from '../../../request/AxiosRequest';
import {
	Table,
} from 'antd';
import EditorDialog from './EditorDialog';

export default class Adver extends React.Component{

	constructor(props) {
		super(props);
	}

	state = {
		data: [],
		visible: false,
		editData: {}
	}

	componentDidMount() {
		this.onSearch();
	}

	// 获取广告数据
	async onSearch() {
		let result = await Request.get('/adver/getAll');
		let data = result.data || [];
		data.map(item => item.key = item.id);
		console.log(data);
		this.setState({data});
	}

	// 控制弹框开关
	controllerEditorDialog() {
		this.setState({visible: !this.state.visible});
	}

	// 点击编辑
	onEditAdver(data) {
		this.setState({
			editData: data
		}, () => this.controllerEditorDialog());
	}

	render() {
		const columns = [
			{
				title: '广告图',
				dataIndex: 'url',
				key: 'url',
				align: 'center',
				render: (text, record) => {
					return <img className='common_table_img' src={record.url}/>;
				}
			},
			{
				title: '关联店铺',
				dataIndex: 'shopName',
				key: 'shopName',
				align: 'center'
			},
			{
				title: '关联商品',
				dataIndex: 'goodsName',
				key: 'goodsName',
				align: 'center'
			},
			{
				title: '是否开启',
				dataIndex: 'status',
				key: 'status',
				align: 'center',
				render: (text, record) => {
					if(record.status == 1) return <a href="javascript:;">开启</a>;
					return <a href="javascript:;">关闭</a>;
				}
			},
			{
				title: '操作',
				dataIndex: 'operation',
				key: 'operation',
				align: 'center',
				render: (text, record) => {
					return <a href="javascript:;" onClick={this.onEditAdver.bind(this, record)}>修改</a>;
				}
			},
		];
		let {data, visible, editData} = this.state;
		return (
			<div className='common'>
				<div className='common_content'>
					<Table
						bordered
						dataSource={data}
						columns={columns}
						pagination={false}/>
				</div>
				{
					visible ?
						<EditorDialog
							editData={editData}
							onSearch={this.onSearch.bind(this)}
							controllerEditorDialog={this.controllerEditorDialog.bind(this)}/>
						: null
				}
			</div>
		);
	}
}