import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { useHttp } from "../../hooks/http.hook";
import { addHero} from '../../actions/index';


// Задача для этого компонента:
// Реализовать создание нового героя с введенными данными. Он должен попадать
// в общее состояние и отображаться в списке + фильтроваться
// Уникальный идентификатор персонажа можно сгенерировать через uiid
// Усложненная задача:
// Персонаж создается и в файле json при помощи метода POST
// Дополнительно:
// Элементы <option></option> желательно сформировать на базе
// данных из фильтров

const HeroesAddForm = () => {
    const [formData, setFormData] = useState( {
        name: '',
        description: '',
        element: ''
      })

    const dispatch = useDispatch();
    const {request} = useHttp();
    const filters = useSelector(state => state.filters.filters)   // в стейте теперь разделение на св-ва filters и heroes, поэтому такое обращение теперь
    const filtersLoadingStatus = useSelector(state => state.filters.filtersLoadingStatus)

    const updateFormData = (e) => {
        const {name, value} = e.target;

        setFormData({
            ...formData,
            [name]: value   //  - [] указывают что используем переменную, а не строку name
        })
    }

    const onSubmitAddHero = async (e) => {
        e.preventDefault();

        const newHero =  {
            id: Date.now(),
            ...formData
        }

        await request("http://localhost:3001/heroes", 'POST', JSON.stringify(newHero))
        .then(resp => console.log(resp, 'Отправка успешна'))
        .then(dispatch(addHero(newHero)))    // если отправка на сервер успешна диспатчим героя в стор
        .catch(error => console.error(error))

        setFormData({    // очистка формы после отправки
            name: '',
            description: '',
            element: ''
        })
   }

   const renderOptions = (filters, status) => {

        if (status === 'loading') {
            return <option>Загрузка элементов</option>
        } else if (status === 'error') {
            return <option>Ошибка загрузки</option>
        }

        if (filters && filters.length > 0) {

            return filters.map(({name, label}) => {

                if (name === 'all') {
                    return <option key={name}>Я владею элементом...</option>
                }
                return <option key={name} value={name}>{label}</option>
            })
        }  
    }

    return (
        <form onSubmit={onSubmitAddHero} className="border p-4 shadow-lg rounded">
            <div className="mb-3">
                <label htmlFor="name" className="form-label fs-4">Имя нового героя</label>
                <input 
                    required
                    type="text" 
                    name="name" 
                    className="form-control" 
                    id="name" 
                    placeholder="Как меня зовут?"
                    value={formData.name}
                    onChange={updateFormData}/>
            </div>

            <div className="mb-3">
                <label htmlFor="description" className="form-label fs-4">Описание</label>
                <textarea
                    required
                    name="description" 
                    className="form-control" 
                    id="description" 
                    placeholder="Что я умею?"
                    style={{"height": '130px'}}
                    value={formData.description}
                    onChange={updateFormData}/>
            </div>

            <div className="mb-3">
                <label htmlFor="element" className="form-label">Выбрать элемент героя</label>
                <select 
                    required
                    className="form-select" 
                    id="element" 
                    name="element"
                    value={formData.element}
                    onChange={updateFormData}>
                    {renderOptions(filters, filtersLoadingStatus)}
                </select>
            </div>

            <button 
            type="submit" className="btn btn-primary">Создать</button>
        </form>
    )
}

export default HeroesAddForm;