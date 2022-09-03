
<!-- Register Template -->
<template>
  <div class="container-sm">

    <div class="chat" v-if="room">
      <div class="card">
        <div style="display: flex;flex-wrap: wrap;text-align: center;">
            <div id="card-activities" class="col-6 p-1 card-btn">
              <div class="mt-2">Activity Feeds</div>
              <hr id="divider-activities" v-bind:class="isActivityFeeds?'':'d-none'" class="solid divider">
            </div>
            <div id="card-chips" class="col-6 p-1 card-btn">
              <div class="mt-2">Chip Counts</div>
              <hr v-bind:class="isChipCounts?'':'d-none'" class="solid divider">
            </div>
        </div>

        <div id="msg-card-body" class="card-body">
          <div
              v-for="(message, key) in room.messages"
              :key="key"
              class="d-flex justify-content-start mb-4">
            <div>
              {{message.message}}
              <br />
              <span v-if="message.pot">Pot Available: {{message.pot}}</span>
            </div>
          </div>
        </div>

        <div class="card-footer" style="text-align: center;">
          <p>Your Chips: <span class="col-12" v-text="currentChips"></span></p>

          <div style="display: flex;flex-wrap: wrap;text-align: center;">
            <div id="card-activities" class="col-6 p-1 card-btn" @click="isBet=true; isTake=false">
              <div>Bet</div>
              <hr id="divider-activities" v-bind:class="isBet?'':'d-none'" class="solid divider">
            </div>
            <div id="card-chips" class="col-6 p-1 card-btn"  @click="isTake=true; isBet=false">
              <div>Take</div>
              <hr v-bind:class="isTake?'':'d-none'" class="solid divider">
            </div>
          </div>

          <div id="card-bet" class="input-group" style="justify-content: center" v-if="isBet">
            <input
                type="range"
                min="0"
                :max="currentChips"
                v-model="bet"
            />
            <span class="col-12 mt-2" v-text="bet"></span>
            <button :class="{'disabled': currentChips === 0 }" type="button" class="mt-3 btn btn-block btn-success" @click="addPot">Bet</button>
          </div>

          <div id="card-take" class="input-group" style="justify-content: center" v-if="isTake">
            <input
                type="range"
                min="0"
                :max="pot"
                v-model="take"
            />
            <span class="col-12 mt-2" v-text="take"></span>
            <button :class="{'disabled': pot === 0 }" type="button" class="mt-3 btn btn-block btn-success" @click="retrievePot">Take</button>
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
.divider {
  width:50%;
  margin-top:0.5rem;
  margin-bottom:0.5rem;
}
#msg-card-body{
  overflow-y: auto;
  max-height: 600px;
}
#card-activities:hover hr, #card-chips:hover hr {
  display: block !important;
}

.card-btn:hover {
  cursor: pointer;
}

</style>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      ws: null,
      serverUrl: "ws://localhost:8080/ws",
      isActivityFeeds: true,
      isChipCounts: false,
      isBet: true,
      isTake: false,
      roomInput: null,
      room: {
        uri: "",
        messages: [],
      },
      pot: 0,
      bet: 0,
      take: 0,
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
            this.bet = 0;
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

