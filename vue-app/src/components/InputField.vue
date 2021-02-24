<template>
  <div class="hello">
    <textarea
      v-model="title"
      placeholder="Enter a title here"
      rows="1"
      cols="80"
    ></textarea
    ><br />
    <textarea
      v-model="message"
      placeholder="paste your text here"
      rows="30"
      cols="80"
    ></textarea>
    <br />
    <input type="checkbox" id="checkbox" v-model="unlisted" />
    <label for="checkbox">unlisted</label>
    <br /><br />
    <button v-on:click="sendPaste">Send</button>
    <br />
    <p v-if="success">Saved</p>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "InputField",
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
  methods: {
    sendPaste() {
      axios({
        method: "post",
        url: "http://localhost:3000/api/pastes",
        data: {
          title: this.title,
          content: this.message,
          unlisted: this.unlisted,
        },
      })
        .then((response) => {
          console.log(response);
          this.id = response.data.id;
          this.title = "";
          this.message = "";
          this.unlisted = false;
          this.success = true;
          setTimeout(() => this.$router.push({ path: `/paste/${this.id}`}))          
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
