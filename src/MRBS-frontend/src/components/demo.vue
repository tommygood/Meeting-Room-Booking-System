<template>
    <preview :demo="demo" />
</template>
<script>
import preview from './Preview.vue'
export default {
    components: {
        preview
    },
    data() {
        return {
            demo: true,
        }
    },
}
</script>