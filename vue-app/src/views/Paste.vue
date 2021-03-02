<template>
  <div class="paste">
    <div v-if="noError">
      <a
        id="raw"
        v-bind:href="
          'http://localhost:3000/api/pastes/' + this.$route.params.id + '/raw'
        "
        >raw text</a
      ><br />
      <textarea
        v-model="delPassword"
        placeholder="Delete password"
        rows="1"
        cols="21"
      /><br />
      <button v-on:click="deletePaste">Delete</button>
      <h4 v-if="this.title">{{ title }}</h4>
      <pre v-if="this.content">{{ content }}</pre>
    </div>
    <div v-if="!noError" id="error">
      <h3>{{ messg }}</h3>
    </div>
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
      title: "",
      content: "",
      delPassword: [],
      authorizationToken: [],
      messg: "",
      message: false,
      noError: false,
    };
  },
  created: function () {
    var self = this;
    axios({
      method: "get",
      url: "http://localhost:3000/api/pastes/" + this.$route.params.id,
    })
      .then((response) => {
        console.log(response);
        self.noError = true;
        self.title = response.data.title;
        self.content = response.data.content;
      })
      .catch(function (error) {
        self.noError = false;
        self.messg = error.response.data.error;
      });
  },
  methods: {
    deletePaste() {
      var self = this;
      axios
        .delete("http://localhost:3000/api/pastes/" + this.$route.params.id, {
          data: {
            delpassword: this.delPassword,
          },
        })
        .then((response) => {
          console.log(response);
          self.noError = false;
          self.messg = "Deleted!";
          setTimeout(function () {
            self.goHome();
          }, 1000);
        })
        .catch(function (error) {
          self.noError = false;
          self.messg = error.response.data.error;
        });
      this.delPassword = "";
    },
    goHome() {
      this.$router.push({ path: `/` });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.paste {
  text-align: left;
  padding: 5px;
}
#error {
  text-align: center;
}
#raw {
  font-size: 80%;
}
</style>
