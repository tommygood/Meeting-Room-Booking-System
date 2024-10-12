<template>
    <preview :demo="demo" />
</template>
<script>
import preview from './preview.vue'
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