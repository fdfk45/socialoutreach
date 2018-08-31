import Vuex from "vuex";
import axios from '~/plugins/axios';

const createstore = () => {

    return new Vuex.Store({
        state: {
            auth: false,
            userInfo: null
        },
        mutations: {
            changeAuth(state, payload) {
                state.auth = payload.isAuth
                state.userInfo = payload.userInfo
            }
        },
        actions: {
            nuxtServerInit({
                commit
            }, {
                req
            }) {
                if (req.session.token !== undefined) {
                    return axios.post('/isAuth', {
                        token: req.session.token
                    }).then(function (res) {
                        console.log(res.data)
                        if (res.data.success === true) {
                            commit("changeAuth", {
                                isAuth: true,
                                userInfo: res.data.response
                            });
                        } else {
                            commit("changeAuth", {
                                isAuth: false,
                                userInfo: res.data.response
                            });
                        }
                    }).catch(err => {
                        console.log(err.message);
                    })

                } else {
                    commit("changeAuth", {
                        isAuth: false,
                        userInfo: null
                    });
                }
                console.log("sessions", req.session.token);
            }
        }
    })
}

export default createstore
