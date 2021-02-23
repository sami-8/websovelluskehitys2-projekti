<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <div>
        <textarea v-model="title"
        placeholder="Enter title here"
        rows="1"
        cols="80"></textarea><br>
        <textarea v-model="message"
        placeholder="paste your text here"
        rows="30"
        cols="80"></textarea>
        <br>
        <input type="checkbox" id="checkbox" v-model="unlisted">
        <label for="checkbox">Unlisted</label>
        <br>
        <button v-on:click="sendPaste">Send</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: 'InputField',
  props: {
    msg: String,
  },
  data() {
      return {
        title: [],
        message: [],
        combinedMsg: [],
        unlisted: false
      }
  },
  methods: {
      sendPaste() {
        axios({
        method: 'post',
        url: 'http://localhost:3000/api/pastes',
        data: {
            title: this.title,
            content: this.message,
            unlisted: this.unlisted
        }
        })
        .then(function (response) {
            console.log(response)
            this.title = "";
            this.message = "";
            this.unlisted = false;
        })
        .catch(function (error) {
            console.log(error)
        });
      }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
