<template>
    <rule :demo="demo" />
</template>
<script>
import rule from '@/components/Rule.vue'
export default {
    components: {
        rule
    },
    data() {
        return {
            demo: true,
        }
    },
}
</script>