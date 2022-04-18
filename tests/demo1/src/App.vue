<script setup lang="ts">
import { ref } from 'vue'
import { NConfigProvider, NButton, NIcon, NSwitch, darkTheme, lightTheme } from 'naive-ui'
import { NTabsNav, NTabItemNav, NPopupProvider, NPopup } from 'naive-mobile'
import { Accessibility, Apps } from '@vicons/ionicons5'


const darkMode = ref(false);

const verticalTabNav = ref(true);

const activeTab = ref('dashboard');

console.log(NTabsNav);

const showP1 = ref(false);


</script>

<template>
  <n-config-provider :theme="darkMode ? darkTheme : lightTheme" :class="{ [darkMode ? 'dark-mode' : 'light-mode']: true }">
    <n-popup-provider class="popup-provider-1">
      <div class="app" :class="{ 'vertical-tab-nav': verticalTabNav }">
        <section class="content-section">
          <n-button @click="darkMode = !darkMode">Dark Mode</n-button>
          <br /><br />
          Vertical NTabsNav
          <n-switch v-model:value="verticalTabNav"></n-switch>
          <br /><br />
          <n-popup trigger="click" title="Hello World!" v-model:show="showP1">
            <template #trigger>
              <n-button>Open NPopup</n-button>
            </template>
            <span>Lol was geht denn hier ab?</span>
            <p>WHAT THE FUCK</p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Optio dignissimos eaque libero, facere doloribus unde sunt nostrum tempora nulla fugiat ipsam aliquam eos distinctio magni similique incidunt est reprehenderit fugit.
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure incidunt nobis animi sint voluptate cupiditate eaque tenetur quas deserunt aperiam tempore placeat quaerat tempora vitae dolore velit facere, distinctio nisi!

            <n-popup trigger="click" title="Second one!">
              <template #trigger>
                <n-button>Open second popup</n-button>
              </template>
              <h3>Jajaj nice!</h3>
              <p>
                LOLOL Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero porro ipsum necessitatibus, repudiandae aspernatur obcaecati similique. Ratione quae earum magni illum aperiam delectus ab, sed consequatur sequi modi rerum! Placeat.
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nulla adipisci vel rerum dolore delectus veniam ipsa cupiditate assumenda porro, quibusdam autem possimus facere fuga unde laudantium iste soluta, doloribus molestias.+
              </p>
            </n-popup>
          </n-popup>
        </section>
        <section class="nav-section">
          <n-tabs-nav v-model:value="activeTab" :vertical="verticalTabNav" pointer="normal" shape>
            <n-tab-item-nav name="dashboard">
              <template #icon>
                <n-icon>
                  <accessibility />
                </n-icon>
              </template>
              Dashboard
            </n-tab-item-nav>
            <n-tab-item-nav name="settings">
              <template #icon>
                <n-icon>
                  <apps />
                </n-icon>
              </template>
              Settings
            </n-tab-item-nav>
          </n-tabs-nav>
        </section>
      </div>
    </n-popup-provider>
  </n-config-provider>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #36393c;
  width: 100%;
  height: 100%;
  box-sizing: border-box;

}
body, html {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  box-sizing: border-box;

}

.dark-mode {
  background-color: #2e3337;
  color: #fff;
}
.light-mode {
  background-color: rgb(253, 253, 253);
}
</style>


<style scoped lang="scss">
.n-config-provider {
  height: 100%;
}
.popup-provider-1 {
  /*width: 300px;
  height: 300px;*/
}
.app {
  height: 100%;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: auto max-content;
  .content-section {
    padding: 20px;
  }
}
.app.vertical-tab-nav {
  grid-template-rows: auto;
  grid-template-columns: max-content auto;
  .content-section {
    order: 2;
  }
  .nav-section {
    order: 1;
  }
}
</style>