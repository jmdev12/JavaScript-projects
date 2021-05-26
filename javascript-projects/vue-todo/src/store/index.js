import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)


export default new Vuex.Store({
    state: {
        todos: []
    },
    getters: {
        getTodos: state => state.todos
    },
    actions: {

        addTodo({ commit, state }, todo) {
            console.log(state.todos.length + 1)
            const newTodo = {
                id: state.todos.length + 1,
                title: todo,
                completed: false
            }
            commit('setTodo', newTodo);

        },

        removeTodo({ commit }, todo) {
            commit('deleteTodo', todo)
        },


        modifyTodo({ commit }, todo) {
            commit('updateTodo', todo)
        }

    },

    mutations: {
        setTodo(state, todo) {
            state.todos.push(todo);
        },
        updateTodo(state, todo) {
            const index = state.todos.findIndex(x => x.id == todo.id);
            state.todos.splice(index, 1, todo)
            console.log(state.todos)
        },
        deleteTodo(state, todo) {
            state.todos = state.todos.filter(x => x.id != todo.id)
        }
    }
})