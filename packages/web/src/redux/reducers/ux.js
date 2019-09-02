import types from '../uxActions';

const initialState = {
    showBillActions: true,
    showReceiptActions: true,
    showExtractActions: true,
}

export default function(state = initialState, action) {
  switch (action.type) {
    case types.SHOW_BILL_ACTIONS: {
      return {...state, showBillActions: action.payload};
    }
    case types.SHOW_RECEIPT_ACTIONS: {
      return {...state, showReceiptActions: action.payload};
    }
    case types.SHOW_EXTRACT_ACTIONS: {
      return {...state, showExtractActions: action.payload};
    }
    default:
      return state;
  }
}