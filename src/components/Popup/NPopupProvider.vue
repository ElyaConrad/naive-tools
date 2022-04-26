<template>
  <div class="n-popup-provider" :class="{ 'dark-mode': darkMode }">
    <div class="app-wrapper" :class="{ 'unfocused': popups.length >= 1 }">
      <slot name="default" />
    </div>
    <div class="popups-wrapper">
      <transition-group name="popup">
        <n-popup-wrapper v-for="({ slotNodes, slotNodesTitle, slotNodesActions, slotNodesCloseBtn, slotNodesHeader, id, type }, i) in popups" :id="id" :key="i" :level="popups.length - 1 - i" :type="type" :slot-nodes="slotNodes" :slot-nodes-title="slotNodesTitle" :slot-nodes-actions="slotNodesActions" :slot-nodes-close-btn="slotNodesCloseBtn" :slot-nodes-header="slotNodesHeader" @close="leavePopup(id)">
          <template v-if="slotNodesTitle" #title>
            <component :is="slotNode" v-for="(slotNode, n) in slotNodesTitle" :key="n" />
          </template>
          <template v-if="slotNodesActions" #actions>
            <component :is="slotNode" v-for="(slotNode, n) in slotNodesActions" :key="n" />
          </template>
          <template v-if="slotNodesCloseBtn" #close-btn>
            <component :is="slotNode" v-for="(slotNode, n) in slotNodesCloseBtn" :key="n" />
          </template>
          <template v-if="slotNodesHeader" #header>
            <component :is="slotNode" v-for="(slotNode, n) in slotNodesHeader" :key="n" />
          </template>
        </n-popup-wrapper>
      </transition-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, provide, VNode } from 'vue';
import isDarkMode from '../../util/isDarkMode';
import NPopupWrapper, { NPopupWrappedDescriptor } from './NPopupWrapper.vue';

export type VueSlot = () => VNode[];

const darkMode = isDarkMode();

const popups = ref<NPopupWrappedDescriptor[]>([]);
function showPopup(id: string, type: 'layer' | 'frame', slot: VueSlot, slotTitle?: VueSlot, slotActions?: VueSlot, slotCloseBtn?: VueSlot, slotHeader?: VueSlot) {
  popups.value = [
    ...popups.value,
    {
      id,
      slotNodes: slot(),
      slotNodesTitle: slotTitle ? slotTitle() : undefined,
      slotNodesActions: slotActions ? slotActions() : undefined,
      slotNodesCloseBtn: slotCloseBtn ? slotCloseBtn() : undefined,
      slotNodesHeader: slotHeader ? slotHeader() : undefined,
      type
    },

  ];
  
}
function leavePopup(popupId: string) {
  popups.value = popups.value.filter(({ id }) => id !== popupId);
}
function getPopupIndex(popupId: string) {
  const popupDescriptor = popups.value.find(({ id }) => id === popupId);
  return popupDescriptor ? popups.value.indexOf(popupDescriptor) : -1;
}
provide('showPopup', showPopup);
provide('leavePopup', leavePopup);
provide('getPopupIndex', getPopupIndex);


</script>
<style scoped lang="scss">
.n-popup-provider {
  position: relative;
  --transition-duration: .4s;
  height: 100%;
  .app-wrapper {
    height: 100%;
    transform-origin: center center;
    transition: transform calc(1.2 * var(--transition-duration)), filter var(--transition-duration);
  }
  .app-wrapper.unfocused {
    filter: brightness(0.9);
    border-radius: 10px;
    overflow: hidden;
    transform: scale(0.9) translate(0, -3%);
  }
  .popups-wrapper {
    
  }
}
.n-popup-provider.dark-mode {
  .app-wrapper.unfocused {
    filter: brightness(1.2);
  }
}
</style>