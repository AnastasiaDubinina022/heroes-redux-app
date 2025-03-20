const initialState = {
    heroes: [],
    heroesLoadingStatus: 'idle',  // бездействие, ожидание действия 
    filters: [],
    formData: {
        // name: '',
        // text: '', 
        // element: ''
    }
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'HEROES_FETCHING':
            return {
                ...state,
                heroesLoadingStatus: 'loading'
            }
        case 'HEROES_FETCHED':
            return {
                ...state,
                heroes: action.payload,
                heroesLoadingStatus: 'idle'
            }
        case 'HEROES_FETCHING_ERROR':
            return {
                ...state,
                heroesLoadingStatus: 'error'
            }
        case 'DELETE_HERO':
            return {
                ...state,
                heroes: state.heroes.filter(hero => hero.id !== action.payload)
            }
        case 'UPDATE_FORM_FIELD':
            return {
                ...state,
                formData: {
                    ...state.formData,   // Копируем старый объект formData
                    [action.payload.name]: action.payload.value // Обновляем только одно поле
                }
            }
        default: return state
    }
}

export default reducer;