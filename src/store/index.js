// import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
// import {thunk} from 'redux-thunk';
import { configureStore } from '@reduxjs/toolkit'; 
import heroes from '../reducers/heroes';
import filters from '../reducers/filters';

const stringMiddleware = () => (next) => (action) => {   // создаем функцию middleware которая авт. принимает в себя store, возвращает ф-ю авт. подхватывающую dispatch (next) и возвращает конечную ф-ю авт. принимающую в себя action - это по сути и есть наш новый функционал dispatch
                      // () === (store) === ({dispatch, getState}) - содержит в себе не весь стор, а только эти 2 сущности. getState для того, если нужно будет получить кусочек стэйта и что-то с нми сделать
                      // next === (dispatch), так называется поскольку это след. функция в цепочке, которая будет вызвана после того как сработает наш middleware
    if (typeof action ===  'string') {     // если в экшн приходит строка 
        return next({                      // то вызываем диспэтч (next) и в него передаем объект 
            type: action                   // в котором эта строка теперь выступает полем объекта
        })
    }
    return next(action);      // а если приходит обычный объект (не строка) то просто запускаем диспэтч (next) с объектом
};

const store = configureStore({
    reducer: {heroes, filters},    // сокращенная запись {heroes: heroes, filters: filters}
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(stringMiddleware),    // подключаем дефолтные middlewares  и наш собственный (в тулките уже включены несколько самых распространенных мидлвэйров как thunk и т.д.)
    devTools: process.env.NODE_ENV !== 'production',    // включаем девтулз только в режиме разработки

})

export default store;

// const enhancer = (createStore) => (...args) => {   // создаем функцию-enhancer, которая авт. принимает createStore и возвращает др. функцию принимающую какие-то аргументы
//     const store = createStore(...args);            // создаем стор и модифицируем его:

//     const originDispatch = store.dispatch;     // в эту переменную помещаем оригинальный диспэтч который принимал в себя только объект и находится в сторе

//     store.dispatch = (action) => {             // далее перезаписываем диспэтч стора помещаем в него новую функцию которая уже делает что-то свое
//         if (typeof action ===  'string') {     // если в экшн приходит строка
//             return originDispatch({            // то вызываем оригинальный диспэтч и в него передаем объект который формируем вручную
//                 type: action
//             })
//         }
//         return originDispatch(action);      // а если приходит не строка, то просто возвращаем вызов оригинального диспэтча и в него помещаем экшн (т.к. если это не строка то вероятно это объект - базовый случай)
//     }

//     return store;     // и возвращаем наш новый стор который попадет в главную переменную store ниже
// }


// const store = createStore(
//                     combineReducers({heroes, filters}),    // сокращенная запись {heroes: heroes, filters: filters}
//                     compose(
//                         applyMiddleware(thunk, stringMiddleware),    // подключаем наш middleware, она принимает в себя аргументами список наших middlewares: applyMiddleware(...middlewares)
//                         window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
//                     )

       
                    // -- // -- //
                    // compose(         // спец функция редакса для композии, передает в стор аргументы по порядку
                    //     enhancer,    // сначала enhancers, если будет еще enhancer то он следйющий, а потом уже девтулз, порядок важен
                    //     window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
                    // )   
// );   // если в стор вторым аргументом передается функция то она является усилителем 
