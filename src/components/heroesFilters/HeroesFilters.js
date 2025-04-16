import {useEffect} from 'react' 
import { useSelector, useDispatch } from "react-redux";
import {useHttp} from '../../hooks/http.hook';
import {fetchFilters, setActiveFilter} from '../../actions/index';

import Spinner from '../spinner/Spinner';

// Задача для этого компонента:
// Фильтры должны формироваться на основании загруженных данных
// Фильтры должны отображать только нужных героев при выборе
// Активный фильтр имеет класс active
// Изменять json-файл для удобства МОЖНО!
// Представьте, что вы попросили бэкенд-разработчика об этом. не забывать перезапускать сервер после изменения json-файла

const HeroesFilters = () => {
    const filtersLoadingStatus = useSelector(state => state.filters.filtersLoadingStatus);
    const filters = useSelector(state => state.filters.filters);
    const activeFilter = useSelector(state => state.filters.activeFilter);
    const dispatch = useDispatch();
    const {request} = useHttp();

    useEffect(() => {
        dispatch(fetchFilters(request));    // вызываем экшн креатор и передаем туда request

        // все эти действия теперь происходят в экшен креаторе
        // dispatch(filtersFetching())     
        // request("http://localhost:3001/filters")
        // .then(data => dispatch(filtersFetched(data)))
        // .catch(() => dispatch(filtersFetchingError()))
    }, [])

    if (filtersLoadingStatus === 'loading') {
        return <Spinner/>
    } else if (filtersLoadingStatus === 'error') {
        return <h5 className="text-center mt-5">Ошибка загрузки</h5>
    } 

    const renderFilters = (arr) => {

        if (arr.lendgth === 0) {
            return <h5 className="text-center mt-5">Фильтры не найдены</h5>
        }

        return arr.map(({name, label, color}) => {
            const active = activeFilter === name;
            const clazz = active ? 'btn btn-light' : 'btn';
    
            return (
                <button 
                    type='button'
                    className={`${clazz} ${color}`}
                    key={name}
                    onClick={() => dispatch(setActiveFilter(name))}>
                    {label}
                </button>
            )
        })
    }

    const elements = renderFilters(filters);

    return (
        <div className="card shadow-lg mt-4">
            <div className="card-body">
                <p className="card-text">Отфильтруйте героев по элементам</p>
                <div className="btn-group">
                    {elements}
                </div>
            </div>
        </div>
    )
}

export default HeroesFilters;