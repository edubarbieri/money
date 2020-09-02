import { call } from "services/Api"

export const setItauPreview = (data) => {
	return {
		type: 'SET_ITAU_PREVIEW',
		payload: call('import.itau.preview', data)
	}
}

export const setImportItau = (data) => {
	return {
		type: 'SET_ITAU_IMPORT',
		payload: call('import.itau.save', data)
	}
}

export const setChangeItauPreview = (data) => {
	return {
		type: 'SET_CHANGE_ITAU_PREVIEW',
		payload: data
	}
}

export const setClearItauImport = () => {
	return {
		type: 'SET_CLEAR_ITAU_IMPORT',
		payload: null
	}
}
export const setClearItauPreview = () => {
	return {
		type: 'SET_CLEAR_ITAU_PREVIEW',
		payload: null
	}
}

