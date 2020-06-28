const iState = {
    name:"admin",
    manager_id:0,
  };
  
 const reducer = (state = iState,action) => {
     console.log('action',action)
    if(action.type === 'CHANGE_NAME') {
        return {
            ...state,
            name:action.payload
        }
    }
    if(action.type === 'CHANGE_MANAGERID') {
        return {
            ...state,
            manager_id:action.payload
        }
    }

    return state; 
    
 }
  
export default reducer;