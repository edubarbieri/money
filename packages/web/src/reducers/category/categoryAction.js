import { call } from "services/Api";

export const setChangeCategories = (data) => {
	return  {
		type: 'SET_CHANGE_CATEGORIES',
		payload: data
	};
}

export const fetchAllCategories = () => {
	return  {
		type: 'SET_ALL_CATEGORIES',
		payload: call('category.getAll')
	};
}

export const fetchCategoriesWithPath = () => {
	return  {
		type: 'SET_ALL_CATEGORIES_WITH_PATH',
		payload: call('category.getWithPath')
	};
}

export const saveCategory = (data) => {
	return dispatch => {
		const service = data.id ? 'category.update' : 'category.create';
        call(service, data, [data.id]).then(res => {
			dispatch(fetchAllCategories());
		})
    };
}

export const setParentCategory = (data) => {
	return dispatch => {
        call('category.setParent', {parentId: data.parentId}, [data.id]).then(res => {
			dispatch(fetchAllCategories());
		})
    };
}

export const setRemoveCategory = (data) => {
	return dispatch => {
        call('category.remove', {}, [data.id]).then(res => {
			dispatch(fetchAllCategories());
		})
    };
}
