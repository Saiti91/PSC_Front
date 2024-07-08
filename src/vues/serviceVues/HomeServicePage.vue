<!-- MainComponent.vue -->
<script setup>
import {onMounted, ref} from "vue";
import axiosInstance from "@/utils/Axios.js";
import HeaderComponent from '../../components/HeaderServiceVue.vue'
import FooterComponent from '../../components/FooterComponent.vue'
import 'semantic-ui-css/semantic.min.css';



</script>

<template>
  <div class="ui container full-width"
       style="min-height: 100vh; display: flex; flex-direction: column; overflow: hidden;">
    <HeaderComponent/>
    <div class="spacer"></div>

    <table class="ui very basic collapsing celled table">
      <thead>
      <tr>
        <th>Employee</th>
        <th class="lundi">Lundi</th>
        <th class="mardi">Mardi</th>
        <th class="mercredi">Mercredi</th>
        <th class="jeudi">Jeudi</th>
        <th class="vendredi">Vendredi</th>
        <th class="samedi">Samedi</th>
        <th class="dimanche">Dimanche</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td>
          <h4 class="ui image header">
            <img src="../../assets/Services/Avatar1.jpeg" class="ui mini rounded image">
            <div class="content">
              employé 1
            </div>
          </h4>
        </td>
        <td class="lundi">
          <div class="menage">10h 242 reuilli diderot, Paris</div>
          <div class="plomberie">15h 242 reuilli diderot, Paris</div>
        </td>
        <td class="mardi">
          <div>10h 242 reuilli diderot, Paris</div>
          <div>15h 242 reuilli diderot, Paris</div>
        </td>
        <td class="mercredi">
          <div>10h 242 reuilli diderot, Paris</div>
          <div>15h 242 reuilli diderot, Paris</div>
        </td>
        <td class="jeudi">
          <div>10h 242 reuilli diderot, Paris</div>
          <div>15h 242 reuilli diderot, Paris</div>
        </td>
        <td class="vendredi">
          <div>10h 242 reuilli diderot, Paris</div>
          <div>15h 242 reuilli diderot, Paris</div>
        </td>
        <td class="samedi">
          <div>10h 242 reuilli diderot, Paris</div>
          <div>15h 242 reuilli diderot, Paris</div>
        </td>
        <td class="dimanche">
          <div>10h 242 reuilli diderot, Paris</div>
          <div>15h 242 reuilli diderot, Paris</div>
        </td>

      </tr>
      </tbody>
    </table>


    <FooterComponent/>
  </div>
</template>

<style scoped>
.full-width {
  width: 100% !important;
}

.spacer {
  margin-top: 7%;
}

.menage {background-color: blue}
.plomberie {background-color: green}



















.ui.special.cards {
  width: 250px; /* Width of each card */
}

.scroll-button {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1;
}

.scroll-button.left {
  position: absolute;
  left: -40px;
}

.scroll-button.right {
  position: absolute;
  right: -40px;
}

.ui.footer .list {
  color: #ccc !important;
}
</style>
