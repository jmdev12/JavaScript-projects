<template>
  <div class="add-wrapper">
    <div class="add-container" :class="{active: formVisible}">
      <div class="close" @click="formVisible = false">
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
      <input type="text" v-model="title" name="title" />
      <button @click="newTodo()">Add new task!</button>
      <svg
        class="arrow"
        width="25"
        height="23"
        viewBox="0 0 25 23"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filter0_d)">
          <path d="M12.5 15L4.27276 0.75L20.7272 0.75L12.5 15Z" fill="#C4C4C4" />
        </g>
        <defs>
          <filter
            id="filter0_d"
            x="0.272705"
            y="0.75"
            width="24.4545"
            height="22.25"
            filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB"
          >
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            />
            <feOffset dy="4" />
            <feGaussianBlur stdDeviation="2" />
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
          </filter>
        </defs>
      </svg>
    </div>
    <span class="add-button" @click="formVisible = true">
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
    </span>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  data() {
    return {
      formVisible: false,
      title: ""
    };
  },
  methods: {
    ...mapActions(["addTodo"]),

    // Execute addTodo action in store
    newTodo() {
      if (this.title) {
        this.addTodo(this.title);
        this.formVisible = false;
        this.title = "";
      }
    }
  }
};
</script>

<style>
.add-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  position: relative;
  margin-top: auto;
}

.add-button {
  width: 82px;
  height: 82px;
  border-radius: 50%;
  background: #0170c2;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
}

.add-button svg {
  transition: all 0.4s ease-in-out;
  width: 24px;
  height: 24px;
}

.add-button:hover {
  cursor: pointer;
}

.add-button:hover svg {
  transform: rotate(360deg);
}

.add-container {
  transition: all 0.4s ease-in-out;
  opacity: 0;
  pointer-events: none;
  background: #fff;
  width: 50%;
  height: 120px;
  position: absolute;
  box-shadow: 0 4px 1rem rgba(0, 0, 0, 0.2);
  bottom: 110px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.add-container.active {
  opacity: 1;
  pointer-events: all;
}

.add-container .arrow {
  position: absolute;
  height: 48px;
  width: 48px;
  bottom: -40px;
  left: 50%;
  transform: translateX(-50%);
}

.add-container .arrow path {
  fill: #fff;
}

.add-container .close {
  background: #b40000;
  width: 32px;
  height: 32px;
  margin: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: flex-end;
}

.add-container .close svg {
  transition: all 0.4s ease-in-out;
  transform: rotate(45deg);
}

.add-container .close:hover {
  cursor: pointer;
}

.add-container .close:hover svg {
  transform: rotate(315deg);
}

.add-container input {
  background: transparent;
  padding: 0.25rem;
  border: 1px solid #cecece;
  border-radius: 5px;
  width: 50%;
}

.add-container button {
  transition: all 0.4s ease-in-out;
  background: #0170c2;
  color: #fff;
  border: none;
  margin-top: 0.5rem;
  padding: 0.5rem;
  border-radius: 5px;
}

.add-container button:hover {
  cursor: pointer;
  background: #fff;
  color: #0170c2;
}

@media screen and (max-width: 768px) {
  .add-container {
    width: 90%;
    height: 160px;
  }
  .add-container button {
    padding: 0.75rem;
    font-size: 1rem;
    margin-top: 1rem;
  }
  .add-container input {
    padding: 0.5rem;
    font-size: 1rem;
  }
}
</style>