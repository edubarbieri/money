const INITIAL_STATE = {
	all: []
};


const addTreeOptionsToCategories = (categories) => {
    for (let index = 0; index < categories.length; index++) {
        const element = categories[index];
        element.title = element.name;
        element.value = element.id;
        element.expanded = true;
        if(element.children && element.children.length){
            addTreeOptionsToCategories(element.children);
        }
    }
}

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case 'SET_ALL_CATEGORIES':
			let categories = action.payload.data  || [];
			addTreeOptionsToCategories(categories);
			return {...state, all: categories};
		case 'SET_CHANGE_CATEGORIES':
			return {...state, all: action.payload};
		default:
			return state;
	}
};