import { createSlice } from "@reduxjs/toolkit";
// import { heroesFetching } from "../../actions";

const initialState = {
    heroes: [],
    heroesLoadingStatus: 'idle'  
}

const heroesSlice = createSlice({
    name: 'heroes',  // имя слайса (пространство имен создаваемых экшенов)
    initialState,
    reducers: {
        // здесь так же можно писать мутабельные конструкции блмгодаря ImmerJS
        heroesFetching: state => {state.heroesLoadingStatus = 'loading'},   // здесь heroesFetching - это формирование экшен-креатора, а остальное - действия которые подвязываются под него - т.е. функция-редюсер, которая будет изменять стэйт в зависимости от экшена
        heroesFetched: (state, action) => {
            state.heroes = action.payload;
            state.heroesLoadingStatus = 'idle';
        },
        heroesFetchingError: state => {
            state.heroesLoadingStatus = 'error';
        },
        addHero: (state, action) => {
            state.heroes.push(action.payload);
        },
        deleteHero: (state, action) => {
            state.heroes = state.heroes.filter(hero => hero.id !== action.payload);
        }
    }
    // , extraReducers - объект содержащий редьюскры другого среза (может понадобиться в случае необходимости обновления объекта относящегося к дркгому срезу)

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