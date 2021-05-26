<template>
  <div id="app">
    <popup-component></popup-component>
    <div class="container-fluid h-100">
      <div class="d-flex justify-content-center align-items-center h-100">
        <div class="text-center content">
          <div class="image d-flex">
            <img src="./assets/person.svg" alt />
          </div>
          <h1 class="heading">
            Simple link shortener for
            <span class="higlight">everyone</span>
          </h1>
          <p
            class="description"
          >Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas sed varius metus. Aenean vestibulum condimentum est.</p>
          <input-component></input-component>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import InputComponent from "./components/InputComponent";
import PopupComponent from "./components/PopupComponent";

export default {
  name: "App",
  components: {
    InputComponent,
    PopupComponent
  }
};
</script>

<style>
#app {
  font-family: "Poppins", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #000000;
  height: 100vh;
}
.content {
  width: 40%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.heading {
  font-weight: 600;
}

.higlight {
  position: relative;
}

.higlight::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 5px;
  background: #fc9706;
  border-radius: 5px;
}

.description {
  font-size: 18px;
  max-width: 80%;
  text-align: center;
  margin: 1rem 0;
}

.image {
  width: 50%;
  height: auto;
  margin: 0 auto;
}
button {
  flex-basis: 25%;
  margin-left: -60px;
  background: #fc9706;
  border: none;
  color: #fff;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

@media screen and (max-width: 1550px) {
  .content {
    width: 55%;
  }
}
@media screen and (max-width: 1200px) {
  .content {
    width: 65%;
  }
}
@media screen and (max-width: 996px) {
  .content {
    width: 75%;
  }
}
@media screen and (max-width: 768px) {
  .content {
    width: 85%;
  }
  .input {
    width: 100%;
  }
}
@media screen and (max-width: 576px) {
  .content {
    width: 95%;
  }
  .input {
    flex-wrap: wrap;
    margin-top: 1rem;
  }
  .input input {
    flex-basis: auto;
    width: 100%;
  }
  .input button {
    flex-basis: 100%;
    padding: 1rem 0;
  }
  .image {
    width: 75%;
  }
  .heading {
    font-size: 2.25rem;
  }
}
</style>
