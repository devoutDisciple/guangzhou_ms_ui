import TestStore from './test/TestStore';
import GlobalStore from './global/GlobalStore';
import CampusStore from './campus/CampusStore';
import SwiperStore from './swiper/SwiperStore';

export const createStore = () => {
	return {
		TestStore,
		GlobalStore,
		CampusStore,
		SwiperStore,
	};
};
