import {useEffect} from 'react' 
import { useSelector, useDispatch } from "react-redux";
import {useHttp} from '../../hooks/http.hook';
import {filtersFetching, filtersFetched, filtersFetchingError, setActiveFilter} from '../../actions/index';

import Spinner from '../spinner/Spinner';

// Задача для этого компонента:
// Фильтры должны формироваться на основании загруженных данных
// Фильтры должны отображать только нужных героев при выборе
// Активный фильтр имеет класс active
// Изменять json-файл для удобства МОЖНО!
// Представьте, что вы попросили бэкенд-разработчика об этом. не забывать перезапускать сервер после изменения json-файла

const HeroesFilters = () => {
    const filtersLoadingStatus = useSelector(state => state.filtersLoadingStatus);
    const filters = useSelector(state => state.filters);
    const activeFilter = useSelector(state => state.activeFilter);
    const dispatch = useDispatch();
    const {request} = useHttp();

    useEffect(() => {
        dispatch(filtersFetching())
        request("http://localhost:3001/filters")
        .then(data => dispatch(filtersFetched(data)))
        .catch(() => dispatch(filtersFetchingError()))
    }, [])

    const onFilterSelect = (name) => {
        dispatch(setActiveFilter(name))
    }

    if (filtersLoadingStatus === 'loading') {
        return <Spinner/>
    } else if (filtersLoadingStatus === 'error') {
        return <h5 className="text-center mt-5">Ошибка загрузки</h5>
    } 

    const buttons = filters.map(({name, label, color}) => {
        const active = activeFilter === name;
        const clazz = active ? 'btn btn-light' : 'btn';

        return (
            <button 
                type='button'
                className={`${clazz} ${color}`}
                key={name}
                onClick={() => onFilterSelect(name)}>
                {label}
            </button>
        )
    })

    return (
        <div className="card shadow-lg mt-4">
            <div className="card-body">
                <p className="card-text">Отфильтруйте героев по элементам</p>
                <div className="btn-group">
                    {buttons}
                </div>
            </div>
        </div>
    )
}

export default HeroesFilters;