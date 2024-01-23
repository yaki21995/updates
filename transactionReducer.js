case "ADD_TRANSACTION_SUCCESS":
    return {
    ...state,
    transactions: [...state.transactions, action.payload],
    loading: false,
    error: null,
    };
case "ADD_TRANSACTION_ERROR":
    return {
    ...state,
    loading: false,
    error: action.payload,
    };