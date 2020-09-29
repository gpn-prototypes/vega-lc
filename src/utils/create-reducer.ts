const defaultStrategy = (state: any) => state;

function createReducer(strategyMap: any, initialState: any) {
  return (state = initialState, action: any): any =>
    strategyMap[action.type] !== undefined
      ? strategyMap[action.type](state, action)
      : defaultStrategy(state);
}

export default createReducer;
