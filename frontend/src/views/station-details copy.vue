<template>
  <article v-if="station" class="station-details">
    <header class="station-details-header">
      <div class="img-container ratio-square">
        <img class="station-img" v-bind:src="station.imgUrl"/>
      </div>
      <section class="info-station-sec">
        <h2>{{station.name}}</h2>
        <h3>{{station.createdBy.fullName}} add img of creator</h3>
        <router-link v-if="isStationCreator" :to="'/station/edit/' + station._id">Edit station</router-link>
      </section>
      <div class="sation-stats flex direction-column">
      <h4>{{station.tags.join(", ")}}</h4>
        <h4>
          <button class="like-btn fas fa-heart"></button>
          {{likedCount}}
        </h4>
      </div>
    </header>
    <section class="video-sec">
        <img class="needle" src="../assets/img/needl1.png"/>
        <div class="video-container ratio-square">
          <youtube ref="youtube" width="100%" height="100%" @ready="sendSongRequst"
            @ended="playNextSong" @playing="sendPlaying" @paused="sendPaused"
          ></youtube>
        </div>
      </section>

      

      <section class="video-btns-container">
        <button class="next-song-btn video-btns" @click="playPrevSong">
          <i class="fas fa-backward"></i>
        </button>
        <button v-if="isSongPlaying" @click="toggleSong" class="play-song-btn video-btns">
          <i class="fas fa-pause"></i>
        </button>
        <button v-else @click="toggleSong" class="play-song-btn video-btns">
          <i class="fas fa-play"></i>
        </button>
        <button class="prev-song-btn video-btns" @click="playNextSong">
          <i class="fas fa-forward"></i>
        </button>
        <!-- <h3>Width: {{ windowWidth }}</h3> -->
      </section>
    <!-- </section> -->

    <section v-if="!chatIsOn || (chatIsOn && !mobileMode)" class="songs-sec">
      <button class="add-button buttons" @click="toggleAddSong">{{listOrAddBtn}}</button>
      <songAdd v-if="isAddSongOpen" @add-song="addSong" />
      <songList v-else :songs="station.songs" :playingSongId="playingSongId" 
        @play-song="playSong" @update-playlist="playlistUpdated" />
    </section>
  
    <chat-room :mobileMode="mobileMode" @chatClosed="toggleChat"  v-if="chatIsOn || !mobileMode" :currStation="station" class="station-chat"></chat-room>
    <div v-if="mobileMode && !chatIsOn" @click="toggleChat" class="chat-open">
      <h4>
        <i class="far fa-comments"></i>
      </h4>
    </div>
  </article>
</template>

<script>
import socketService from '@/services/socket.service.js';
import { shuffleArray } from '@/services/util.service.js';
import songList from '@/cmps/song-list.vue';
import songAdd from '@/cmps/song-add.vue';
import chatRoom from '@/cmps/chat-room.vue';

export default {
  name: 'stationDetails',
  data() {
    return {
      windowWidth: 0,
      mobileMode: false,
      playingSongId: '',
      isAddSongOpen: false,
      isSongPlaying: false,
      chatIsOn: false
    };
  },
  async created() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
    socketService.setup();
    await this.loadStation();
    socketService.emit('joinStation', { stationId: this.station._id, user: this.loggedinUser });
    socketService.on('player updatePlaylist', this.updatePlaylist);
  },
  destroyed() {
    socketService.off('playlist updatePlaylist', this.updatePlaylist);
    socketService.terminate();
    this.$store.commit({ type: 'unsetStation' });
    window.removeEventListener('resize', this.handleResize);
  },
  computed: {
    station() {
      return this.$store.getters.currStation;
    },
    loggedinUser() {
      return this.$store.getters.loggedinUser;
    },
    isStationCreator() {
      return (!this.$store.getters.isGuestUser && this.station.createdBy._id === this.loggedinUser._id);
    },
    likedCount() {
      return this.station.likedBy.length;
    },
    player() {
      return this.$refs.youtube.player;
    },
    listOrAddBtn(){
      return (this.isAddSongOpen)? 'Return to playlist' : 'Add a new song';
    }
  },
  methods: {
    handleResize() {
      this.windowWidth = window.innerWidth;
      // this.windowWidth > 460
      this.windowWidth > 740
        ? (this.mobileMode = false)
        : (this.mobileMode = true);
    },
    async loadStation() {
      const stationId = this.$route.params.id;
      await this.$store.dispatch({ type: 'loadStation', stationId });
    },
    loadSong(songId) {
      this.playingSongId = songId;
      this.player.loadVideoById(this.playingSongId);
    },
    sendSongRequst() {
      const songId = this.station.songs[0].id;
      this.loadSong(songId);
    },
    async toggleSong() {
      const playerState = await this.player.getPlayerState();
      if (playerState === 1 /* PLAYING */) this.player.pauseVideo();
      else if (playerState === 2 /* PAUSED */) this.player.playVideo();
    },
    playSong(songId) {
      this.loadSong(songId);
    },
    playNextSong() {
      var idx = this.station.songs.findIndex(song => song.id === this.playingSongId);
      idx++;
      if (idx === this.station.songs.length) idx = 0;
      const songId = this.station.songs[idx].id;
      this.loadSong(songId);
    },
    playPrevSong() {
      var idx = this.station.songs.findIndex(song => song.id === this.playingSongId);
      idx--;
      if (idx < 0) idx = this.station.songs.length - 1;
      const songId = this.station.songs[idx].id;
      this.loadSong(songId);
    },
    sendPlaying() {
      this.isSongPlaying = true;
    },
    sendPaused() {
      this.isSongPlaying = false;
    },
    toggleAddSong() {
      this.isAddSongOpen = !this.isAddSongOpen;
    },
    addSong(song) {
      this.toggleAddSong();
      this.$store.dispatch({ type: 'addSong', song });
    },
    playlistUpdated(songs) {
      socketService.emit("player playlistUpdated", songs);
      const playingSongIdx = songs.findIndex(song => song.id === this.playingSongId);
      if (playingSongIdx === -1) this.playNextSong();
      this.$store.dispatch({ type: 'updatePlaylist', songs });
    },
    updatePlaylist(songs) {
      const playingSongIdx = songs.findIndex(song => song.id === this.playingSongId);
      if (playingSongIdx === -1) this.playNextSong();
      this.$store.commit({ type: 'updatePlaylist', songs });
    },
    shuffleSongs() {
      const songs = JSON.parse(JSON.stringify(this.station.songs));
      shuffleArray(songs);
      this.playlistUpdated(songs);
    },
    toggleChat(value) {
      this.chatIsOn=!this.chatIsOn;
    },

  },
  components: {
    songList,
    songAdd,
    chatRoom
  }
};
</script>