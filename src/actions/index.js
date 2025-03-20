export const heroesFetching = () => {
    return {
        type: 'HEROES_FETCHING'
    }
}

export const heroesFetched = (heroes) => {
    return {
        type: 'HEROES_FETCHED',
        payload: heroes
    }
}

export const heroesFetchingError = () => {
    return {
        type: 'HEROES_FETCHING_ERROR'
    }
}

export const deleteHero = (id) => {
    return {
        type: 'DELETE_HERO',
        payload: id
    }
}

export const updateFormField = (name, value) => {
    return {
        type: 'UPDATE_FORM_FIELD',
        payload: {name, value}
    }
}

export const addHero = () => {
    return {
        type: 'ADD_HERO'

    }
}