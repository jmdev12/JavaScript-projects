import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)


export default new Vuex.Store({
    state: {
        link: String()
    },

    getters: {
        getLink: state => state.link
    },

    actions: {
        async getLink({ commit }, link) {

            // Set headers with API key
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer 5b8c5bacf8c5ff7abb76e289084a4593754a5a6f'
                }
            }

            // Send data to API
            const data = JSON.stringify({
                "long_url": link
            });

            // Call to API and save data to state
            await axios.post("https://api-ssl.bitly.com/v4/shorten", data, config)
                .then(res => {
                    commit("setLink", res.data.link);
                })
        },
    },

    mutations: {
        setLink: (state, link) => (state.link = link),
    }

})