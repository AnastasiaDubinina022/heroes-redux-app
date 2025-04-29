import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import { useHttp } from '../../hooks/http.hook';

// import { filtersFetching } from '../../actions';

// const initialState = { 
//     filters: [],
//     filtersLoadingStatus: 'idle',   // бездействие, ожидание действия 
//     activeFilter: 'all'
// } 

const filtersAdapter = createEntityAdapter();

const initialState = filtersAdapter.getInitialState({
    filtersLoadingStatus: 'idle',
    activeFilter: 'all'
})
// console.log(initialState)  // {ids: Array(0), entities: {…}, filtersLoadingStatus: 'idle', activeFilter: 'all'}

export const fetchFilters = createAsyncThunk(
    'filters/fetchFilters',
    async () => {
        const {request} = useHttp();
        return await request("http://localhost:3001/filters");  // здесь вернется промис, а данные которые из него получим пойдут в payload
    }
)

const filtersSlice = createSlice({
    name: 'filters',  // имя слайса (пространство имен создаваемых экшенов)
    initialState,
    reducers: {
        setActiveFilter: (state, action) => {
            state.activeFilter = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFilters.pending, state => {state.filtersLoadingStatus = 'loading'})
            .addCase(fetchFilters.fulfilled, (state, action) => {
                // state.filters = action.payload;
                state.filtersLoadingStatus = 'idle';
                filtersAdapter.setAll(state, action.payload);  // когда отработает запрос полученные данные action.payload записываем в state.filters (эта команда все имеющиеся данные возьмет и заменит на новые полученные с сервера)
            })
            .addCase(fetchFilters.rejected, state => {state.filtersLoadingStatus = 'error'})
            .addDefaultCase(() => {})
    }
})

const {actions, reducer} = filtersSlice;   // деструктурируем actions и reducer из filtersSlice

export default reducer;   // экспортируем редюсер (поместим его в создание стора)

export const {selectAll} = filtersAdapter.getSelectors(state => state.filters);   // получаем селектор selectAll из адаптера (привязываем его только к стейту с массиовм фильтров) и экспортируем их

export const {
    filtersFetching, 
    filtersFetched, 
    filtersFetchingError, 
    setActiveFilter
} = actions;   // экспортируем экшены