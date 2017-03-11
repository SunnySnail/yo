/***
 *** this is for component's state action getters mutations
 *** you can start like this:

import api from '../../api/example';
import * as types from '../mutation-types';

const state = {
    temp: {}
}

const getters = {
    temp: state => state.temp
}

const actions = {
    methodName({ commit, state }, moduleId) {
        return new Promise((resolve, reject) => {
            api.methodName(moduleId)
            .done(
                (jsonData) => {
                    var temp = jsonData.data;
                    commit(types.GET_TEMP, { temp });
                    resolve();
                }
            )
            .fail(() => {
                reject();
            })
        });
    }
}

const mutations = {
    [types.GET_TEMP (state, { temp }) {
        state.temp = temp;
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}

***/