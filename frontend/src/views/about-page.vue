<template>
  <article class="about-page content-container">
    <h2>About Us</h2>
    <ul class="creators-list">
      <li
        v-for="(creator, index) in this.creators"
        :key="creator._id"
        :style="[index%2===0 ? {'backgroundColor':'rgb(109, 82, 113)'} :  {'backgroundColor':'#e9eaea'}]"
      >
        <img class="ratio-square" :src="creator.imgUrl" />
        <div class="text-about-container">
          <h3>{{creator.name }}</h3>
          <p>{{creator.about }}</p>
          <p>Hobbies: {{creator.hobbies }}</p>
          <section class="social-sec">
            <a
              v-bind:href="creator.linkedinUrl"
              :style="[index%2===0 ? {'color':'white'} :  {'color':'rgb(109, 82, 113)'}]"
            >
              <i class="fab fa-linkedin"></i>
            </a>
            <a
              v-bind:href="creator.facebookUrl"
              :style="[index%2===0 ? {'color':'white'} :  {'color':'rgb(109, 82, 113)'}]"
            >
              <i class="fab fa-facebook-square"></i>
            </a>
          </section>
        </div>
      </li>
    </ul>
  </article>
</template>

<script>
export default {
  name: "aboutPage",
  data() {
    return {
      creators: [
        {
          name: "Rotem Yehiel",
          _id: "wz0r7hntqyvcilduhxlm",
          about:
            "A full stack web developer. Holder of a B.Sc. Technology Management -Information Systems Management from HIT Israel. Experience with Vue.js ,React ,JavaScript ,HTML ,CSS ,SASS ,Node.js and Mongo.db.",
          hobbies: "Backing, traveling and aesthetics.",
          imgUrl:
            "https://res.cloudinary.com/dpjz7lloq/image/upload/v1585601840/wz0r7hntqyvcilduhxlm.jpg",
          linkedinUrl: "https://www.linkedin.com/in/rotem-yehiel-143608163/",
          facebookUrl: "https://www.facebook.com/rotem.yehi"
        },
        {
          name: "Kareene Komet",
          _id: "wz0r5hntqyvcilduhxlm",
          about:
            "Full Stack software developer and ex-UNIX system administrator. Graduate of “Bismach” IDF programming course (AKA: “Mamram”) as well as MisterBit Coding Academy. Experience with: Vue.js, React, Angular, Javascript, HTML, CSS, SASS, Node.js, Mongo.db.",
          hobbies: "Nature, Knitting",
          imgUrl: "https://res.cloudinary.com/dpjz7lloq/image/upload/v1585081829/qwvv4sn92jgnijtob2ze.jpg",
          linkedinUrl: "https://www.linkedin.com/in/kareene-komet-975ba23/",
          facebookUrl: "https://www.facebook.com/kareene.komet"
        },
        {
          name: "Limor Abaev",
          _id: "wz0r2hntqyvcilduhxlm",
          about:
            "A full stack web developer. Holder of a B.Sc. Technology Management -Information Systems Management from HIT Israel. Experience with Vue.js ,React ,JavaScript ,HTML ,CSS ,SASS ,Node.js and Mongo.db.",
          hobbies: "Backing, traveling and aesthetics.",
          imgUrl: "https://res.cloudinary.com/dpjz7lloq/image/upload/v1585598647/chpd4kengxgfitziyshw.jpg",
          linkedinUrl: "https://www.linkedin.com/in/rotem-yehiel-143608163/",
          facebookUrl: "https://www.facebook.com/rotem.yehi"
        }
      ]
    };
  },
  computed: {
    loggedinUser() {
      return this.$store.getters.loggedinUser;
    },
    color() {
      return "#e9eaea";
    }
  }
};
</script>
