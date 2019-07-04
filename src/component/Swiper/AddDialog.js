import React from 'react';
import {
	Form, Input, Modal, Row, Col, Icon, message
} from 'antd';
import Request from '../../request/AxiosRequest';
import {inject, observer} from 'mobx-react';
const FormItem = Form.Item;

@inject('CampusStore')
@observer
class AddDialog extends React.Component {

	constructor(props) {
		super(props);
		this.campusStore = props.CampusStore;
	}

	state = {
	};

	componentDidMount() {
	}

	handleOk()  {
		this.props.form.validateFields(async (err, values) => {
			try {
				if (err) return;
				let nodes = $.fn.zTree.getZTreeObj('campus_tree').getNodes();
				let newNodes = this.getNodes(nodes, []);
				console.log(newNodes, 222);
				console.log(values, 111);
				let params = Object.assign(values, {floor: newNodes});
				let result = await Request.post('/position/add', params);
				console.log(result,3333);
				if(result.data == 'success') {
					message.success('新增成功');
					this.props.onSearch();
					return this.props.controllerAddDialog();
				}
			} catch (error) {
				console.log(error);
			}
		});
	}

	handleCancel() {
		this.props.controllerAddDialog();
	}

	render() {
		const { getFieldDecorator } = this.props.form;
		const formItemLayout = {
			labelCol: { span: 4 },
			wrapperCol: { span: 20 },
		};
		return (
			<div>
				<Modal
					className='common_dialog'
					title="新增校区"
					visible={true}
					onOk={this.handleOk.bind(this)}
					onCancel={this.handleCancel.bind(this)}>
					<Form className="book_search_form" {...formItemLayout} onSubmit={this.handleSubmit}>
						<FormItem
							label="校区名称">
							{getFieldDecorator('name', {
								rules: [{
									required: true,
									message: '请输入',
								}],
							})(
								<Input placeholder="请输入校区名称" />
							)}
						</FormItem>
						<FormItem
							label="权重">
							{getFieldDecorator('sort', {
								rules: [{
									required: true,
									message: '请输入',
								}],
							})(
								<Input type="number" placeholder="请输入权重, 权重越高, 排名越靠前" />
							)}
						</FormItem>
						<Row className='campus_container'>
							<Col span={4} className='campus_container_label'>楼号录入：</Col>
							<Col span={20}>
								<Col span={20} id="campus_tree" className="ztree"></Col>
								<Col span={2} className="campus_tree_icon">
									<Icon onClick={this.addCampus.bind(this)} type="plus-circle" />
									{/* <Button type='primary' onClick={this.addCampus.bind(this)}>添加楼号</Button> */}
								</Col>
							</Col>
						</Row>
					</Form>
				</Modal>
			</div>
		);
	}
}

const AddDialogForm = Form.create()(AddDialog);
export default AddDialogForm;
