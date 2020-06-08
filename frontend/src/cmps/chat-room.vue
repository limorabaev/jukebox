<template>
  <aside v-if="isChatOpen" class="chat-room">
    <header class="chat-header">Chat <button v-if="mobileMode" @click="closeChat && $emit('chatClosed', false)" class="fas fa-times"></button></header>
    <section class="msgs-sec" ref="msgsContainer">
      <label :style="{ visibility: userTyping ? 'visible' : 'hidden' }">{{userTyping}} is Typing...</label>
      <div
        class="chat-msg-line"
        v-bind:class="[(message.user===currUser) ? 'user-msg-bubble' : 'others-msg-bubble']"
        :key="index"
        v-for="(message , index) in messages"
      >
        <label class="user-name-title">{{message.user}}:</label>
        <div>{{message.txt}}</div>
      </div>
    </section>

    <form class="chat-room-form" @submit.prevent="sendMsg">
      <input
        class="chat-input input-with-btn"
        v-model="newMessage.txt"
        type="text"
        placeholder="Enter your massage here..."
        @input="sendTyping"
      />
      <button class="buttons button-of-input">Send</button>
    </form>
  </aside>
</template>

<script>
import socketService from "@/services/socket.service.js";

export default {
  name: "chatRoom",
  props: {
    currStation: Object,
    mobileMode: Boolean
  },
  data() {
    return {
      currUser: "",
      newMessage: {
        txt: "",
        user: ""
      },
      messages: [],
      userTyping: "",
      timeout: null,
      isChatOpen: true
    };
  },
  computed: {
    msgsContainer() {
      return this.$refs.msgsContainer;
    },
    loggedinUser() {
      return this.$store.getters.loggedinUser.fullName;
    },
    username() {
      return this.loggedinUser ? this.loggedinUser : "Guest";
    }
  },
  // watch: {
  //   '$refs.msgsContainer.scrollHeight'() {
  //     this.scrollToBottom();
  //   }
  // },
  created() {
    socketService.on("chat addMsg", this.addMsg);
    socketService.on("chat displayTyping", this.displayTyping);
  },
  destroyed() {
    socketService.off("chat addMsg", this.addMsg);
    socketService.off("chat displayTyping", this.displayTyping); 
  },
  methods: {
    scrollToBottom() {
      this.msgsContainer.scrollTop = this.msgsContainer.scrollHeight;
    },
    addMsg(msg) {
      this.messages.push(msg);
      setTimeout(() => {
        this.scrollToBottom();
      }, 100)
    },
    sendMsg() {
      if (!this.newMessage.txt) return;
      this.newMessage.user = this.username;
      this.currUser = this.newMessage.user;
      socketService.emit("chat newMsg", this.newMessage);
      this.newMessage.txt = "";
    },
    sendTyping() {
      socketService.emit("chat userTyping", this.username);
    },
    displayTyping(username) {
      this.userTyping = username;
      if (this.timeout) clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.userTyping = "";
      }, 1000);
    },
    closeChat(ev){
      this.isChatOpen=false;
     
    }
  }
};
</script>