<template>
  <div class="n-popup-wrapper" :class="{ [`type-${ type }`]: true, transculent, 'touch-action-active': touchActionActive }" :data-popup-id="id" :style="{ ['--min-offset' as string]: minOffset, ['--max-offset' as string]: maxOffset, ['--mask-offset' as string]: maskOffset, ['--level' as string]: level, ['--popup-background-color-default' as string]: darkMode ? '#2e3337' : 'rgb(252, 252, 252)' }" @click="handleWrapperClick">
    <div class="wrapper-inner">
      <div ref="popupRef" class="popup" :class="{ 'fixed-height': fixedHeight === true || typeof fixedHeight === 'number', 'fixed-width': fixedWidth === true || typeof fixedWidth === 'number' }" :style="{ ['--fixed-height' as string]: typeof fixedHeight === 'number' ? `${ fixedHeight }px` : 'auto', ['--fixed-width' as string]: typeof fixedWidth === 'number' ? `${ fixedWidth }px` : 'auto' }" @scroll="handleScroll">
        <header ref="headerRef" @touchstart="onTouchstartHeader">
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
          <template v-if="type === 'frame'">
            <n-scrollbar>
              <component :is="popupVNode" v-for="(popupVNode, i) in slotNodes" :key="i" />
            </n-scrollbar>
          </template>
          <component :is="popupVNode" v-for="(popupVNode, i) in slotNodes" v-else :key="i" />
        </main>
      </div>
    </div>
    <div v-if="showScrollbar" class="scroll-thumb" :style="{ ['--thumb-height' as string]: `${ thumbHeight }px`, ['--scroll-thumb-pos' as string]: thumPos + 'px' }" />
  </div>
</template>


<script setup lang="ts">
import { ref, useSlots, onMounted, VNode, Ref, onUnmounted, computed } from 'vue';
import { NButton, NIcon, NScrollbar } from 'naive-ui';
import { CloseOutline } from '@vicons/ionicons5';
import isDarkMode from '../../util/isDarkMode';
import { checkScrollSpeed } from '../../util/scrollSpeed';
import useElementBBox from '../../util/elementBBox';
import useScrollHeight from '../../util/scrollHeight';

export interface NPopupWrappedDescriptor {
  id: string;
  slotNodes: Ref<VNode[]>;
  slotNodesTitle?: Ref<VNode[] | undefined>;
  slotNodesCloseBtn?: Ref<VNode[] | undefined>;
  slotNodesActions?: Ref<VNode[] | undefined>;
  slotNodesHeader?: Ref<VNode[] | undefined>;
  title?: string;
  level?: number;
  type: 'layer' | 'frame';
  fixedHeight?: boolean | number;
  fixedWidth?: boolean | number;
  transculent?: boolean;
  pullDownTolerance?: number;
}
const props = withDefaults(defineProps<NPopupWrappedDescriptor>(), {
  pullDownTolerance: 15
});
const emit = defineEmits(['close']);

const darkMode = isDarkMode();


const slots = useSlots();

const speed = ref<number>(0);


const minOffset = 20;
const maxOffset = 55;

const popupRef = ref<HTMLDivElement>();
const mainRef = ref<HTMLElement>();

const popupBBox = useElementBBox(popupRef);
const scrollHeight = useScrollHeight(popupRef);
const minScrollThumbHeight = 50;
const scrollPadding = 2;

const scrollPos = ref(0);

const thumbHeight = computed(() => {
  const height = Math.min(Math.max(minScrollThumbHeight, popupBBox.height * (popupBBox.height / scrollHeight.value)), popupBBox.height);
  return height;
});
const thumPos = computed(() => {
  const progress = (scrollPos.value) / (scrollHeight.value - popupBBox.height);
  return scrollPadding + (popupBBox.height - thumbHeight.value + minOffset - scrollPadding * 2) * progress;
});

// watchEffect(() => {
//   console.log(thumbHeight.value);
  
// });
// watchEffect(() => {
//   console.log(scrollPos.value);
  
// });



const handleWrapperClick = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (target.classList.contains('n-popup-wrapper')) {
    emit('close');
  }
};


const maskOffset = ref(0);
const calcMaskOffset = () => {
  const offsetMainY = mainRef.value?.getBoundingClientRect()?.y ?? 0;
  maskOffset.value = -offsetMainY + minOffset;
};
onMounted(() => {
  if (popupRef.value) {
    popupRef.value.addEventListener('scroll', calcMaskOffset);
  }
});
onMounted(calcMaskOffset);

const touchActionActive = ref(false);
let touchStartPos = 0;
const onTouchstartHeader = (event: TouchEvent) => {
  console.log('touchstart', event);
  touchActionActive.value = true;
  if (popupRef.value) {
    popupRef.value.scrollTop++;
  }

  touchStartPos = event.touches[0].screenY;
};
const onWindowTouchend = () => {
  touchActionActive.value = false;

  if (speed.value >= props.pullDownTolerance) {
    emit('close');
  }
};


let yDelta = 0;
const onWindowTouchmove = (event: TouchEvent) => {
  yDelta = event.touches[0].screenY - touchStartPos;
  //console.log('Y DELTA', event.touches[0].screenY - touchStartPos);
  
};
window.addEventListener('touchend', onWindowTouchend);
window.addEventListener('touchmove', onWindowTouchmove);
onUnmounted(() => {
  window.removeEventListener('touchend', onWindowTouchend);
  window.removeEventListener('touchmove', onWindowTouchmove);
});

let scrollSpeedStore = ((max = 5) => {
  return {
    state: ([] as number[]),
    push(speed: number) {
      this.state.push(speed);
      this.state = this.state.slice(-max);
    }
  };
})();

