<template>
  <div class="paste">
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
    };
  },
  created: function () {
      axios({
          method: "get",
          url: "/api/pastes/random"
      })
      .then((response) => {
          this.$router.push({ path: `/paste/${response.data[0].id}` });
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
