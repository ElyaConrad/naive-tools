<template>
  <div class="n-popup-wrapper" :class="{ [`type-${ type }`]: true }" :data-popup-id="id" :style="{ ['--max-offset' as string]: maxOffset, ['--background-color' as string]: customTheme[darkMode ? 'dark' : 'light'].backgroundColor, ['--header-sticky-offset' as string]: headerStickyOffset, ['--mask-offset' as string]: maskOffset, ['--level' as string]: level, ['--real-scroll-y' as string]: realScrollY }" @click="handleWrapperClick">
    <div ref="wrapperRef" class="wrapper-inner">
      <div ref="frameRef" class="popup">
        <header ref="headerRef">
          <slot v-if="slots.header" name="header" />
          <template v-else>
            <section class="area-title">
              <slot v-if="slots.title" name="title" />
            </section>
            <section class="area-actions">
              <template v-if="slots.actions">
                <div v-for="(actionVNode, i) in slots.actions()" :key="i" class="action">
                  <component :is="actionVNode" />
                </div>
              </template>
              <div class="action actions-close" @click="emit('close')">
                <slot v-if="slots['close-btn']" name="close-btn" />
                <n-button v-else tertiary circle size="medium">
                  <template #icon>
                    <n-icon>
                      <close-outline />
                    </n-icon>
                  </template>
                </n-button>
              </div>
            </section>
          </template>
        </header>
        <main ref="mainRef">
          <component :is="popupVNode" v-for="(popupVNode, i) in slotNodes" :key="i" />
        </main>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, useSlots, nextTick, watch, onMounted, VNode } from 'vue';
import * as customTheme from '../../theme';
import isDarkMode from '../../util/isDarkMode';
import { NButton, NIcon } from 'naive-ui';
import { CloseOutline } from '@vicons/ionicons5';

export interface NPopupWrappedDescriptor {
  id: string;
  slotNodes: VNode[];
  slotNodesTitle?: VNode[];
  slotNodesCloseBtn?: VNode[];
  slotNodesActions?: VNode[];
  slotNodesHeader?: VNode[];
  title?: string;
  level?: number;
  type: 'layer' | 'frame';
}
defineProps<NPopupWrappedDescriptor>();
const emit = defineEmits(['close']);

const slots = useSlots();


const minOffset = 10;
const maxOffset = 55;

const wrapperRef = ref<HTMLDivElement | null>(null);
const frameRef = ref<HTMLDivElement | null>(null);
const headerRef = ref<HTMLHeadingElement | null>(null);
const mainRef = ref<HTMLElement | null>();

const darkMode = isDarkMode();

const handleWrapperClick = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (target.classList.contains('n-popup-wrapper')) {
    emit('close');
  }
};

const headerStickyOffset = ref(0);
const calcHeaderStickyOffset = () => {
  headerStickyOffset.value = 0;
  nextTick(() => {
    const offsetY = headerRef.value?.getBoundingClientRect()?.y ?? 0;
    headerStickyOffset.value = -offsetY + minOffset;
  });
};
const maskOffset = ref(0);
const calcMaskOffset = () => {
  const offsetMainY = mainRef.value?.getBoundingClientRect()?.y ?? 0;
  maskOffset.value = -offsetMainY + minOffset;
};
const realScrollY = ref(0);
watch(realScrollY, (scrollTop: number) => {
  if (wrapperRef.value) wrapperRef.value.scrollTop = scrollTop;
});
/*const scrollProxy = (event: Event, deltaY: number) => {
  if (wrapperRef.value && frameRef.value) {
    const maxScrollPos = frameRef.value?.offsetTop + frameRef.value?.offsetHeight - wrapperRef.value?.offsetHeight;
    realScrollY.value = Math.min(wrapperRef.value.scrollTop + deltaY, maxScrollPos);
    event?.preventDefault();
  }
};*/
onMounted(() => {
  if (wrapperRef.value) {
    wrapperRef.value.addEventListener('scroll', calcHeaderStickyOffset);
    wrapperRef.value.addEventListener('scroll', calcMaskOffset);


    wrapperRef.value.addEventListener('wheel', () => {
      //scrollProxy(event, event.deltaY);
    });

  }
});
onMounted(calcHeaderStickyOffset);
onMounted(calcMaskOffset);
</script>


<style scoped lang="scss">
.n-popup-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  
  .wrapper-inner {
    height: 100%;
    overflow: scroll;
    --offset-y: calc(var(--max-offset) * 1px);
    position: relative;
    transition: all 0.5s;
    transform-origin: center 25vh;
    transform: scale(calc(1 - 0.1 * var(--level))) translateY(calc(-5% * var(--level)));
  }
  .popup {
    
    position: absolute;
    min-height: calc(100% - var(--offset-y));
    top: var(--offset-y);
    left: 0;
    width: 100%;
    --border-radius: 12px;
    display: grid;
    grid-template-rows: max-content auto;
    
    
    > header {
      border-radius: var(--border-radius) var(--border-radius) 0 0;
      position: relative;
      transform: translateY(max(calc(1px * var(--header-sticky-offset)), 0px));
      background-color: var(--background-color);
      z-index: 2;
      padding: 15px 15px;
      display: grid;
      grid-template-columns: auto max-content;
      .area-title {
        text-align: left;
        ::v-deep(h2) {
          margin: 0;
          font-weight: 600;
        }
      }
      .area-actions {
        
        > .action {
          display: inline-block;
          vertical-align: middle;
          
          
        }
      }
    }
    > main {
      background-color: var(--background-color);
      clip-path: inset(max(calc(var(--mask-offset) * 1px) + var(--border-radius), 0px) 0 0 0);
      z-index: 1;
    }
    
  }
}
.n-popup-wrapper.type-frame {
  .wrapper-inner {
    display: grid;
    grid-template-columns: auto max-content auto;
    grid-template-rows: auto max-content auto;
    overflow: hidden;
  }
  .popup {
    overflow: hidden;
    grid-row: 2 / span 1;
    grid-column: 2 / span 1;
    --offset: 20px;
    position: static;
    max-height: calc(100vh - var(--offset) * 2);
    max-width: calc(100vw - var(--offset) * 2);
    background-color: var(--background-color);
    grid-template-rows: max-content auto;
    border-radius: var(--border-radius);
    > header, > main {
      background-color: transparent;
    }
    > header {

    }
    > main {
      overflow: scroll;
    }
  }
}
</style>

<style scoped lang="scss">
.popup-enter-active, .popup-leave-active,
.popup-enter-active .popup, .popup-leave-active .popup {
  transition: all var(--transition-duration) ease;
}
.popup-enter-from, .popup-leave-to {
  background-color: rgba(0, 0, 0, 0) !important;
  .popup {
    transform: translate(0, 100%);
  }
}
.popup-enter-active.type-frame, .popup-leave-active.type-frame {
   transition-duration: calc(var(--transition-duration) * 1.25);
  .popup {
    transition-timing-function: cubic-bezier(.35,-0.01,.29,1.24);
    transition-duration: calc(var(--transition-duration) * 1.25);
  }
}
.popup-enter-from.type-frame, .popup-leave-to.type-frame {
  .popup {
    transform: scale(0);
  }
}
.popup-enter-to.type-frame, .popup-leave-from.type-frame {
  .popup {
    transform: scale(1);
  }
}
</style>