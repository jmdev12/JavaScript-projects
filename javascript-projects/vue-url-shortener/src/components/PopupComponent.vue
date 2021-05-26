<template>
  <transition name="fade">
    <div class="popup" ref="popup" v-if="getLink">
      <div class="popup-content">
        <span class="close" @click="hidePopup()">X</span>
        <h2>Generated link:</h2>
        <div class="link">
          <span class="text" ref="linkContainer">{{ getLink }}</span>
          <button class="copy" :disabled="copied" @click="copy()">Copy link</button>
        </div>
      </div>
      <div class="alert alert-success" :class="{visible: copied}">Copied to clipboard!</div>
    </div>
  </transition>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      copied: false
    };
  },
  computed: {
    ...mapGetters(["getLink"])
  },
  methods: {
    copy() {
      // Create temporary textarea to copy link from
      const tempArea = document.createElement("textarea");
      tempArea.value = this.$refs.linkContainer.textContent;
      document.body.appendChild(tempArea);

      // Copy to clipboard
      tempArea.select();
      document.execCommand("copy");
      tempArea.remove();
      this.copied = true;

      // Set delay between copying
      setTimeout(() => {
        this.copied = false;
      }, 6000);
    },

    hidePopup() {
      this.$refs.popup.classList.add("hidden");
    }
  },
  watch: {
    getLink: function() {
      this.$refs.popup.classList.remove("hidden");
    }
  }
};
</script>

<style>
.popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(197, 197, 197, 0.5);
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.5s ease-in-out;
}

.popup-content {
  position: relative;
  background: #fff;
  padding: 2rem;
  border-radius: 30px;
  width: 50%;
  height: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.popup .close {
  position: absolute;
  align-self: flex-end;
  top: 15%;
  right: 5%;
}
.popup .close:hover {
  cursor: pointer;
}

.popup.hidden {
  opacity: 0;
  pointer-events: none;
}

.popup-content h2 {
  text-align: center;
}
.link {
  width: 100%;
  display: flex;
  margin-top: 2rem;
}
.link .text {
  padding: 1rem;
  border: 1px solid #000;
  border-right-color: transparent;
  flex-basis: 75%;
}
.link button {
  padding: 1rem;
}

.link button:disabled {
  background: #c58935;
}

.alert {
  position: fixed !important;
  bottom: 2%;
  right: 5%;
  transform: scale(1.5);
  opacity: 0;
}
.alert.visible {
  animation: pop 5s ease-in-out 1;
}

@keyframes pop {
  0% {
    opacity: 0;
  }
  15% {
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

@media screen and (max-width: 1550px) {
  .popup-content {
    width: 60%;
  }
}

@media screen and (max-width: 1200px) {
  .popup-content {
    width: 75%;
  }
}

@media screen and (max-width: 576px) {
  .popup-content {
    width: 100%;
  }
  .link {
    flex-wrap: wrap;
  }
  .link .text {
    flex-basis: auto;
    width: 100%;
    border-right-color: #000;
  }
  .link button {
    width: 100%;
    flex-basis: 100%;
  }
}
</style>