
<!-- Register Template -->
<template>
  <div class="container">

    <div class="chat" v-if="room">
      <div class="card">
        <div class="row">
          <button type="button" class="col-6 btn">Activity Feeds</button>
          <button type="button" class="col-6 btn">Chip Counts</button>
        </div>

        <div class="card-body msg_card_body">
          <div
              v-for="(message, key) in room.messages"
              :key="key"
              class="d-flex justify-content-start mb-4">
            <div class="msg_cotainer">
              {{message.message}}
              <br />
              <span v-if="message.pot">Pot Available: {{message.pot}}</span>
            </div>
          </div>
        </div>

        <div class="card-footer" style="text-align: center;">
          <p>Your Chips: <span class="col-12" v-text="currentChips"></span></p>
          <div class="row">
            <button type="button" class="col-6 btn">Bet</button>
            <button type="button" class="col-6 btn">Take</button>
          </div>

          <div class="input-group" style="justify-content: center">
            <input
                type="range"
                min="0"
                :max="currentChips"
                v-model="bet"
            />
            <span class="col-12" v-text="bet"></span>
            <button type="button" class="btn btn-success" @click="addPot">Bet</button>
          </div>

        </div>
      </div>
    </div>

  </div>

</template>

<style>
.card {
  height: 500px;
  border-radius: 15px;
}
</style>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      ws: null,
      serverUrl: "ws://localhost:8080/ws",
      roomInput: null,
      room: {
        uri: "",
        messages: [],
      },
      pot: 0,
      bet: 0,
      currentChips: 0,
      user: {
        name: ""
      },
      records: null
    }
  },
  methods: {
    connectToWebsocket() {
      this.ws = new WebSocket(this.serverUrl);
      this.ws.addEventListener('open', () => { this.onWebsocketOpen()});
      this.ws.addEventListener('message', (event) => { this.handleNewMessage(event) });
    },
    getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2)
        return parts.pop().split(";").shift();
    },
    onWebsocketOpen() {
      console.log("connected to WS!");
    },
    handleNewMessage(event) {
      let data = event.data;
      data = data.split(/\r?\n/);
      console.log(data);
      for (let i = 0; i < data.length; i++) {
        const msg = JSON.parse(data[i]);

        console.log(msg);
        const action = msg.action;

        switch(action) {
          case "send-message":
            this.room.messages.push(msg);
            break;
          case "update-pot":
            this.pot = msg.pot;
            if(this.user.name === msg.sender) {
              this.currentChips = msg.currentChips;
            }
            this.room.messages.push(msg);
            break;
          case "join-room":
            this.user.name = msg.sender;
            this.currentChips = this.records[this.user.name];
            break;
        }
      }
    },
    addPot() {
      console.log('addPot')
      this.ws.send(JSON.stringify({ action: 'add-pot', pot: parseInt(this.bet) }));
    },
    retrievePot() {
      console.log('retrievePot')
      this.ws.send(JSON.stringify({ action: 'retrieve-pot', pot: parseInt(this.bet) }));
    },
  },
  mounted: function() {
    if(this.getCookie("session")) {
      axios.get("http://localhost:8080/api/room/get", {
        withCredentials: true
      }).then(res => {
        this.room.uri = res.data.data.uri;
        this.records = res.data.data.record;
        this.pot = res.data.data.pot;
        this.connectToWebsocket();
      });
    } else {
      this.$router.push({
        name: "joinRoom"
      });
    }
  }
}
</script>