const showScrollbar = ref(false);
let scrollHideTimeout: ReturnType<typeof setTimeout>;
const handleScroll = (event: Event) => {
  if (popupRef.value) {
    if (touchActionActive.value) {
      const currSpeed = checkScrollSpeed(() => popupRef.value?.scrollTop ?? 0);

      scrollSpeedStore.push(currSpeed);
      speed.value = Math.abs(Math.min(...scrollSpeedStore.state)); 
    }
    scrollPos.value = popupRef.value?.scrollTop;
    showScrollbar.value = true;
    clearTimeout(scrollHideTimeout);
    scrollHideTimeout = setTimeout(() => {
      showScrollbar.value = false;
    }, 1000);
  }
};
</script>


<style scoped lang="scss">
.touch-action-active {
  user-select: none;
}
.n-popup-wrapper {
  position: absolute;
  pointer-events: all;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  overflow: hidden;

  // display: grid;
  // grid-template-columns: auto max-content;
  // grid-template-rows: 100%;
  .scroll-thumb {
    position: absolute;
    right: 2px;
    top: 0;
    width: 4px;
    border-radius: 2px;
    background-color: rgba(255, 255, 255, 0.5);

    top: max(0px, calc(var(--scroll-thumb-pos)));
    //--overscroll: min(0px, var(--scroll-thumb-pos));
    height: calc(var(--thumb-height) + min(0px, var(--scroll-thumb-pos)));
  }
  
  .wrapper-inner {
    grid-row: 1 / span 1;
    grid-column: 1 / span 2;
    /*height: 100%;
    overflow: scroll;
    --offset-y: calc(var(--max-offset) * 1px);
    position: relative;*/
    height: 100%;
    overflow: hidden;
    transition: all 0.5s;
    transform-origin: center 25vh;
    transform: scale(calc(1 - 0.1 * var(--level))) translateY(calc(-5% * var(--level) - 0px));
    .popup::-webkit-scrollbar {
      display: none;
    }
    .popup {
      
      scrollbar-width: none;
      -moz-scrollbar-width: none;
      --top: calc(1px * var(--min-offset) + var(--offset-top-safe-area));
      height: calc(100% - var(--top));
      overflow: scroll;
      position: relative;
      --border-radius: 12px;
      top: var(--top);
      
      border-radius: var(--border-radius) var(--border-radius) 0 0;
      display: grid;
      grid-template-rows: max-content auto;
      > header {
        user-select: none;
        margin-top: calc(1px * var(--max-offset));
        background-color: var(--popup-background-color, var(--popup-background-color-default));
        z-index: 2;
        padding: 15px 15px;
        border-radius: var(--border-radius) var(--border-radius) 0 0;
        position: sticky;
        top: 0;
        /*top: calc(1px * var(--min-offset));*/
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
        background-color: var(--popup-background-color, var(--popup-background-color-default));
        z-index: 1;
        /*clip-path: inset(max(calc(var(--mask-offset) * 1px) + var(--border-radius), 0px) 0 0 0);
        -webkit-clip-path: inset(max(calc(var(--mask-offset) * 1px) + var(--border-radius), 0px) 0 0 0);*/
        
      }
    }
  }
}
.n-popup-wrapper.type-layer {
  .popup.fixed-height {
    height: calc(var(--fixed-height) + 1px * var(--max-offset));
    max-height: calc(100% - var(--top));
    top: calc(100%);
    transform: translate(0, -100%);
  }
}
.n-popup-wrapper.type-frame {
  .wrapper-inner {
    overflow: hidden;
    
  }
  .popup {
    max-width: calc(100vw - 40px);
    max-height: calc(100vh - 40px);
    top: calc(40px / 2);
    left: calc(40px / 2);
    position: relative;
    border-radius: var(--border-radius);
    overflow: hidden;
    background-color: var(--popup-background-color, var(--popup-background-color-default));
    /*--offset: 20px;
    position: static;
    max-height: calc(100vh + 220px);
    max-width: calc(100vw - var(--offset) * 2);
    background-color: var(--popup-background-color);
    grid-template-rows: max-content auto;
    border-radius: var(--border-radius);
    overflow: scroll;
    clip-path: inset(0% 0% 0% 0% round 12px);
    -webkit-clip-path: inset(0% 0% 0% 0% round 12px);*/
    overflow: hidden;
    > header {
      margin-top: 0;
      top: 0;
    }
    > main {
      max-height: 100%;
      overflow: hidden;
    }
  }
  .popup.fixed-height {
    height: calc(var(--fixed-height));
    max-height: calc(100% - 40px);
    top: calc(50% - min(calc(100% - 40px), var(--fixed-height)) / 2);
  }
  .popup.fixed-width {
    width: var(--fixed-width);
    max-width: calc(100% - 40px);
    left: calc(50% - min(calc(100% - 40px), var(--fixed-width)) / 2)
  }
}

.n-popup-wrapper.transculent {
  .wrapper-inner {
    .popup {
      clip-path: inset(0 0 0 0 round 12px 12px 0 0);
      -webkit-clip-path: inset(0 0 0 0 round 12px 12px 0 0);
      > header {
        height: 0px;
        box-sizing: border-box;
        padding: 0;
        .area-title {
          padding: 15px 0 15px 15px;
        }
        .area-actions {
          
          padding: 15px 15px 15px 0;
        }
      }
       > main {
         clip-path: inset(0 0 0 0 round 12px 12px 0 0);
         -webkit-clip-path: inset(0 0 0 0 round 12px 12px 0 0);
       }
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
    transform: translate(0, 100%) !important;
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
    transform: scale(0.05) !important;
    opacity: 0;
  }
}
.popup-enter-to.type-frame, .popup-leave-from.type-frame {
  .popup {
    transform: scale(1) !important;
  }
}
</style>