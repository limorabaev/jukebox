<template>
  <article v-if="station" class="station-details flex direction-column">
    <!-- v-bind:style="{ 'background-image': url(station.imgUrl) }" -->

    <header class="station-details-header">
      <div class="img-container ratio-square">
        <img class="station-img" v-bind:src="station.imgUrl" />
      </div>
      <section class="info-station-sec">
        <h2>{{station.name}}</h2>
        <div class="creator flex align-center space-between">
          <p class="creator-name">{{station.createdBy.fullName}}</p>
          <div class="ratio-square user-img">
            <img :src="station.createdBy.imgUrl" />
          </div>
        </div>

        <router-link
          class="edit-router"
          v-if="isStationCreator"
          :to="'/station/edit/' + station._id"
        >Edit station</router-link>
      </section>
      <div class="sation-stats flex direction-column">
        <!-- <h4 class="station-tags">{{station.tags.join(", ")}}</h4> -->
        <ul class="tags-list">
          <li class="li-tag buttons" :key="tag" v-for="tag in station.tags">{{tag}}</li>
        </ul>
        <div class="likes-and-views-container">
          <h4 title="click to like!">
            <button @click="addLike" class="like-btn fas fa-heart"></button>
            {{likedCount}}
          </h4>
          <h4 title="views" class>
            <label class="far fa-eye"></label> 840
          </h4>
        </div>
      </div>
    </header>

    <section class="playlist-chat-container content-container flex">
      <section class="songs-sec" v-if="!chatIsOn || (chatIsOn && !mobileMode)">
        <button class="add-button buttons" @click="toggleAddSong">{{listOrAddBtn}}</button>
        <songAdd v-if="isAddSongOpen" @add-song="addSong" />
        <songList
          v-else
          :songs="station.songs"
          :playingSongId="playingSongId"
          :isSongPlaying="isSongPlaying"
          @play-song="newSongPlayed($event, true)"
          @update-playlist="playlistUpdated"
        />
      </section>

      <chat-room
        :mobileMode="mobileMode"
        @chatClosed="toggleChat"
        v-if="chatIsOn || !mobileMode"
        :currStation="station"
      ></chat-room>
      <div v-if="mobileMode && !chatIsOn" @click="toggleChat" class="chat-open">
        <h4>
          <i class="far fa-comments"></i>
        </h4>
      </div>
    </section>

    <!-- <section class="song-info-container"> -->
    <!-- <p>Now playing: <span v-if="playingSong">{{playingSong.title}}</span></p> -->
    <!-- <p>Up next: <span v-if="playingSong">{{nextSong.title}}</span></p> -->
    <!-- </section> -->
    <!-- <section class="media-player-container"> -->
    <article class="player-container flex space-between align-center">
      <section class="video-control-container flex direction-column align-center">
        <h3 v-if="playingSong">{{playingSong.title}}</h3>

        <input
          class="progress-bar"
          type="range"
          min="0"
          max="100"
          v-model="playerProgress"
          @input="songTimeUpdated"
          @mousedown="stopProgress"
          @mouseup="startProgress"
          @touchstart="stopProgress"
          @touchend="startProgress"
        />

        <section class="video-btns-container">
          <button class="next-song-btn video-btns" @click="newSongPlayed(prevSong, true)">
            <i class="fas fa-backward"></i>
          </button>
          <button v-if="isSongPlaying" @click="songToggled" class="play-song-btn video-btns">
            <i class="fas fa-pause"></i>
          </button>
          <button v-else @click="songToggled" class="play-song-btn video-btns">
            <i class="fas fa-play"></i>
          </button>
          <button class="prev-song-btn video-btns" @click="newSongPlayed(nextSong, true)">
            <i class="fas fa-forward"></i>
          </button>
        </section>

        <section class="audio-controls">
          <button class="video-btns" @click="toggleMute">
            <i v-if="isPlayerMuted" class="fas fa-volume-mute"></i>
            <i v-else class="fas fa-volume-up"></i>
          </button>
          <input type="range" min="0" max="100" v-model="playerVolume" @input="updatePlayerVolume" />
        </section>
      </section>

      <section class="video-sec">
        <img class="needle" src="../assets/img/needl1.png" />
        <div class="video-container ratio-square">
          <youtube
            ref="youtube"
            width="100%"
            height="100%"
            :player-vars="playerVars"
            @ready="initPlayer"
            @ended="newSongPlayed(nextSong, false)"
            @playing="youtubePlaying"
            @paused="youtubePaused"
          ></youtube>
        </div>
        <div class="vinyl"></div>
      </section>
    </article>
    <!-- </section> -->
  </article>
</template>

<script>
import socketService from "@/services/socket.service.js";
import { shuffleArray } from "@/services/util.service.js";
import songList from "@/cmps/song-list.vue";
import songAdd from "@/cmps/song-add.vue";
import chatRoom from "@/cmps/chat-room.vue";

