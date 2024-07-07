<template>
  <div class="ui inverted vertical footer segment">
    <div class="ui horizontal inverted small divided link list">
      <a class="item" href="#">{{ $t('site_Map') }}</a>
      <a class="item" href="#">{{ $t('contact') }}</a>
      <a class="item" href="#">{{ $t('terms_and_Conditions') }}</a>
      <a class="item" href="#">{{ $t('privacy_Policy') }}</a>
    </div>
  </div>
</template>

<style scoped>
.ui.footer.segment {
  background-color: #333 !important; /* Dark background for the footer */
  padding: 1em 0; /* Add padding for visual space */
  color: #fff; /* Light text color for contrast */
  width: 100%;
  position: fixed; /* Fixe le footer en bas */
  bottom: 0;
  left: 0; /* Ensure the footer starts from the left edge */
  right: 0;
  z-index: 1000; /* Assurez-vous que le footer est au-dessus des autres éléments */
  text-align: center; /* Center the text */
}

.ui.footer .list {
  display: inline-block; /* Center the list items */
}

.ui.footer .list .item {
  color: #ccc !important; /* Lighter grey for links to be less prominent than main text */
  padding: 0 10px; /* Add some padding for spacing */
}
</style>
