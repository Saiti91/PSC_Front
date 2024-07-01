<script setup>
  import HeaderComponent from '../../components/HeaderComponent.vue';
  import FooterComponent from '../../components/FooterComponent.vue';
  import { useRouter } from 'vue-router';

  const router = useRouter();

  const navigateTo = (routeName) => {
    router.push({ name: routeName });
  };
</script>

<template>
  <div class="ui container full-width" style="min-height: 100vh; display: flex; flex-direction: column;">
    <HeaderComponent />
    <div class="spacer"></div>
    <div class="ui stackable grid" style="text-align: center;">
      <div class="sixteen wide column">
        <h1>{{ $t('join-us')}}</h1>
      </div>
      <div class="eight wide column">
        <div class="ui segment">
          <h2>{{ $t('wish-trust-property')}}</h2>
          <button class="ui primary button" @click="navigateTo('JoinHousing')">{{ $t('join-us-btn') }}</button>
        </div>
      </div>
      <div class="eight wide column">
        <div class="ui segment">
          <h2>{{ $t('wish-work-us') }}</h2>
          <button class="ui primary button" @click="navigateTo('JoinProvider')">{{ $t('join-us-btn') }}</button>
        </div>
      </div>
    </div>
    <FooterComponent />
  </div>
</template>

<style scoped>
  .spacer {
    margin-top: 20%;
  }

  .ui.segment {
    margin: 20px 0;
  }

  button.ui.primary.button {
    margin-top: 10px;
  }
</style>