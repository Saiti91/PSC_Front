<template>
  <div v-if="show" class="modal-overlay">
    <div class="modal">
      <div class="modal-header">Supprimer l'appartement</div>
      <div class="modal-body">
        <p>Voulez-vous vraiment supprimer cet appartement ?</p>
      </div>
      <div class="modal-actions">
        <button class="ui button" @click="closeModal">Annuler</button>
        <button class="ui button red" @click="confirmDelete">Supprimer</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    show: Boolean,
    apartmentId: Number
  },
  emits: ['close', 'confirm'],
  methods: {
    closeModal() {
      this.$emit('close');
    },
    confirmDelete() {
      this.$emit('confirm', this.apartmentId);
    }
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.modal-header {
  font-size: 20px;
  margin-bottom: 10px;
}

.modal-body {
  margin-bottom: 20px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
}
</style>
