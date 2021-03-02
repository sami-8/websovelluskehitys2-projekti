<template>
  <div class="paste">
    <h4 v-if="this.title">{{ title }}</h4>    
    <pre v-if="this.message">{{ message }}</pre>
  </div>
</template>
<script>
import axios from "axios";
export default {
  name: "Paste",
  props: {
    msg: String,
  },
  data() {
    return {      
      title: [],
      message: []
    };
  },
  created: function () {      
      axios({
          method: "get",
          url: "http://localhost:3000/api/pastes/random"               
      })
      .then((response) => {                              
          this.title = response.data[0].title;
          this.message = response.data[0].content;                    
      })
      .catch(function (error) {
          console.log(error);
      });
  }  
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.paste {
    text-align: left;
    padding: 10px;
}
</style>
