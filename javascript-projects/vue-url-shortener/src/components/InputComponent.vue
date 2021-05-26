<template>
  <div class="input">
    <input placeholder="Paste your link here..." type="text" v-model="link" name="link" id />
    <button @click="sendLink()">Shorten</button>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  data() {
    return {
      link: ""
    };
  },
  methods: {
    // Dispatch store action to get shortened link from API
    ...mapActions(["getLink"]),
    sendLink() {
      if (this.link) {
        this.getLink(this.link);
      }
    }
  }
};
</script>

<style>
.input {
  position: relative;
  display: flex;
  width: 80%;
  box-shadow: 0 5px 1rem rgba(0, 0, 0, 0.25);
}
.input input {
  flex-basis: 75%;
  padding: 1rem;
  border: 1px solid #666666;
  background: transparent;
  outline: none;
}
</style>