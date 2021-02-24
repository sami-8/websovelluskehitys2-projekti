<template>
  <div class="paste">
    <h4 v-if="this.title"> {{ title }}</h4>    
    <p v-if="this.message"> {{ message }}</p>
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
      message: [],
      unlisted: false,
      success: false,
      id: []
    };
  },
  created: function () {      
      axios({
          method: "get",
          url: "http://localhost:3000/api/pastes/" + this.$route.params.id               
      })
      .then((response) => {
          this.title = response.data.title;
          this.message = response.data.content;          
      })
      .catch(function (error) {
          console.log(error);
      });
  }  
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
