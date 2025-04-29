import {useHttp} from '../../hooks/http.hook';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { createSelector } from 'reselect';

// import { fetchHeroes } from '../../actions';
import { deleteHero, fetchHeroes, filteredHeroesSelector } from './heroesSlice';
import HeroesListItem from "../heroesListItem/HeroesListItem";
import Spinner from '../spinner/Spinner';

// Задача для этого компонента:
// При клике на "крестик" идет удаление персонажа из общего состояния
// Усложненная задача:
// Удаление идет и с json файла при помощи метода DELETE (доки json server )

const HeroesList = () => {

    // const filteredHeroes = useSelector(state => {    // можно сразу формировать нужные нам данные на основании глобального стейта
    //     if (state.filters.activeFilter === 'all') {  // но такой вариант кода не очень приветствуется, т.к. будет срабатываь при любом триггере, даже при повторном нажатии на один и тот же фильтр
    //         console.log('render')                    // эту проблему решает библиотека reselect (например)
    //         return state.heroes.heroes;              // !!! или вытаскивать каждое поле из стейта отдельным useSelector
    //     } else {
    //         return state.heroes.heroes.filter(item => item.element === state.filters.activeFilter);
    //     }
    // })

    // это мемоизрованная функция-селектор которая получает кусочек стэйта (библ reselect)
    // const filteredHeroesSelector = createSelector(     
    //     (state) => state.filters.activeFilter,    // мем. значение 1     
    //     (state) => state.heroes.heroes,           // мем. значение 2 и т.д.
    //     (filter, heroes) => {                     // (значение 1, значение 2) => {то-то с ними сделать и получить общее мем. значение - filteredHeroesSelector}
    //         if (filter === 'all') {  
    //             console.log('render')                  
    //             return heroes;
    //         } else {
    //             return heroes.filter(item => item.element === filter);
    //         }
    //     }
    // )
    // const filteredHeroes = useSelector(filteredHeroesSelector);  

    const filteredHeroes = useSelector(filteredHeroesSelector);  // получаем отфильтрованный массив героев из стора (через селектор адаптера)
    // const heroes = useSelector(selectAll);   // получаем массив c объектами героев из стора (через селектор)      
    // const activeFilter = useSelector(state => state.filters.activeFilter)
    const heroesLoadingStatus = useSelector(state => state.heroes.heroesLoadingStatus);
    const dispatch = useDispatch();
    const {request} = useHttp();

    // был вариант с фильтрацией в самом компоненте 
    // const filteredHeroes = heroes.filter((hero) => {     
    //     if (activeFilter === 'all') {
    //         return heroes;
    //     }
    //     return hero.element === activeFilter;
    // })        

    useEffect(() => {
        dispatch(fetchHeroes());             
        // dispatch(fetchHeroes(request));    // вызываем экшн креатор и передаем туда request (было до RTK createAsyncThunk)

        // все эти действия теперь происходят в экшен креаторе
        // dispatch(heroesFetching());           // устанавливаем состояние загрузки
        // dispatch('HEROES_FETCHING');          // здесь передаем строку чтобы разобрать работу enhancers/middleware
        // dispatch(heroesFetching);                // передаем экшн без вызова просто как функцию, чтобы сработал ReduxThunk 
        // request("http://localhost:3001/heroes")  // на 3001 порту запускается localhost и делаем запрос к героям
        //     .then(data => dispatch(heroesFetched(data)))  // диспэтчим новое действие на статус получено и передаем туда полученные данные
        //     .catch(() => dispatch(heroesFetchingError())) // если ошибка меняем статус на ошибкус

        // eslint-disable-next-line
    }, []);

    const onDeleteHero = useCallback((id) => {        // useCallback т.к. передаем метод в дочерний компонент чтобы избежать его лишних перерендеров
        request(`http://localhost:3001/heroes/${id}`, 'DELETE')
        .then(data => console.log(data, 'deleted'))   // если запрос прошел успешно (необязательная строка) 
        .then(() => dispatch(deleteHero(id)))         // передаем dispatch на удаление героя из стейта 
        .catch(error => console.error(error))
    }, [request])

    if (heroesLoadingStatus === "loading") {
        return <Spinner/>;
    } else if (heroesLoadingStatus === "error") {
        return <h5 className="text-center mt-5">Ошибка загрузки</h5>
    }

    const renderHeroesList = (arr) => {
        if (arr.length === 0) {
            return <h5 className="text-center mt-5">Героев пока нет</h5>
        }

        // const filteredHeroes = arr.filter((hero) => {     // мое решение дз с фильтрацией было таким

        //     if (activeFilter === 'all') {
        //         return arr;
        //     }

        //     return hero.element === activeFilter;
        // })
        
        // return filteredHeroes.map(({id, ...props}) => {  ...... и т.д.

        return arr.map(({id, ...props}) => {
            return <HeroesListItem 
                    key={id} 
                    deleteHero={() => onDeleteHero(id)}
                    {...props}/>
        })
    }

    const elements = renderHeroesList(filteredHeroes);

    return (
        <ul>
            {elements}
        </ul>
    )
}

export default HeroesList;