export default {
  name: "stationDetails",
  data() {
    return {
      windowWidth: 0,
      mobileMode: false,
      playingSong: null,
      songDuration: 0,
      playerProgress: 0,
      playerVars: {
        controls: 0,
        disablekb: 1,
        playsinline: 1
      },
      playerVolume: 100,
      isPlayerMuted: false,
      isAddSongOpen: false,
      isSongPlaying: false,
      interval: null,
      chatIsOn: false,
      connectedUsers: []
    };
  },
  async created() {
    socketService.setup();
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
    await this.loadStation();
    socketService.emit("station join", {
      stationId: this.station._id,
      user: this.loggedinUser
    });
    socketService.on("player updatePlaylist", this.updatePlaylist);
    socketService.on("player pauseSong", this.pauseSong);
    socketService.on("player playSong", this.playSong);
    socketService.on("player updateSongTime", this.updateSongTime);
    socketService.on("player playNewSong", this.playNewSong);
  },
  destroyed() {
    socketService.off("playlist updatePlaylist", this.updatePlaylist);
    socketService.off("player pauseSong", this.pauseSong);
    socketService.off("player playSong", this.playSong);
    socketService.off("player updateSongTime", this.updateSongTime);
    socketService.off("player playNewSong", this.playNewSong);
    socketService.terminate();
    this.$store.commit({ type: "unsetStation" });
    window.removeEventListener("resize", this.handleResize);
  },
  computed: {
    station() {
      // console.log(this.$store.getters.currStation.createdBy.imgUrlimgUrl)
      // var station1 = await this.$store.getters.currStation.createdBy.imgUrl
      // console.log(station1)
      return this.$store.getters.currStation;
    },
    getUserImg() {
      return;
    },

    loggedinUser() {
      return this.$store.getters.loggedinUser;
    },
    isStationCreator() {
      return (
        !this.$store.getters.isGuestUser &&
        this.station.createdBy._id === this.loggedinUser._id
      );
    },
    likedCount() {
      return this.station.likedBy.length;
    },
    player() {
      return this.$refs.youtube.player;
    },
    playingSongId() {
      return this.playingSong ? this.playingSong.id : "";
    },
    nextSong() {
      var idx = this.station.songs.findIndex(
        song => song.id === this.playingSong.id
      );
      idx++;
      if (idx === this.station.songs.length) idx = 0;
      return this.station.songs[idx];
    },
    prevSong() {
      var idx = this.station.songs.findIndex(
        song => song.id === this.playingSong.id
      );
      idx--;
      if (idx < 0) idx = this.station.songs.length - 1;
      return this.station.songs[idx];
    },
    listOrAddBtn() {
      return this.isAddSongOpen ? "Return to playlist" : "Add a new song";
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
      await this.$store.dispatch({ type: "loadStation", stationId });
    },
    async youtubePlaying() {
      this.isSongPlaying = true;
      this.songDuration = await this.player.getDuration();
      this.startProgress();
    },
    youtubePaused() {
      this.isSongPlaying = false;
      this.stopProgress();
    },
    startProgress() {
      if (this.interval) clearInterval(this.interval);
      this.interval = setInterval(this.advancePlayerProgress, 1000);
    },
    stopProgress() {
      clearInterval(this.interval);
    },
    async advancePlayerProgress() {
      const songCurrTime = await this.player.getCurrentTime();
      this.playerProgress = (songCurrTime / this.songDuration) * 100;
    },
    async initPlayer() {
      socketService.emit("player firstSongRequsted");
      setTimeout(() => {
        if (!this.playingSong) {
          this.playNewSong();
        }
      }, 3000);
    },
    newSongPlayed(song, userInitiated) {
      this.playNewSong(song);
      socketService.emit("player newSongPlayed", { song, userInitiated });
    },
    toggleMute() {
      if (this.isPlayerMuted) this.player.unMute();
      else this.player.mute();
      this.isPlayerMuted = !this.isPlayerMuted;
    },
    updatePlayerVolume() {
      this.player.setVolume(this.playerVolume);
    },
    playNewSong(song) {
      this.playerProgress = 0;
      this.playingSong = song ? song : this.station.songs[0];
      this.player.loadVideoById(this.playingSong.id);
    },
    async songToggled() {
      const playerState = await this.player.getPlayerState();
      if (playerState === 1 /* PLAYING */) {
        this.pauseSong();
        socketService.emit("player songPaused");
      } else if (playerState === 2 /* PAUSED */) {
        this.playSong();
        socketService.emit("player songPlayed");
      }
    },
    pauseSong() {
      this.player.pauseVideo();
    },
    playSong() {
      this.player.playVideo();
    },
    songTimeUpdated() {
      const time = (this.playerProgress * this.songDuration) / 100;
      this.updateSongTime(time);
      socketService.emit("player songTimeUpdated", time);
    },
    updateSongTime(time) {
      this.player.seekTo(time);
    },
    async playlistUpdated(songs) {
      const playingSongIdx = songs.findIndex(
        song => song.id === this.playingSong.id
      );
      if (playingSongIdx === -1) this.newSongPlayed(this.nextSong, true);
      await this.$store.dispatch({ type: "updatePlaylist", songs });
      socketService.emit("player playlistUpdated", songs);
    },
    updatePlaylist(songs) {
      this.$store.commit({ type: "updatePlaylist", songs });
    },
    shuffleSongs() {
      const songs = JSON.parse(JSON.stringify(this.station.songs));
      shuffleArray(songs);
      this.playlistUpdated(songs);
    },
    toggleAddSong() {
      this.isAddSongOpen = !this.isAddSongOpen;
    },
    async addSong(song) {
      this.toggleAddSong();
      await this.$store.dispatch({ type: "addSong", song });
      socketService.emit("player playlistUpdated", this.station.songs);
    },
    toggleChat(value) {
      this.chatIsOn = !this.chatIsOn;
    },
    addLike() {
      this.$store.dispatch({ type: "addLike" });
    }
  },
  components: {
    songList,
    songAdd,
    chatRoom
  }
};
</script>