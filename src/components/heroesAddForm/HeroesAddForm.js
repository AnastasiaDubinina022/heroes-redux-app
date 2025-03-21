import { useState } from "react";
import { useDispatch } from "react-redux";

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
        .then(resp => console.log(resp))
        .catch(error => console.error(error))
     
        dispatch(addHero(newHero));

        setFormData({
            name: '',
            description: '',
            element: ''
        })
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
                    <option >Я владею элементом...</option>
                    <option value="fire">Огонь</option>
                    <option value="water">Вода</option>
                    <option value="wind">Ветер</option>
                    <option value="earth">Земля</option>
                </select>
            </div>

            <button 
            type="submit" className="btn btn-primary">Создать</button>
        </form>
    )
}

export default HeroesAddForm;