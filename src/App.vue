<template>
  <div id="app">
    <p>mint ui app</p>
    <!-- <MyToast></MyToast> -->
    <button @click="handleclick">dianji</button>
   
  </div>
</template>

<script>
// import MyToast from './MyToast/MyToast.vue'
import { Indicator } from "mint-ui";
import Toast from "./MyToast/MyToast.js";
import MyActionSheet from "./MyActionSheet.vue";
export default {
  name: "app",
  data() {
    return {
      list: ["111", "222", "333", "444"]
    };
  },
  components: {
    MyActionSheet
  },
  methods: {
    handleclick() {
      Toast({
        message: "faker"
      });
    }
  },
  mounted() {
    Indicator.open({
      text: "加载中...",
      spinnerType: "snake"
    });
  }
};
</script>

<style scoped>
#app .mint-navbar.is-fixed {
  bottom: 0;
  top: auto;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

h1,
h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
