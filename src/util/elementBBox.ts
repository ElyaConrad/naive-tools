import { onMounted, onUnmounted, reactive, Ref, watch } from 'vue';

export default function useElementBBox(elementRef: Ref<Element | undefined>) {
  const bbox = reactive<{ x: number; y: number; width: number; height: number; }>({ x: 0, y: 0, width: 0, height: 0 });
  const update = () => {
    if (elementRef.value) {
      const currBBox = elementRef.value.getBoundingClientRect();
      for (const key of ['x', 'y', 'width', 'height']) {
        bbox[key as keyof typeof bbox] = currBBox[key as keyof typeof bbox];
      }
    }
  };
  const observer = new ResizeObserver(update);
  onUnmounted(() => observer.disconnect());
  watch(elementRef, el => {
    if(!el) return;
    observer.observe(el);
  }, { immediate: true });
  return bbox;
}
