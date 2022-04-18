## Abstract

This library is used to be an *extension* for [Naive UI](https://naiveui.com) with the goal to provide useful components for using Naive UI in a mobile application. Even if mobile usage is the main use case for this library, it's currently just a component based extension without any try to provide logical behaviour such as a component-related switch for mobile / desktop environments.

## N Popup

The `<n-popup>` component is specially designed for mobile solution but totally works on desktop (and looks great there). It's inspired by Apple's iOS popover style. To use it, there needs to exist a parental `<n-popup-provider>`. This is needed because of the fact, that multiple popup's will be layed over each other independently where they come from and the "ui effect" is ambitious from a DOM's perspective. This fact also makes it possible to let a popup just overlay a specific area and not the whole application which is a nice feature in case of more complex user interfaces.

### Default usage

```html
<!-- This is just normal Naive UI stuff -->
<n-config-provider style="width: 100%; height: 100%;">
  <!-- By default, width and height are 100% of parent element -->
  <n-popup-provider>
    <n-popup trigger="click" title="Dont trust, verify." v-model:show="showRef">
      <template #trigger>
        <n-button>Open NPopover</n-button>
      </template>
      Hellow World from the popup!
    </n-popup>
  </n-popup-provider>
</n-config-provider>
```

#### Properties

- `show`: Boolean modeled value that can be `true` or `false`. Optional.
- `trigger`: `click`, `hover` or `manual`. In case of `manual`, the modeled `show` property should be implemented of course. Default is `click`.
- `title`: The title text which will be inserted into a `<n-h2>` element in case you're not using `#template` slot. Optional.


### Title as slot

```html
<n-popup>
  <!-- ... -->
  <template #title>
    <span>Titles are great!</span>
  </template>
  <!-- ... -->
</n-popup>
```

### Actions as slot

In addition to the title, tehre is also a `#actions` slot which will place all its elements on the same level on the right side of the close button.

```html
<n-popup>
  <!-- ... -->
  <template #actions>
    <n-button>Action 1</n-button>
    <n-button>Action 2</n-button>
  </template>
  <!-- ... -->
</n-popup>
```

### Custom close button

This overwrites the close button.

```html
<n-popup>
  <!-- ... -->
  <template #close-btn>
    <n-button>Become cool</n-button>
  </template>
  <!-- ... -->
</n-popup>
```

### Custom header

To set the complete header by your own, use the `#header` slot which will overwrite `#title`, `#actions`, `#close-btn` as well.

```html
<n-popup>
  <!-- ... -->
  <template #header>
    HEADACHE IS NOT COOL
  </template>
  <!-- ... -->
</n-popup>
```


## N Tabs Nav


To provide a hybrid navigation tab bar, the `<n-tabs-nav>` component can be used instead of `<n-menu>`.


```html
<n-tabs-nav v-model:value="activeTab" :vertical="false" pointer="normal" shape>
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
```


### Properties

- `pointer`: can be `normal`, `opposite` or `none`. It describes the primary-colored line which graphically indentifies the active tab. Defeault is `normal`.
- `vertical`: Boolean value wether the tab nav components is in vertical-mode. Default is `false`.
- `shape`: Boolean value wether a menu-like shape indentifies the active tab graphically.
- `value`: Modeled string which indetifies the active tab item by its `name`.


