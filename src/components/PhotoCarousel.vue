<template>
  <swiper :slides-per-view="1" navigation pagination>
    <swiper-slide v-for="(photo, index) in photos" :key="index">
      <img :src="photo" alt="Photo du bien" class="carousel-image"/>
    </swiper-slide>
  </swiper>
</template>

<script setup>
import {Swiper, SwiperSlide} from 'swiper/vue';
import 'swiper/swiper-bundle.css';

const props = defineProps({
  photos: {
    type: Array,
    required: true
  }
});
</script>

<style scoped>
.carousel-image {
  width: 100%;
  height: auto;
}
</style>
