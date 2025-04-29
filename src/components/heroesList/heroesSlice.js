import { createSlice, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";
import { createSelector } from 'reselect';
import { useHttp } from "../../hooks/http.hook";   

const heroesAdapter = createEntityAdapter();   // создаем адаптер для работы с сущностями (в данном случае с героями) - он позволяет нам работать с массивами в редьюсере как с объектами, а так же использовать селекторы для получения данных из стора
                                               // может принимать в себя объект с колбэками (методами типа выбрать айди или сортироваки) в документации
// const initialState = {
//     heroes: [],
//     heroesLoadingStatus: 'idle'  
// }

const initialState = heroesAdapter.getInitialState({
    heroesLoadingStatus: 'idle'   // добавляем нужное св-во в начальное состояние
});            // получаем начальное состояние из адаптера 

// console.log(initialState);        // {ids: Array(0), entities: {…}, heroesLoadingStatus: 'idle'}

export const fetchHeroes = createAsyncThunk(
    'heroes/fetchHeroes',         // type (имя экшена)
    async () => {                 // payload creator - функция которая будет возвращать промис. у неё в совю очередь 1й аргумент то что передается в экшен при диспатче, а второй это АПИ самого tunkа (в доках, редко используются)
        const {request} = useHttp();   
        return await request("http://localhost:3001/heroes");  // здесь вернется промис, а данные которые из него получим пойдут в payload
    }
)   // возвращает нам 3 экшена: pending, fulfilled, rejected (в зависимости от того как отработает промис, как его состояния)
    // внутри неё не работают мемоизированные функции (пришлось убрать useCallback из http.hook.js)

const heroesSlice = createSlice({
    name: 'heroes',  // имя слайса (пространство имен создаваемых экшенов)
    initialState,
    reducers: {
        // здесь так же можно писать мутабельные конструкции блaгодаря ImmerJS
        addHero: (state, action) => {
            // state.heroes.push(action.payload);
            heroesAdapter.addOne(state, action.payload)  // добавляем 1 сущность (нового героя) в массив героев (action.payload - это объект с новым героем)
        },
        deleteHero: (state, action) => {
            // state.heroes = state.heroes.filter(hero => hero.id !== action.payload);
            heroesAdapter.removeOne(state, action.payload)  // удаляем 1 сущность (героя) из массива героев, айди героя приходит автоматически в action.payload
        }
    }, 
    extraReducers: (builder) => {
        builder                                                                               // здесь происходит обработка экшенов которые возвращает createAsyncThunk
            .addCase(fetchHeroes.pending, state => {state.heroesLoadingStatus = 'loading'})   // pending - когда промис в ожидании
            .addCase(fetchHeroes.fulfilled, (state, action) => {                              // fulfilled - когда промис отработал успешно
                // state.heroes = action.payload;
                heroesAdapter.setAll(state, action.payload) // когда отработает запрос полученные данные action.payload записываем в state.heroes (эта команда все имеющиеся данные возьмет и заменит на новые полученные с сервера)
                state.heroesLoadingStatus = 'idle';
            })
            .addCase(fetchHeroes.rejected, state => {state.heroesLoadingStatus = 'error'})    // rejected - когда промис отработал с ошибкой
            .addDefaultCase(() => {})
        }

    
})    // когда эта функция отработает она вернет нам 3 сущности: имя, объект с экшенами и редьюсер 

const {actions, reducer} = heroesSlice;   // деструктурируем actions и reducer из heroesSlice

export default reducer;   // экспортируем редюсер (поместим его в создание стора)

const {selectAll} = heroesAdapter.getSelectors(state => state.heroes);   // получаем селектор selectAll из адаптера (привязываем его только к стейту с массиовм героев) и экспортируем их

// это мемоизрованная функция-селектор которая получает кусочек стэйта (библ reselect)
// массив отфильтрованных героев теперь можно использовать в разных частях приложения, хорошо когда компоненты использующие отделены от логики и запросов
export const filteredHeroesSelector = createSelector(     
    (state) => state.filters.activeFilter,    // мем. значение 1     
    // (state) => state.heroes.heroes,           // мем. значение 2 и т.д.
    selectAll,                                   // мем. значение 2 и т.д. - теперь используем селектор из адаптера и стейт с него придет автоматически потому что createSeector его получает автоматически
    (filter, heroes) => {                     // (значение 1, значение 2) => {то-то с ними сделать и получить общее мем. значение - filteredHeroesSelector}
        if (filter === 'all') {  
            console.log('render')                  
            return heroes;
        } else {
            return heroes.filter(item => item.element === filter);
        }
    }
)

export const {
    heroesFetching, 
    heroesFetched, 
    heroesFetchingError, 
    addHero, 
    deleteHero
} = actions;   // экспортируем экшены


// *** если нам нужно в экшенах что-то сделать для формирования данных в пейлоад, то нужно использовать спец функцию, примео из документации:
// const todosSlice = createSlice({
//   name: 'todos',
//   initialState: [] as Item[],
//   reducers: {
//     addTodo: {                                               // создаем экшен в форме объекта где:
//       reducer: (state, action: PayloadAction<Item>) => {     // первое св-во это действия которые нужно совершить
//         state.push(action.payload)
//       },
//       prepare: (text: string) => {                           // а второе - это функция для подготовки данных, которая вернет нам готовый payload
//         const id = nanoid()
//         return { payload: { id, text } }
//       },
//     },
//   },
// })