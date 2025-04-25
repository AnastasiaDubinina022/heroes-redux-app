// import { createAction } from "@reduxjs/toolkit";
import {heroesFetched, heroesFetchingError, heroesFetching} from "../components/heroesList/heroesSlice"; // импортируем экшены из heroesSlice

export const fetchHeroes = (request) => (dispatch) => {   // создаем универсальный экшн креатор который будет получать данные и обрабатывать возможные состояния
                                                          // request передаем из компгонента, dispatch передается автоматически из redux-thunk
    dispatch(heroesFetching());                
    request("http://localhost:3001/heroes")  // на 3001 порту запускается localhost и делаем запрос к героям
        .then(data => dispatch(heroesFetched(data)))  // диспэтчим новое действие на статус получено и передаем туда полученные данные
        .catch(() => dispatch(heroesFetchingError())) // если ошибка меняем статус на ошибку
}

export const fetchFilters = (request) => (dispatch) => {   // универсчальный экшн креатор для получения данных фильтров (с помощью thunk)
    dispatch(filtersFetching());
    request("http://localhost:3001/filters")
    .then(data => dispatch(filtersFetched(data)))
    .catch(() => dispatch(filtersFetchingError()))
}

export const filtersFetching = () => {
    return {
        type: 'FILTERS_FETCHING'
    }
}

export const filtersFetched = (filters) => {
    return {
        type: 'FILTERS_FETCHED',
        payload: filters
    }
}

export const filtersFetchingError = () => {
    return {
        type: 'FILTERS_FETCHING_ERROR'
    }
}

export const setActiveFilter = (activeFilter) => {   
    return {
        type: 'SET_ACTIVE_FILTER',
        payload: activeFilter
    }
}

// пример создания обычного экшен-креатора (без использования createAction из redux-toolkit)
// export const heroesFetching = () => {
//     return {
//         type: 'HEROES_FETCHING'
//     }
// }
// export const heroesFetching = createAction('HEROES_FETCHING'); // эквивалентно вышеуказанному коду, но более лаконично


// пример эфемерной задачи срабатывания фильтров с задержкой
// export const setActiveFilter = (activeFilter) => (dispatch) => {   // при использоваии redux-thunk можно передавать в экшн функцию, которая автоматически принимает в себя dispatch
//     setTimeout(() => {                        // т.е. теперь мы возвращаем функцию которая через 1 сек будет вызывать dispatch (в этой функции может происходить все что угодно)
//         dispatch({
//             type: 'SET_ACTIVE_FILTER',
//             payload: activeFilter
//         })
//     }, 1000)
// }