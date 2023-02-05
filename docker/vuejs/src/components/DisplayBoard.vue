<template>
    <div class="display-board">
        <h4>Searches Created</h4>
        <div class="number">
        {{numberOfSearches}}
        </div>
        <div class="btn">
            <button @click='getAllSearches()' type="button" class="btn btn-warning">Get all Searches</button>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'DisplayBoard',
        props: ['numberOfSearches'],
        methods: {
            getAllSearches() {
                this.$emit('getAllSearches')
            }
        }
    }
</script>