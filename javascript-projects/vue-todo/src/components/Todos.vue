<template>
  <div class="todos-container">
    <div
      v-for="todo in getTodos"
      :key="todo.id"
      class="todo"
      :class="{ completed: todo.completed }"
      @click="changeTodo(todo)"
    >
      {{ todo.title }}
      <div class="controls">
        <span class="done">
          <svg
            width="47"
            height="37"
            viewBox="0 0 47 37"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M1.5 16.5L20 34L45 1" stroke="white" stroke-width="3" />
          </svg>
        </span>
        <div class="delete" @click="deleteTodo(todo, $event)">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line y1="8" x2="16" y2="8" stroke="#fff" stroke-width="2" />
            <line x1="8" y1="16" x2="8" stroke="#fff" stroke-width="2" />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  data() {
    return {
      dragSrcEl: "",
      isDragging: false
    };
  },
  computed: {
    ...mapGetters(["getTodos"])
  },
  methods: {
    ...mapActions(["modifyTodo", "removeTodo"]),

    // Update todo in app state
    changeTodo(todo) {
      const updatedTodo = {
        id: todo.id,
        title: todo.title,
        completed: !todo.completed
      };
      this.modifyTodo(updatedTodo);
    },

    deleteTodo(todo, e) {
      e.stopPropagation(); // Avoid event bubbling
      this.removeTodo(todo);
    }
  }
};
</script>

<style>
.todos-container {
  position: relative;
  overflow-y: auto;
}

.todos-container::after {
  content: "";
  position: sticky;
  display: block;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 200px;
  z-index: 10;
  background: rgb(255, 255, 255);
  background: -moz-linear-gradient(
    180deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 1) 100%
  );
  background: -webkit-linear-gradient(
    180deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 1) 100%
  );
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 1) 100%
  );
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#ffffff",endColorstr="#ffffff",GradientType=1);
}

.todo {
  padding: 1rem;
  box-shadow: 0 0 1rem rgba(0, 0, 0, 0.25);
  border-radius: 50px;
  background: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.4s ease-in-out;
  margin: 2rem 0;
}

.controls {
  display: flex;
  align-items: center;
}

.done {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  margin-right: 10px;
  border-radius: 50%;
  background: #fff;
  transition: all 0.4s ease-in-out;
  box-shadow: 0 5px 1rem rgba(0, 0, 0, 0.15);
}

.todo:hover {
  cursor: pointer;
  box-shadow: 0 5px 1rem rgba(0, 0, 0, 0.25);
}

.done svg {
  position: absolute;
  width: 20px;
}

.done:hover {
  cursor: pointer;
  box-shadow: 0 5px 1rem rgba(0, 0, 0, 0.45);
}

.todo.completed {
  text-decoration: line-through;
}

.todo.completed .done {
  background: #35d7b1;
  box-shadow: 0 5px 1rem rgba(0, 0, 0, 0.05);
}
.todos-container {
  width: 90%;
}
.delete {
  position: relative;
  border-radius: 50%;
  background: #b40000;
  right: 0;
  width: 43px;
  height: 43px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}
.delete svg {
  transition: all 0.4s ease-in-out;
  transform: rotate(45deg);
}
.delete:hover svg {
  transform: rotate(315deg);
}
.dragging {
  position: absolute;
  color: red;
}
@media screen and (max-width: 768px) {
  .todos-container {
    width: 100%;
  }
  .done {
    margin-right: 64px;
  }
  .delete {
    width: 36px;
    height: 36px;
    right: 42px;
    border-radius: 50%;
  }
}
</style>