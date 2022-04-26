<template>
  <div class="n-tab-item-nav" :class="{ active: isActive, shape, vertical }" @click="handleClick">
    <div class="inner">
      <div class="icon-wrapper">
        <slot name="icon" />
      </div>
      <div class="label-wrapper">
        <div class="label">
          <slot name="default" />
        </div>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { Ref, inject, computed } from 'vue';

export type NTabItemNavProps = {
  name: string;
};

const props = defineProps<NTabItemNavProps>();
const shape = inject('shape');
const vertical = inject('vertical');

const activeTabItemName = inject('activeTabItemName') as Ref<string>;

const isActive = computed(() => activeTabItemName.value === props.name);

const handleClick = () => {
  activeTabItemName.value = props.name;
};

</script>

<style scoped lang="scss">
.n-tab-item-nav {
  display: inline-block;
  color: var(--text-color-base);
  cursor: pointer;
  --icon-size: 24px;
  --text-size: 1em;
  > .inner {
    display: grid;
    grid-template-columns: auto;
    grid-template-rows: max-content max-content;
    grid-gap: 3px;
    background-color: transparent;
    transition: all 0.5s;
    border-radius: var(--border-radius);
    padding: 5px;
  }
  .icon-wrapper {
    padding: 0;
    height: calc(var(--icon-size) + 0px);
    padding: 0 0;
    order: 1;
    text-align: center;
    font-size: 0rem;
    ::v-deep(> *) {
      font-size: var(--icon-size);
    }
    
  }
  .label-wrapper {
    font-size: var(--text-size);
    order: 2;
    text-align: center;
  }

}
.n-tab-item-nav:not(.vertical) {
  padding: 10px 5px;
}
.n-tab-item-nav:not(.vertical):first-child {
  padding-left: 10px;
}
.n-tab-item-nav:not(.vertical):last-child {
  padding-right: 10px;
}
.n-tab-item-nav.vertical {
  padding: 5px 10px;
}
.n-tab-item-nav.vertical:first-child {
  padding-top: 10px;
}
.n-tab-item-nav.vertical:last-child {
  padding-bottom: 10px;
}
.n-tab-item-nav:not(.active) {
  color: var(--text-color-unfocus);
}

.n-tab-item-nav.active {
  color: var(--primary-color);
}
.n-tab-item-nav.active.shape {
  > .inner {
    background-color: var(--primary-color-shape);
  }
}
.n-tab-item-nav:hover {
  color: var(--primary-color-hover);
}


.n-tab-item-nav.vertical {
  text-align: left;
  > .inner {
    grid-template-rows: auto;
    grid-template-columns: max-content auto;
    
  }
  .icon-wrapper {
    order: 1;
    
  }
  .label-wrapper {
    order: 2;
    padding: 0 10px 0 10px;
    display: grid;
    grid-template-columns: auto;
    grid-template-rows: auto max-content auto;
    > .label {
      grid-row: 2 / span 1;
      text-align: left;
    }
  }
}


@media screen and (max-width: 600px) {
  .n-tab-item-nav {
    --icon-size: 22px;
    --text-size: 0.95em;
  }
}
@media screen and (max-width: 350px) {
  .n-tab-item-nav {
    --icon-size: 20px;
    --text-size: 0.85em;
  }
}
</style>