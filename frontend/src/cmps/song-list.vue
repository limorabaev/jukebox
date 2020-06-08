<template>
  <section v-if="songs" class="song-list">
    <Container class="container-of-song-list" @drop="onDrop" :remove-on-drop-out="true">
      <Draggable v-for="song in songsCopy" :key="song.id">
        <article class="song-in-list" :class="{ playing: song.id === playingSongId }">
          <section class="left-sec-song-line">
            <i class="far fa-play-circle play-on-img" v-if="playingSongId" @click.stop="playSong(song)"></i> 
            <img :src="song.imgUrl" />
            <div class="inner-txt-song">
              <p>{{song.title}}</p>
              <p class="song-add-by-name">Added by: {{song.addedBy.fullName}}</p>
            </div>
          </section>
          <transition name="fade">
            <img class="playing-song-gif" v-if="song.id === playingSongId && isSongPlaying" src="../../public/img/eq-play.gif" />
          </transition>
          <!-- <img class="playing-song-gif" v-else-if="song.id === playingSongId && !isSongPlaying" src="../../public/img/eq-pause.gif" /> -->
          <!-- <button class="fas fa-play" v-if="playingSongId" @click.stop="playSong(song.id)"></button> -->

          <!--<button class="remove-song-btn" @click.stop="removeSong(song.id)">X</button>-->
        </article>
      </Draggable>
    </Container>
  </section>
</template>

<script>
import { Container, Draggable } from "vue-smooth-dnd";
import { applyDrag } from "@/services/util.service.js";

export default {
  name: 'songList',
  props: {
    songs: Array,
    playingSongId: String,
    isSongPlaying: Boolean
  },
  data() {
    return {
      songsCopy: JSON.parse(JSON.stringify(this.songs))
    };
  },
  watch: {
    songs() {
      this.songsCopy = JSON.parse(JSON.stringify(this.songs));
    }
  },
  methods: {
    onDrop(dropResult) {
      const songs = applyDrag(this.songsCopy, dropResult);
      this.$emit('update-playlist', songs);
    },
    playSong(songId) {
      this.$emit('play-song', songId);
    },
    removeSong(songId) {
      this.$emit('remove-song', songId);
    }
  },
  components: { 
    Container, 
    Draggable
  }
};
</script>