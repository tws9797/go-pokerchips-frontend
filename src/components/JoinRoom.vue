<template>
  <div class="container">

    <div class="mb-3">
      <h4>Join an existing room.</h4>
    </div>

    <div class="justify-content-center">
       <div class="input-group">
          <input
              v-model="username"
              class="form-control name"
              placeholder="Enter your name"
              @keyup.enter.exact="joinRoom"
          />
          <input
              v-model="roomUri"
              class="form-control name"
              placeholder="Enter the Room ID"
              @keyup.enter.exact="joinRoom"
          />
          <div class="input-group-append">
              <button class="input-group-text send_btn" @click="joinRoom">
                Join Room
              </button>
          </div>
      </div>
      <span>
        <u>
          <router-link to="/" style="float: right;margin: 5px;">Create Room</router-link>
        </u>
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
      roomUri: "",
    }
  },
  methods: {
    joinRoom() {
      if(this.username && this.roomUri) {
        axios.post("http://localhost:8080/api/room/join", {
          name: this.username,
          uri: this.roomUri
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
        }).catch((error) => {
          if(error.response.data.message === "room not found") {
            alert("There is no room with the following ID.")
          }
        })
      } else {
        alert("Please enter your name or Room ID")
      }
    },
  }
}
</script>