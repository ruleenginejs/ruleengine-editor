<template>
  <ul class="demo-nav">
    <li class="demo-nav__item">
      <router-link :to="{ name: 'home' }">Home</router-link>
    </li>
    <li class="demo-nav__item">
      <router-link :to="{ name: 'editor' }">Editor</router-link>
    </li>
    <li class="demo-nav__item">
      <router-link :to="{ name: 'editor-with-sidebar' }">Editor with sidebar</router-link>
    </li>
  </ul>
</template>
