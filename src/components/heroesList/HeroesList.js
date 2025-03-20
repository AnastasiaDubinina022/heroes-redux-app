import {useHttp} from '../../hooks/http.hook';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { heroesFetching, heroesFetched, heroesFetchingError, deleteHero } from '../../actions';
import HeroesListItem from "../heroesListItem/HeroesListItem";
import Spinner from '../spinner/Spinner';

// Задача для этого компонента:
// При клике на "крестик" идет удаление персонажа из общего состояния
// Усложненная задача:
// Удаление идет и с json файла при помощи метода DELETE (доки json server )

const HeroesList = () => {
    const heroes = useSelector(state => state.heroes);
    const heroesLoadingStatus = useSelector(state => state.heroesLoadingStatus);
    const dispatch = useDispatch();
    const {request} = useHttp();

    useEffect(() => {
        dispatch(heroesFetching());              // устанавливаем состояние загрузки
        request("http://localhost:3001/heroes")  // на 3001 порту запускается localhost и делаем запрос к героям
            .then(data => dispatch(heroesFetched(data)))  // диспэтчим новое действие на статус получено и передаем туда полученные данные
            .catch(() => dispatch(heroesFetchingError())) // если ошибка меняем статус на ошибкус

        // eslint-disable-next-line
    }, []);

    const onDeleteHero = async (id) => {
        try {
            const response = await fetch(`http://localhost:3001/heroes/${id}`, {method: 'DELETE'})  // удаляем героя из базы сервера

            if (!response.ok) {
                throw new Error(`Ошибка при удалении героя: ${response.status}`);
            }

            dispatch(deleteHero(id));   // передаем dispatch на удаление героя из стейта 
        } catch (error) {
            console.error('Ошибка при удалении героя', error)
        }
    }

    if (heroesLoadingStatus === "loading") {
        return <Spinner/>;
    } else if (heroesLoadingStatus === "error") {
        return <h5 className="text-center mt-5">Ошибка загрузки</h5>
    }

    const renderHeroesList = (arr) => {
        if (arr.length === 0) {
            return <h5 className="text-center mt-5">Героев пока нет</h5>
        }
        

        return arr.map(({id, ...props}) => {
            return <HeroesListItem 
                    key={id} 
                    deleteHero={() => onDeleteHero(id)}
                    {...props}/>
        })
    }

    const elements = renderHeroesList(heroes);
    return (
        <ul>
            {elements}
        </ul>
    )
}

export default HeroesList;