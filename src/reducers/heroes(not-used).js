import { createReducer } from "@reduxjs/toolkit"

import {
    heroesFetching,
    heroesFetched,
    heroesFetchingError,
    deleteHero,
    addHero
} from '../actions/index.js';

const initialState = {
    heroes: [],
    heroesLoadingStatus: 'idle'  // бездействие, ожидание действия 
}

const heroes = createReducer(initialState, (builder) => {   // builder - (авт.аргумент) - это объект который позволяет нам строить наш редьюсер при помощи 3х уже встроенных методов
    builder
        .addCase(heroesFetching, state => {         // ф-я ничего не возвращает, просто изменяет стэйт
            state.heroesLoadingStatus = 'loading';  // при использовании функции сreateReducer (и createSlice) здесь редакс тулкит автоматически активирует библиотеку immer, которая упрощает работу с иммутабельностью. теперь мы можем писать функционал по прямому изменению стэйта визуально, но библиотека внутри сделает все за наc чтобы не мутировать его напрямую.
        })                                          // ! если будет return или ф-я в 1 строку, то тулкит е будет подклчать immer js, поскольку подумает что мы возвращаем объект и уже сами позаботились о соблюдении иммутабельности
        .addCase(heroesFetched, (state, action) => {
            state.heroes = action.payload;
            state.heroesLoadingStatus = 'idle';
        })
        .addCase(heroesFetchingError, state => {
            state.heroesLoadingStatus = 'error';
        })
        .addCase(addHero, (state, action) => {
            state.heroes.push(action.payload);
        })
        .addCase(deleteHero, (state, action) => {
            state.heroes = state.heroes.filter(hero => hero.id !== action.payload);
        })
        .addDefaultCase(() => {})  // если не сработал ни один из экшенов, то ничего не делать

        // .addMatcher - еще 1 метод позволяющий фильтровать входящий экшен по определенному критерию (например по типу экшена) и выполнять действия только для него
})  


// создание редьюсера без тулкита
// const heroes = (state = initialState, action) => {
//     switch (action.type) {
//         case 'HEROES_FETCHING':
//             return {
//                 ...state,
//                 heroesLoadingStatus: 'loading'
//             }
//         case 'HEROES_FETCHED':
//             return {
//                 ...state,
//                 heroes: action.payload,
//                 heroesLoadingStatus: 'idle'
//             }
//         case 'HEROES_FETCHING_ERROR':
//             return {
//                 ...state,
//                 heroesLoadingStatus: 'error'
//             }
//         case 'DELETE_HERO':
//             return {
//                 ...state,
//                 heroes: state.heroes.filter(hero => hero.id !== action.payload)
//             }
//         case 'ADD_HERO':
//             return {
//                 ...state,
//                 heroes: [...state.heroes, action.payload]
//             }
//         default: return state
//     }
// }

export default heroes;