<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    svg: string
    alt?: string
    emptyText?: string
  }>(),
  {
    alt: '',
    emptyText: '',
  }
)

const src = computed(() => {
  const encoded = encodeURIComponent(props.svg)
  return `data:image/svg+xml;charset=utf-8,${encoded}`
})
</script>

<template>
  <div class="svg-preview">
    <img v-if="svg" :src="src" :alt="alt" />
    <p v-else class="svg-preview__empty">{{ emptyText }}</p>
  </div>
</template>

<style scoped>
.svg-preview {
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow: auto;
}

.svg-preview img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  box-shadow: 0 12px 40px rgba(30, 46, 43, 0.16);
}

.svg-preview__empty {
  color: #88928e;
  font-size: 14px;
}
</style>
