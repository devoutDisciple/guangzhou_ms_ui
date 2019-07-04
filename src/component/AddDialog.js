import React from 'react';
import PropTypes from 'prop-types';
import {
	Form, Input, Select, Spin, message, Modal
} from 'antd';
const { TextArea } = Input;
import AxiosRequest from '../request/AxiosRequest';
import config from '../config/config';
const baseUrl = config.baseUrl;
const { Option } = Select;
const FormItem = Form.Item;

class AddDialog extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			loading: false
		};
	}


	handleOk()  {
		let file = document.getElementById('upload').files;
		if(file.length == 0) return message.warning('请选择要上传的图片');
		this.props.form.validateFields((err, values) => {
			try {
				if (err) return;
				let formData = new FormData();
				formData.append('file', file[0]);
				formData.append('name', values.name);
				formData.append('price', values.price);
				formData.append('author', values.author);
				formData.append('borrow', values.borrow);
				formData.append('desc', values.desc);
				formData.append('type', values.type);
				this.setState({loading: true});
				AxiosRequest.post(baseUrl + '/book/list/create', formData).then(res => {
					this.setState({loading: false});
					if(res.success) {
						this.props.onCloseDialog();
						this.props.onSearch();
						return message.success('新增成功');
					}
					message.error('新增失败');
				});
			} catch (error) {
				console.log(error);
				this.setState({loading: false});
			}
		});
	}

	handleCancel() {
		this.props.onCloseDialog();
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
					title="新增书籍"
					visible={true}
					onOk={this.handleOk.bind(this)}
					onCancel={this.handleCancel.bind(this)}>
					<Spin spinning={this.state.loading}>
						<Form className="book_search_form" {...formItemLayout} onSubmit={this.handleSubmit}>
							<FormItem
								label="书籍名称">
								{getFieldDecorator('name', {
									rules: [{
										required: true,
										message: '请输入',
									}],
								})(
									<Input placeholder="请输入书籍名称" />
								)}
							</FormItem>
							<FormItem
								label="作者">
								{getFieldDecorator('author', {
									rules: [{
										required: true,
										message: '请输入',
									}],
								})(
									<Input placeholder="请输入书籍作者" />
								)}
							</FormItem>
							<FormItem
								label="所属类别">
								{getFieldDecorator('type', {
									rules: [{
										required: true,
										message: '请选择',
									}],
								})(
									<Select placeholder="请选择">
										<Option value="1">外国小说</Option>
										<Option value="2">中国小说</Option>
										<Option value="3">文学</Option>
										<Option value="4">艺术</Option>
										<Option value="5">经管</Option>
										<Option value="6">历史</Option>
										<Option value="7">人生哲理</Option>
										<Option value="8">其他</Option>
									</Select>
								)}
							</FormItem>
							<FormItem
								label="状态">
								{getFieldDecorator('borrow', {
									rules: [{
										required: true,
										message: '请选择',
									}],
								})(
									<Select placeholder="请选择">
										<Option value="1">借出</Option>
										<Option value="0">未借出</Option>
									</Select>
								)}
							</FormItem>
							<FormItem
								label="金额">
								{getFieldDecorator('price', {
									rules: [{
										required: true,
										message: '请输入',
									}],
								})(
									<Input placeholder="请输入金额" />
								)}
							</FormItem>
							<FormItem
								label="书籍描述">
								{getFieldDecorator('desc', {
									rules: [{
										required: true,
										message: '请输入',
									}],
								})(
									<TextArea placeholder="请输入书籍描述" autosize={{ minRows: 2, maxRows: 6 }} />
								)}
							</FormItem>
							<Form.Item
								label="书籍图片">
								<input id="upload" type="file" accept="image/png,image/gif" name="file" />
							</Form.Item>
						</Form>
					</Spin>

				</Modal>
			</div>
		);
	}
}

AddDialog.propTypes = {
	onCloseDialog: PropTypes.func.isRequired,
	form: PropTypes.object.isRequired,
	getFieldDecorator: PropTypes.any,
	onSearch: PropTypes.any,
};

const AddDialogForm = Form.create()(AddDialog);
export default AddDialogForm;
