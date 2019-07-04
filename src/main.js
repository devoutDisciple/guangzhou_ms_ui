import React from 'react';
import ReactDOM from 'react-dom';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import {LocaleProvider} from 'antd';
import {createStore} from './store/createStore';
import {Provider} from 'mobx-react';
import {configure} from 'mobx';
import Layout from './component/Layout/Layout';
import './style/common.css';
import './style/common.less';

const stores = createStore();
// 开启严格模式
configure({ enforceActions: 'always' });

const render = () => {
	ReactDOM.render(
		<Provider {...stores}>
			<LocaleProvider locale={zhCN}>
				<Layout />
			</LocaleProvider>
		</Provider>,
		document.getElementById('root')
	);
};
render();

