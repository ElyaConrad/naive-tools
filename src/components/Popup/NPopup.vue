<template>
  <div class="n-popup__root">
    <div v-if="trigger !== 'manual'" class="trigger-wrapper" @click="handleTriggerClick" @mouseenter="handleTriggerMouseenter">
      <slot name="trigger" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSlots, inject, computed, watch, h, watchEffect } from 'vue';
import { nanoid } from 'nanoid';
import { NH2 } from 'naive-ui';
import { VueSlot } from './NPopupProvider.vue';

const popupId = nanoid();


const props = withDefaults(defineProps<{
  trigger: 'click' | 'hover' | 'manual';
  title?: string;
  show?: boolean;
  type?: 'layer' | 'frame';
  transculent?: boolean;
  fixedHeight?: boolean | number;
  fixedWidth?: boolean | number;
}>(), {
  trigger: 'click',
  type: 'layer',
  title: undefined,
  transculent: false,
  fixedHeight: false,
  fixedWidth: false
});
const emit = defineEmits(['update:show']);

const slots = useSlots();

const showPopup = inject<(opts: { id: string, type: 'layer' | 'frame', transculent: boolean, fixedHeight: boolean | number, fixedWidth: boolean | number, slot: VueSlot, slotTitle?: VueSlot, slotActions?: VueSlot, slotCloseBtn?: VueSlot, slotHeader?: VueSlot }) => void>('showPopup');
const leavePopup = inject<(id: string) => void>('leavePopup');
const getPopupIndex = inject<(id: string) => number>('getPopupIndex');

const popupIsVisible = computed<boolean>({
  get() {
    if (getPopupIndex) {
      return getPopupIndex(popupId) >= 0;
    }
    else {
      return false;
    }
  },
  set(newState) {
    if (newState !== popupIsVisible.value && slots.default) {
      if (newState) {
        if (showPopup) {
          const slotTitle = slots.title ? slots.title : props.title ? (() => {
            return [
              h(NH2, { innerHTML: props.title })
            ];
          }) : undefined;
          
          showPopup({
            id: popupId,
            type: props.type,
            transculent: props.transculent,
            fixedHeight: props.fixedHeight,
            fixedWidth: props.fixedWidth,
            slot: slots.default,
            slotTitle,
            slotActions: slots.actions,
            slotCloseBtn: slots['close-btn'],
            slotHeader: slots.header
          });
        }
      }
      else if (leavePopup) {
        leavePopup(popupId);
      }
    }
  }
});


watch(popupIsVisible, (newState: boolean) => {
  emit('update:show', newState);
});
watch(() => props.show, newShow => {
  if (props.show !== popupIsVisible.value) {
    popupIsVisible.value = !!props.show;
  }
});



const handleTriggerClick = () => {
  if (props.trigger === 'click') {
    popupIsVisible.value = true;
  }
};
const handleTriggerMouseenter = () => {
  if (props.trigger === 'hover') {
    popupIsVisible.value = true;
  }
  
};

const destroy = () => {
  popupIsVisible.value = false;
}


defineExpose({
  destroy
});
</script>


<style scoped lang="scss">
.n-popup__root {

}
.trigger-wrapper {
  display: inline-block;
}
</style>
