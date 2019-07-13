import React from 'react';
import {inject, observer} from 'mobx-react';
import './index.less';
import {
	Button, Table, Popconfirm, message, Tooltip
} from 'antd';
import AddDialog from './AddDialog';
import './index.less';
import Request from '../../request/AxiosRequest';

@inject('ShopStore')
@observer
export default class Swiper extends React.Component{

	constructor(props) {
		super(props);
		this.shopStore = props.ShopStore;
	}

	state = {
		addDialogVisible: false,
	}

	componentDidMount() {
		this.onSearch();
	}

	// 新增编辑框的显示
	controllerAddDialog() {
		this.setState({
			addDialogVisible: !this.state.addDialogVisible
		});
	}
	// 编辑框的显示
	controllerEditorDialog() {
		this.setState({
			editorDialogVisible: !this.state.editorDialogVisible
		});
	}

	// 确认删除
	async onConfirmDelete(record) {
		let result = await Request.post('/shop/delete', {id: record.id});
		console.log(result);
		if(result.data == 'success') {
			message.success('删除成功');
			return this.onSearch();
		}
	}

	// 点击修改
	onEditorCampus(record) {
		this.setState({
			editData: record
		}, () => {
			this.controllerEditorDialog();
		});
	}

	// 点击搜索
	onSearch() {
		this.shopStore.getAll();
	}

	render() {
		const columns = [
			{
				title: '名称',
				dataIndex: 'name',
				key: 'name',
				align: 'center'
			},
			{
				title: '销售量',
				dataIndex: 'sales',
				key: 'sales',
				align: 'center'
			},
			{
				title: '起送价格',
				dataIndex: 'start_price',
				key: 'start_price',
				align: 'center'
			},
			{
				title: '配送费',
				dataIndex: 'send_price',
				key: 'send_price',
				align: 'center'
			},
			{
				title: '餐盒费',
				dataIndex: 'package_cost',
				key: 'package_cost',
				align: 'center'
			},
			{
				title: '开店时间',
				dataIndex: 'start_time',
				key: 'start_time',
				align: 'center'
			},
			{
				title: '关店时间',
				dataIndex: 'end_time',
				key: 'end_time',
				align: 'center'
			},
			{
				title: '地址',
				dataIndex: 'address',
				key: 'address',
				align: 'center',
				render:(text, record) => {
					return <Tooltip placement="top" title={record.address}>
						<span className='common_table_ellipse'>{record.address}</span>
					   </Tooltip>;
				}
			},
			{
				title: '店铺状态',
				dataIndex: 'status',
				key: 'status',
				align: 'center',
				render:(text, record) => {
					if(record.status == 1) return <span className='common_cell_green'>开启</span>;
					return <span className='common_cell_red'>关闭</span>;
				}
			},
			{
				title: '权重',
				dataIndex: 'sort',
				key: 'sort',
				align: 'center'
			},
			{
				title: '操作',
				dataIndex: 'operation',
				key: 'operation',
				align: 'center',
				render:(text, record) => {
					return <span className="common_table_span">
						<a href="javascript:;" onClick={this.onEditorCampus.bind(this, record)}>修改</a>
						<a href="javascript:;" onClick={this.onEditorCampus.bind(this, record)}>关店</a>
						<Popconfirm placement="top" title="是否确认删除" onConfirm={this.onConfirmDelete.bind(this, record)} okText="确认" cancelText="取消">
							<a href="javascript:;" >删除</a>
     					</Popconfirm>
					</span>;
				}
			}
		];
		let {list} = this.shopStore, {addDialogVisible} = this.state;
		return (
			<div className='common'>
				<div className='common_search'>
					<Button type='primary' onClick={this.controllerAddDialog.bind(this)}>新增</Button>
				</div>
				<div className='common_content'>
					<Table
						bordered
						dataSource={list}
						columns={columns}
						pagination={
							{
								total: list.length || 0,
								showTotal: (total) => `共 ${total} 条`
							}
						}/>
				</div>
				{
					addDialogVisible ?
						<AddDialog
							onSearch={this.onSearch.bind(this)}
							controllerAddDialog={this.controllerAddDialog.bind(this)}/>
						: null
				}
			</div>
		);
	}
}
