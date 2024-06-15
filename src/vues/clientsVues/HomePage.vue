<!-- MainComponent.vue -->
<script setup>
import HeaderComponent from '../../components/HeaderComponent.vue'
import FooterComponent from '../../components/FooterComponent.vue'
import 'semantic-ui-css/semantic.min.css';

</script>

<template>
  <div class="ui container full-width" style="min-height: 100vh; display: flex; flex-direction: column;">
    <HeaderComponent />
    <div class="spacer"></div>
    <h2>{{ $t('our-housing') }}</h2>
    <div class="ui special cards">
      <div class="card">
        <div class="blurring dimmable image">
          <div class="ui dimmer">
            <div class="content">
              <div class="center">
                <div class="ui inverted button">{{ $t('housing-details') }}</div>
              </div>
            </div>
          </div>
          <img src="" alt="">
        </div>
        <div class="content">
          <a class="header">variable de titre</a>
          <div class="meta">
            <span class="address">variable d'adresse</span>

          </div>
        </div>
        <div class="extra content">
          <a>
            <i class="users icon"></i>
            2 Members
          </a>
        </div>
      </div>

    <FooterComponent />
  </div>
  </div>
</template>


<style scoped>
.full-width {
  width: 100% !important;
}

.spacer {
  margin-top: 7%;
}

.flex-fill {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ui.footer .list {
  color: #ccc !important; /* Lighter grey for links to be less prominent than main text */
}
</style>
