<template>
  <div class="n-popup-wrapper" :class="{ [`type-${ type }`]: true, transculent }" :data-popup-id="id" :style="{ ['--min-offset' as string]: minOffset, ['--max-offset' as string]: maxOffset, ['--mask-offset' as string]: maskOffset, ['--level' as string]: level }" @click="handleWrapperClick">
    <div class="wrapper-inner">
      <div ref="popupRef" class="popup">
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
import { ref, useSlots, onMounted, VNode, Ref } from 'vue';
import { NButton, NIcon } from 'naive-ui';
import { CloseOutline } from '@vicons/ionicons5';

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
  transculent?: boolean;
}
defineProps<NPopupWrappedDescriptor>();
const emit = defineEmits(['close']);


const slots = useSlots();


const minOffset = 20;
const maxOffset = 55;

const popupRef = ref<HTMLDivElement | null>(null);
const mainRef = ref<HTMLElement | null>();


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
    /*height: 100%;
    overflow: scroll;
    --offset-y: calc(var(--max-offset) * 1px);
    position: relative;*/
    height: 100%;
    overflow: hidden;
    transition: all 0.5s;
    transform-origin: center 25vh;
    transform: scale(calc(1 - 0.1 * var(--level))) translateY(calc(-5% * var(--level) - 0px));
    .popup {
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
        margin-top: calc(1px * var(--max-offset));
        background-color: var(--popup-background-color);
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
        background-color: var(--popup-background-color);
        z-index: 1;
        /*clip-path: inset(max(calc(var(--mask-offset) * 1px) + var(--border-radius), 0px) 0 0 0);
        -webkit-clip-path: inset(max(calc(var(--mask-offset) * 1px) + var(--border-radius), 0px) 0 0 0);*/
        
      }
    }
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
    background-color: var(--popup-background-color);
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
    > header, > main {
      
    }
    > header {
      margin-top: 0;
      top: 0;
    }
    > main {
      
    }
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
    transform: scale(0.05);
    opacity: 0;
  }
}
.popup-enter-to.type-frame, .popup-leave-from.type-frame {
  .popup {
    transform: scale(1);
  }
}
</style>