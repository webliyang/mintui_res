<template>
  <div id="app">
    <p>mint ui app</p>
  </div>
</template>

<script>
export default {

  name: 'app',
  data () {
    return {
      
    }
  },
  methods:{
  
  }
}
</script>

<style scoped>
#app .mint-navbar.is-fixed{
  bottom: 0;
  top:auto
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

}

h1, h2 {
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
