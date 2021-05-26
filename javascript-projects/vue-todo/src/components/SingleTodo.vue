<template>
  <div class="todo" @click="done = !done">
    {{ text }}
    <span class="done" :class="{ completed: done }">
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
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  props: ["text", "id", "done"],
  data() {
    return {};
  },
  methods: {
    ...mapActions(["addTodo"]),
    newTodo() {}
  }
};
</script>

<style>
.todo {
  padding: 1rem;
  box-shadow: 0 0 1rem rgba(0, 0, 0, 0.25);
  border-radius: 50px;
  background: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.4s ease-in-out;
}

.done {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
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

.completed {
  background: #35d7b1;
  box-shadow: 0 5px 1rem rgba(0, 0, 0, 0.05);
}
</style>