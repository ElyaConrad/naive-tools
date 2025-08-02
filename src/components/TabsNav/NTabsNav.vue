<template>
  <div
    class="n-tabs-nav"
    :class="{ [`pointer-${pointer}`]: true, vertical }"
    :style="{ ['--tabs-count' as string]: childs.length, ['--active-tab-index' as string]: activeTabItemIndex, ...themeCSSVars, ['--primary-color-shape' as string]: `rgba(${ colorToString(hexToRgba(theme.primaryColor, 0.1)) })`, ['--text-color-unfocus' as string]: `rgba(${ colorToString(hexToRgba(theme.textColorBase, 0.7)) })` }"
  >
    <div class="inner">
      <div v-if="pointer !== 'none'" class="pointer-wrapper">
        <div class="pointer" />
      </div>
      <div ref="innerRef" class="items-wrapper">
        <slot />
      </div>
    </div>
    <div v-if="slots.suffix" class="suffix-wrapper">
      <slot name="suffix" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { hexToRgba, colorToString } from "colors-convert";
import { useThemeVars } from "naive-ui";
import {
  ref,
  computed,
  onMounted,
  provide,
  useSlots,
  VNode,
  RendererNode,
  RendererElement,
  toRef,
  watchEffect,
} from "vue";
import { NTabItemNavProps } from "./NTabItemNav.vue";
import { toCSSVars } from "../../util/helpers";

type NTabNavProps = {
  value: string;
  pointer?: "normal" | "opposite" | "none";
  shape?: boolean;
  vertical?: boolean;
};

const props = withDefaults(defineProps<NTabNavProps>(), {
  pointer: "normal",
  shape: false,
  vertical: true,
});
const emit = defineEmits(["update:value"]);

const slots = useSlots();

const theme = useThemeVars();

const innerRef = ref<HTMLDivElement | null>(null);

const shape = toRef(props, "shape");
provide("shape", shape);
const pointer = toRef(props, "pointer");
provide("pointer", pointer);
const vertical = toRef(props, "vertical");
provide("vertical", vertical);

const tabItems = computed(() => {
  if (slots.default) {
    return slots.default() as VNode<
      RendererNode,
      RendererElement,
      NTabItemNavProps
    >[];
  } else {
    return [];
  }
});

const activeTabItemName = computed({
  get() {
    return props.value;
  },
  set(name: string) {

    emit("update:value", name);
  },
});

const childs = computed(
  () =>
    Array.from(tabItems.value[0].children as any) as VNode<
      RendererNode,
      RendererElement,
      NTabItemNavProps
    >[]
);

const activeTabItemIndex = computed(() => {
  const activeTabItem = childs.value.find(
    (child: any) => child.props?.name === activeTabItemName.value
  );
  
  if (activeTabItem) {
    return childs.value.indexOf(activeTabItem);
  } else {
    return -1;
  }
});
provide("activeTabItemName", activeTabItemName);

const themeCSSVars = computed(() => {
  // @ts-expect-error type is okay
  return toCSSVars(theme.value);
});
</script>

<style scoped lang="scss">
.n-tabs-nav {
  display: flex;
  flex-direction: column;
  > .inner {
    display: grid;
    grid-template-columns: auto;
    grid-template-rows: max-content max-content;
    .items-wrapper {
      display: grid;
      grid-template-rows: auto;
      grid-template-columns: repeat(var(--tabs-count), 1fr);
      padding: 0 0 0;
    }
    .pointer-wrapper {
      width: 100%;
      .pointer {
        --width: calc(100% / var(--tabs-count));
        width: var(--width);
        position: relative;
        left: calc(var(--active-tab-index) * var(--width));
        height: 2px;
        background-color: var(--primary-color);
        transition: all 0.6s;
      }
    }
  }
  > .suffix-wrapper {
    flex: 1;
  }
}
.n-tabs-nav.pointer-top,
.n-tabs-nav.pointer-bottom {
}
.n-tabs-nav:not(.vertical) {
}
.n-tabs-nav.vertical {
  height: 100%;
  > .inner {
    grid-template-rows: auto;
    .items-wrapper {
      display: grid;
      grid-template-columns: auto;
      grid-template-rows: repeat(var(--tabs-count), 1fr);
      padding: 0 0 0;
    }
    .pointer-wrapper {
      width: auto;
      height: 100%;
      .pointer {
        --height: calc(100% / var(--tabs-count));
        height: var(--height);
        position: relative;
        left: 0px;
        top: calc(var(--active-tab-index) * var(--width));
        width: 2px;
        background-color: var(--primary-color);
        transition: all 0.6s;
      }
    }
  }
}

.n-tabs-nav:not(.vertical).pointer-opposite {
  > .inner {
    .pointer-wrapper {
      order: 2;
    }
    .items-wrapper {
      order: 1;
    }
  }
}
.n-tabs-nav.vertical.pointer-normal {
  > .inner {
    grid-template-columns: auto max-content;
    .pointer-wrapper {
      order: 2;
    }
    .items-wrapper {
      order: 1;
    }
  }
}
.n-tabs-nav.vertical.pointer-opposite {
  > .inner {
    grid-template-columns: max-content auto;
  }
}

.n-tabs-nav:not(.vertical).pointer-normal {
  border-top: 1px solid var(--divider-color);
}
.n-tabs-nav:not(.vertical).pointer-opposite {
  border-bottom: 1px solid var(--divider-color);
}

.n-tabs-nav.vertical.pointer-normal {
  border-right: 1px solid var(--divider-color);
}
.n-tabs-nav.vertical.pointer-opposite {
  border-left: 1px solid var(--divider-color);
}
</style>
