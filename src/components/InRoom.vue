
<!-- Register Template -->
<template>
  <div class="container">

    <div class="chat" v-if="room">
      <div class="card">
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
        <div class="card-footer">
          <div class="input-group">
                  <textarea
                      v-model="room.newMessage"
                      name=""
                      class="form-control type_msg"
                      placeholder="Type your message..."
                      @keyup.enter.exact="sendMessage(room)"
                  ></textarea>
            <div class="input-group-append">
                    <span class="input-group-text send_btn" @click="sendMessage(room)"
                    >></span
                    >
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>

</template>

<script>
export default {
  data() {
    return {
      ws: true,
      serverUrl: "ws://localhost:8080/ws",
      roomInput: null,
      room: true,
      pot: 0,
      user: {
        name: ""
      },
      users: []
    }
  },
  mounted() {
    console.log(this.$route.params.id)
  }
}
</script>

