<template>
  <RouterView />
</template>

<script>

export default {
  name: 'App',
  components: {
  },
  data() {
    return {
      message: 'Hello Vue 3.0!' // 把 message 放在 App 組件的 data 裡
    }
  },
  methods: {
    test() {
      return 'test123';
    }
  }
}
</script>