import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useHttp } from "../../hooks/http.hook";   

const initialState = {
    heroes: [],
    heroesLoadingStatus: 'idle'  
}

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
            state.heroes.push(action.payload);
        },
        deleteHero: (state, action) => {
            state.heroes = state.heroes.filter(hero => hero.id !== action.payload);
        }
    }
    , extraReducers: (builder) => {
        builder                                                                               // здесь происходит обработка экшенов которые возвращает createAsyncThunk
            .addCase(fetchHeroes.pending, state => {state.heroesLoadingStatus = 'loading'})   // pending - когда промис в ожидании
            .addCase(fetchHeroes.fulfilled, (state, action) => {                              // fulfilled - когда промис отработал успешно
                state.heroes = action.payload;
                state.heroesLoadingStatus = 'idle';
            })
            .addCase(fetchHeroes.rejected, state => {state.heroesLoadingStatus = 'error'})    // rejected - когда промис отработал с ошибкой
            .addDefaultCase(() => {})
        }

    
})    // когда эта функция отработает она вернет нам 3 сущности: имя, объект с экшенами и редьюсер 

const {actions, reducer} = heroesSlice;   // деструктурируем actions и reducer из heroesSlice

export default reducer;   // экспортируем редюсер (поместим его в создание стора)
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