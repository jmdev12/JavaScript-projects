<template>
  <div id="app">
    <div class="wrapper">
      <h1 class="heading">Your tasks</h1>
      <transition name="fade">
        <todos v-if="getTodos.length"></todos>
      </transition>
      <transition name="fade">
        <div class="no-todos" v-if="!getTodos.length">
          <img src="./assets/empty.svg" alt />
          <h1>You have no active tasks</h1>
        </div>
      </transition>
      <add-todo></add-todo>
    </div>
  </div>
</template>

<script>
import Todos from "./components/Todos.vue";
import AddTodo from "./components/AddTodo.vue";
import { mapGetters } from "vuex";

export default {
  name: "App",
  components: {
    Todos,
    AddTodo
  },
  computed: {
    ...mapGetters(["getTodos"])
  }
};
</script>

<style>
#app {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgb(1, 112, 194);
  background: -moz-linear-gradient(
    122deg,
    rgba(1, 112, 194, 1) 0%,
    rgba(31, 160, 255, 1) 100%
  );
  background: -webkit-linear-gradient(122deg, #0170c2 0%, #1fa0ff 100%);
  background: linear-gradient(
    122deg,
    rgba(1, 112, 194, 1) 0%,
    rgba(31, 160, 255, 1) 100%
  );
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#0170c2",endColorstr="#1fa0ff",GradientType=1);
}

.wrapper {
  position: relative;
  background: #fff;
  height: 90%;
  width: 35%;
  border-radius: 20px;
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.no-todos {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.no-todos h1 {
  margin-top: 2em;
  text-align: center;
  font-size: 1.75rem;
  max-width: 80%;
}

.no-todos img {
  width: 60%;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

@media screen and (max-width: 1550px) {
  .wrapper {
    width: 45%;
  }
}
@media screen and (max-width: 1200px) {
  .wrapper {
    width: 55%;
  }
}
@media screen and (max-width: 996px) {
  .wrapper {
    width: 65%;
  }
}
@media screen and (max-width: 768px) {
  .wrapper {
    width: 75%;
  }
}
@media screen and (max-width: 576px) {
  .wrapper {
    width: 85%;
  }
  .no-todos img {
    width: 80%;
  }
}
</style>
