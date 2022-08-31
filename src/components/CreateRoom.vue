
<!-- Register Template -->
<template>
  <div class="container">

    <div class="mb-3">
      <h4>Play poker with online chips</h4>
    </div>

    <div class="justify-content-center">

      <div v-if="!ws">
        <div class="input-group">
          <input v-model="user.name" class="form-control name" placeholder="Enter your name" @keyup.enter.exact="createRoom" />
          <div class="input-group-append">
                  <button class="input-group-text send_btn" @click="createRoom">
                  Create Room
                  </button>
          </div>
        </div>
      </div>
      <span>
        <u>
          <router-link to="/join" style="float: right;margin: 5px;">Join Room</router-link>
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
      roomInput: null,
      room: null,
      pot: 0,
      user: {
        name: ""
      },
      users: []
    }
  },
  methods: {
    createRoom() {
      axios.post("http://localhost:8080/api/room", {
        name: this.user.name
      }).then(res => {
        console.log(res.data.data)
        this.room = {
          uri: res.data.data.uri,
          name: res.data.data.uri,
          messages: []
        }
        this.connectToWebsocket()
      })
    },
    connectToWebsocket() {
      this.ws = new WebSocket(this.serverUrl + "?name=" + this.user.name + "&uri=" + this.room.uri);
      this.ws.addEventListener('message', (event) => { this.handleNewMessage(event) });
    },
    onWebsocketOpen() {
      console.log("connected to WS!");
    },
    handleNewMessage(event) {

      let data = event.data;
      data = data.split(/\r?\n/);

      for (let i = 0; i < data.length; i++) {
        let msg = JSON.parse(data[i]);

        // display the message in the correct room.
        const room = this.room;
        if (typeof room !== "undefined") {
          room.messages.push(msg);
        }
      }
    },
    addPot() {
      console.log('addpot')
      this.ws.send(JSON.stringify({ action: 'add-pot', pot: parseInt(this.pot) }));
    },
    retrievePot() {
      console.log('retrievePot')
      this.ws.send(JSON.stringify({ action: 'retrieve-pot', pot: parseInt(this.pot) }));
    },
    sendMessage(room) {
      console.log(room)
      // send message to correct room.
      if (room.newMessage !== "") {
        this.ws.send(JSON.stringify({
          action: 'send-message',
          message: room.newMessage,
        }));
        room.newMessage = "";
      }
    },
    joinRoom() {

      console.log("joinRoom")
      this.room = {
        uri: this.roomInput,
        name: this.roomInput,
        messages: []
      }

      this.connectToWebsocket()
      this.ws.onopen = function (e) {
        console.log(e)

        // this.ws.send(JSON.stringify({ action: 'join-room', message: this.roomInput }));
        console.log("send")
        this.messages = [];
        this.room = ({ "name": this.roomInput, "messages": [] });
        this.roomInput = "";
      }.bind(this)
    },
    leaveRoom(room) {
      this.ws.send(JSON.stringify({ action: 'leave-room', message: room.name }));
    }
  }
}
</script>

