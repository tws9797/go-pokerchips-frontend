
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
              <span class="msg_name" v-if="message.sender">{{message.sender.name}}</span>
            </div>
          </div>
        </div>

        <div class="card-footer" style="text-align: center;">
          <p>Your Chips: <span class="col-12" v-text="potAvailable"></span></p>
          <div class="row">
            <button type="button" class="col-6 btn">Bet</button>
            <button type="button" class="col-6 btn">Take</button>
          </div>

          <div class="input-group" style="justify-content: center">
            <input
                type="range"
                min="0"
                max="50"
                v-model="potAvailable"
            />
            <span class="col-12" v-text="potAvailable"></span>
            <button type="button" class="btn btn-success">Bet</button>
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
export default {
  data() {
    return {
      ws: null,
      serverUrl: "ws://localhost:8080/ws",
      roomInput: null,
      room: {
        messages: [],
      },
      pot: 0,
      potAvailable: 0,
      user: {
        name: ""
      },
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
      console.log(event);
      let data = event.data;
      data = data.split(/\r?\n/);
      console.log(data);
      for (let i = 0; i < data.length; i++) {
        let msg = JSON.parse(data[i]);
        console.log(msg)
        // display the message in the correct room.
        this.pot = msg.pot;
        this.room.messages.push(msg);
      }
    },
  },
  mounted: function() {
    if(this.getCookie("session")) {
      this.connectToWebsocket()
    } else {
      this.$router.push({
        name: "joinRoom"
      });
    }
  }
}
</script>

