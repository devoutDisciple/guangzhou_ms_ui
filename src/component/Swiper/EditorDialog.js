import React from 'react';
import {
	Form, Input, Modal
} from 'antd';
// import Request from '../../request/AxiosRequest';
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
				console.log(values);
				// if(result.data == 'success') {
				// 	message.success('新增成功');
				// 	this.props.onSearch();
				// 	return this.props.controllerAddDialog();
				// }
			} catch (error) {
				console.log(error);
			}
		});
	}

	handleCancel() {
		this.props.controllerEditorDialog();
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
					title="编辑"
					visible={true}
					onOk={this.handleOk.bind(this)}
					onCancel={this.handleCancel.bind(this)}>
					<Form className="book_search_form" {...formItemLayout}>
						<FormItem
							label="关联店铺">
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
							label="图片">
							{getFieldDecorator('url', {
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
					</Form>
				</Modal>
			</div>
		);
	}
}

const AddDialogForm = Form.create()(AddDialog);
export default AddDialogForm;
