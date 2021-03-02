<template>
  <div class="paste">
    <textarea
      v-model="delPassword"
      placeholder="Delete password"
      rows="1"
      cols="21"
    /><br />
    <button v-on:click="deletePaste">Delete</button>
    <br /><br />
    <a v-bind:href="'http://localhost:3000/api/pastes/' + this.$route.params.id + '/raw'">raw text</a>
    <h3 v-if="deleted">Deleted!</h3>
    <h4 v-if="this.title">{{ title }}</h4>
    <pre v-if="this.content">{{ content }}</pre>
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
      content: [],
      delPassword: [],
      authorizationToken: [],
      deleted: false
    };
  },
  created: function () {
    axios({
      method: "get",
      url: "http://localhost:3000/api/pastes/" + this.$route.params.id,
    })
      .then((response) => {
        this.title = response.data.title;
        this.content = response.data.content;
      })
      .catch(function (error) {
        console.log(error);
      });
  },
  methods: {
    deletePaste() {            
      axios
        .delete('http://localhost:3000/api/pastes/' + this.$route.params.id, {          
          data: {
            delpassword: this.delPassword,
          },
        })
        .then((response) => {
          console.log(response);
          this.title = "";
          this.content = "";
          this.deleted = true;
        })
        .catch(function (error) {
          console.log(error);
        });
        this.delPassword = '';
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.paste {
  text-align: left;
  padding: 10px;  
}
</style>
