<template>
  <div class="ui inverted vertical footer segment">
    <div class="ui center aligned container">
      <!-- Add footer content here -->
      <div class="ui horizontal inverted small divided link list">
        <a class="item" href="#">Site Map</a>
        <a class="item" href="#">Contact Us</a>
        <a class="item" href="#">Terms and Conditions</a>
        <a class="item" href="#">Privacy Policy</a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ui.footer.segment {
  background-color: #333 !important; /* Dark background for the footer */
  padding: 1em 0; /* Add padding for visual space */
  color: #fff; /* Light text color for contrast */
  width: 100%; /* Ensure the footer spans the full width */
  position: relative;
  bottom: 0;
}
.ui.footer .list .item {
  color: #ccc !important; /* Lighter grey for links to be less prominent than main text */
}
</style>

