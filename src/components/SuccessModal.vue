<template>
  <div v-if="show" class="modal-overlay">
    <div class="modal">
      <div class="modal-header">{{ title }}</div>
      <div class="modal-body">
        <p>{{ message }}</p>
        <div v-for="(value, key) in details" :key="key">
          <p><strong>{{ key }}:</strong> {{ value }}</p>
        </div>
      </div>
      <div class="modal-actions">
        <button class="ui button" @click="closeModal">Fermer</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    show: Boolean,
    title: String,
    message: String,
    details: Object
  },
  emits: ['close'],
  methods: {
    closeModal() {
      this.$emit('close');
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
