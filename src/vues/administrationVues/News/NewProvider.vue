
          <script setup>
            import { ref, computed, onMounted } from 'vue';
            import HeaderComponent from '/src/components/HeaderAdmin.vue';
            import FooterComponent from '/src/components/FooterComponent.vue';
            import axiosInstance from '/src/utils/Axios.js';
            import 'semantic-ui-css/semantic.min.css';
            import { useRouter } from 'vue-router'

            const apartments = ref([]);
            const currentPage = ref(1);
            const pageSize = ref(10);
            const error = ref(null);
            const router = useRouter();
          </script>

          <template>
            <div class="ui container" style="min-height: 100vh; display: flex; flex-direction: column;">
              <HeaderComponent/>
              <div class="spacer"></div>
              <div class="ui basic segment flex-grow" style="flex: 1 0 auto; overflow: auto;">
                <div v-if="error" class="ui negative message">{{ error }}</div>
                <div v-else>
                  <table class="ui celled table">
                    <thead>
                    <tr>
                      <!-- TODO: Add table headers here -->
                    </tr>
                    </thead>
                    <tbody>
                    <div class="ui container" style="display: flex; justify-content: center; align-items: center; min-height: 100vh;">
                      <div class="ui form" style="width: 70%;">
                        <div class="field">
                          <div class="six wide field">
                            <label>Name</label>
                            <input type="text" placeholder="Company name">
                          </div>
                        </div>
                        <div class="field">
                        </div>
                        <div class="field">
                          <label>Adresse Postale</label>
                          <div class="fields">
                            <div class="two wide field">
                              <input type="number" placeholder="N°">
                            </div>
                            <div class="eight wide field">
                              <input type="text" name="shipping[address]" placeholder="Nom de rue">
                            </div>
                          </div>
                          <div class="fields">
                            <div class="two wide field">
                              <input type="number" placeholder="CP">
                            </div>
                            <div class="eight wide field">
                              <input type="text" name="shipping[address-2]" placeholder="Ville">
                            </div>

                          </div>
                          <div class="field">

                              <input type="text" name="shipping[address-2]" placeholder="Complément d'adresse">

                          </div>
                          <div class="field">
                            <label>E-mail</label>
                            <input type="email" placeholder="joe@schmoe.com">
                          </div>

                          <label>Numéro de téléphone</label>
                          <div class="fields">
                            <div class="two wide field">
                              <input type="text" value=+33>
                            </div>
                            <div class="field">
                              <input type="number" placeholder="Fixe">
                            </div>
                          </div>
                          <div class="fields">
                            <div class="two wide field">
                              <input type="text" value="+33">
                            </div>
                            <div class="field">
                              <input type="number" placeholder="portable">
                            </div>
                          </div>
                          <div class="field">
                            <label>Jour d'ouverture</label>

                            <div class="fields">
                              <label>DU</label>
                            <select class="ui fluid dropdown">
                              <option value="">Jour</option>
                              <option value="Lundi">Lundi</option>
                              <option value="Mardi">Mardi</option>
                              <option value="Mercredi">Mercredi</option>
                              <option value="Jeudi">Jeudi</option>
                              <option value="Vendredi">Vendredi</option>
                              <option value="Samedi">Samedi</option>
                              <option value="Dimanche">Dimanche</option>
                            </select>

                              <label>AU</label>
                            <select class="ui fluid dropdown">
                              <option value="">Jour</option>
                              <option value="Lundi">Lundi</option>
                              <option value="Mardi">Mardi</option>
                              <option value="Mercredi">Mercredi</option>
                              <option value="Jeudi">Jeudi</option>
                              <option value="Vendredi">Vendredi</option>
                              <option value="Samedi">Samedi</option>
                              <option value="Dimanche">Dimanche</option>
                            </select>
                            </div>

                          </div>

                        </div>
                      </div>



                    </div>


                    </tbody>
                  </table>
                  <!-- TODO: Add more UI here -->
                </div>
              </div>
              <FooterComponent/>

  </div>
</template>

<style scoped>
.spacer {
  margin-top: 12%;
}
</style>
