<script setup>
import HeaderComponent from '../../components/HeaderComponent.vue'
import FooterComponent from '../../components/FooterComponent.vue'

</script>

<template>
  <div class="ui container full-width" style="min-height: 100vh; display: flex; flex-direction: column;">
    <HeaderComponent />
    <h2>{{ $t('catalogue') }}</h2>
    <div class="ui stackable five column grid">
      <div class="column" v-for="property in paginatedProperties" :key="property.id">
        <div class="ui card">
          <div class="image">
            <img :src="property.image" :alt="property.title">
          </div>
          <div class="content">
            <a class="header">{{ property.title }}</a>
            <div class="meta">
              <span class="location">{{ property.location }}</span>
            </div>
            <div class="extra content">
              <div class="ui star rating" :data-rating="property.stars" data-max-rating="5"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="ui center aligned basic segment">
      <button class="ui button" @click="loadMore">{{ $t('load-more') }}</button>
    </div>
    <FooterComponent />
  </div>
</template>

<style scoped>

</style>