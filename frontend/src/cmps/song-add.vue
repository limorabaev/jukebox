<template>
    <article class="song-add">
        <!-- <h2>Add a great song</h2> -->
        <form @submit.prevent="searchForSongs">
            <input class="input-with-btn" type="text" v-model="searchStr" />
            <button class="button-of-input buttons">Search</button>
        </form>


        <section class="songs-list-in-search" v-if="songSearchResults.length && isSearchOpen">
            <ul>
                <li class = "done" @click = "closeSearch" v-if = "isEditPage">Done</li>
                <li v-for="song in songSearchResults" :key="song.id">
                    <img :src="song.imgUrl" />
                    <p>{{song.title}}</p>
                    <button class="fas fa-plus" @click.stop="addSong(song)"></button>
                </li>
            </ul>

        
            <!-- <select  class="songs-list-in-search" v-if="songSearchResults.length" v-model="selected">
             

                <option v-for="song in songSearchResults" :key="song.id">
                    <img :src="song.imgUrl" />
                    <p>{{song.title}}</p>
                    <button class="fas fa-plus" @click.stop="addSong(song)"></button>
                </option>
                
            </select> -->
   

            
        </section>
    </article>
</template>

<script>
import youtubeService from '@/services/youtube.service.js'

export default {
    name: 'songAdd',
    data() {
        return {
            searchStr: '',
            songSearchResults: [],
            isSearchOpen : false,
            isEditPage : false
        }
    },

    created(){
        if(this.$route.name === 'stationEdit') this.isEditPage = true;
        console.log(this.$route)
    },

    methods: {
        async searchForSongs() {
            this.songSearchResults = await youtubeService.getVideoSearchResults(this.searchStr);
            this.isSearchOpen = true
        },

        closeSearch(){
            this.isSearchOpen = false
        },

        addSong(song) {
            this.$emit('add-song', song);
            const idx = this.songSearchResults.findIndex(currSong => currSong.id === song.id);
            if (idx !== -1) this.songSearchResults.splice(idx, 1);
        },
      
    }
}
</script>