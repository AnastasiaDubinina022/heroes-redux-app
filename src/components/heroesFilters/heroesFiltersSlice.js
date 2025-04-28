import { createSlice } from '@reduxjs/toolkit';
// import { filtersFetching } from '../../actions';

const initialState = { 
    filters: [],
    filtersLoadingStatus: 'idle',   // бездействие, ожидание действия 
    activeFilter: 'all'
}

const filtersSlice = createSlice({
    name: 'filters',  // имя слайса (пространство имен создаваемых экшенов)
    initialState,
    reducers: {
        filtersFetching: state => {state.filtersLoadingStatus = 'loading'},   // здесь filtersFetching - это формирование экшен-креатора, а остальное - действия которые подвязываются под него - т.е. функция-редюсер, которая будет изменять стэйт в зависимости от экшена
        filtersFetched: (state, action) => {
            state.filters = action.payload;
            state.filtersLoadingStatus = 'idle';
        },
        filtersFetchingError: (state) => {
            state.filtersLoadingStatus = 'error';
        },
        setActiveFilter: (state, action) => {
            state.activeFilter = action.payload;
        }
    }
})

const {actions, reducer} = filtersSlice;   // деструктурируем actions и reducer из filtersSlice

export default reducer;   // экспортируем редюсер (поместим его в создание стора)
export const {
    filtersFetching, 
    filtersFetched, 
    filtersFetchingError, 
    setActiveFilter
} = actions;   // экспортируем экшены