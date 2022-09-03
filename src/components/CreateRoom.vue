<template>
  <div class="container">

    <div class="mb-3">
      <h4>Play poker with online chips</h4>
    </div>

    <div class="justify-content-center">
        <div class="input-group">
          <input v-model="this.username" class="form-control name" placeholder="Enter your name" @keyup.enter.exact="createRoom" />
          <div class="input-group-append">
            <button class="input-group-text send_btn" @click="createRoom">
            Create Room
            </button>
          </div>
        </div>
      <span>
          <router-link to="/join" style="float: right;margin: 5px;">Join an existing room.</router-link>
      </span>
    </div>
  </div>

</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      ws: null,
      serverUrl: "ws://localhost:8080/ws",
      username: "",

    }
  },
  methods: {
    createRoom() {
      if(this.username) {
        axios.post("http://localhost:8080/api/room/create", {
          name: this.username
        }, {
          withCredentials: true
        }).then(res => {
          if(res.data.status === "success") {
            this.$router.push({
              name: "inRoom",
              params: {
                uri: res.data.data.uri,
              },
            });
          }
        });
      } else {
        alert("Please enter your name.")
      }
    },
  }
}
</script>

