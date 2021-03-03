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
      v-model="content"
      placeholder="paste your text here"
      rows="30"
      cols="80"
    ></textarea>
    <br />
    <input type="checkbox" id="checkbox" v-model="unlisted" />
    <label for="checkbox">unlisted</label>
    <br />
    <input type="checkbox" id="checkbox2" v-model="setPasswd" />
    <label for="checkbox2">set delete password</label>
    <br />
    <textarea
      v-if="setPasswd"
      v-model="passwd"
      rows="1"
      cols="20"
      placeholder="password?"
    />
    <br /><br />
    <button v-on:click="sendPaste">Send</button>
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
      content: [],
      data: [],
      unlisted: false,
      setPasswd: false,
      passwd: "",
      id: [],
    };
  },
  methods: {
    sendPaste() {
      if (this.title == "" && this.content == "") {
        return;
      }
      this.data = {
        title: this.title,
        content: this.content,
        unlisted: this.unlisted,
        delpassword: this.passwd,
      };
      axios({
        method: "post",
        url: "http://localhost:3000/api/pastes",
        data: this.data,
      })
        .then((response) => {
          console.log(response);
          this.id = response.data.id;
          this.$router.push({ path: `/paste/${this.id}` });
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
.hello {
  padding: 10px;
}
</style>
