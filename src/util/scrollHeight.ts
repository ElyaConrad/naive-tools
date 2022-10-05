import { Ref, watch, onUnmounted, ref } from 'vue';

export default function useScrollHeight(elementRef: Ref<Element | undefined>) {
  const scrollHeight = ref(0);
  const update = () => {
    if (elementRef.value) {
      scrollHeight.value = elementRef.value.scrollHeight;
    }
  };
  const observer = new MutationObserver(update);
  onUnmounted(() => observer.disconnect());
  watch(elementRef, el => {
    if(!el) return;
    update();
    observer.observe(el, { attributes: true, childList: true, subtree: true });
  }, { immediate: true });
  return scrollHeight;
}