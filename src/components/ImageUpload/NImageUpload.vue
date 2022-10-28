<template>
  <div class="n-image-upload">
    <n-button @click="triggerUpload">
      Test
    </n-button>
    
  </div>
</template>

<script setup lang="ts">
import { NButton } from 'naive-ui';
import uploadImage from '../../util/uploadImage';

console.log(uploadImage);

const triggerUpload = async () => {
  const image = await uploadImage({
    width: 1080,
    height: 1080,
    type: 'image/jpeg',
    quality: 85
  });
  console.log(image);
  
};



</script>