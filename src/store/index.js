import { createStore, combineReducers, compose } from 'redux';
import heroes from '../reducers/heroes';
import filters from '../reducers/filters';

const enhancer = (createStore) => (...args) => {   // создаем функцию-enhancer, которая возвращает др. функцию принимающую какие-то аргументы
    const store = createStore(...args);            // создаем стор и модифицируем его:

    const originDispatch = store.dispatch;     // в эту переменную помещаем оригинальный диспэтч который принимал в себя только объект и находится в сторе

    store.dispatch = (action) => {             // далее перезаписываем диспэтч стора помещаем в него новую функцию которая уже делает что-то свое
        if (typeof action ===  'string') {     // если в экшн приходит строка
            return originDispatch({            // то вызываем оригинальный диспэтч и в него передаем объект который формируем вручную
                type: action
            })
        }
        return originDispatch(action);      // а если приходит не строка, то просто возвращаем вызов оригинального диспэтча и в него помещаем экшн (т.к. если это не строка то вероятно это объект - базовый случай)
    }

    return store;     // и возвращаем наш новый стор который попадет в главную переменную store ниже
}

const store = createStore(
                    combineReducers({heroes, filters}),    // сокращенная запись {heroes: heroes, filters: filters}
                    compose(         // спец функция редакса для композии, передает в стор аргументы по порядку
                        enhancer,    // сначала enhancers, если будет еще enhancer то он следйющий, а потом уже девтулз, порядок важен
                        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
                    )   
);   // если в стор вторым аргументом передается функция то она является усилителем 

export default store;