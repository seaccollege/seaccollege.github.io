<template>
    <div role="list" class="programs-grid">
        <article v-for="(crs, index) in courses" :key="index" class="program-card" role="listitem" itemscope
            itemtype="https://schema.org/Course"
            :style="{ ['--crs-color-light']: crs.color?.light, ['--crs-color-dark']: crs.color?.dark }">
            <h3>
                <i :class="crs.icon" aria-hidden="true"></i>
                <br />
                <span itemprop="name">{{ crs.name }}</span>
            </h3>
            <p itemprop="description">{{ crs.description || '' }}</p>
            <span class="duration" itemprop="timeRequired">Duration: {{ crs.duration }} Years</span>
        </article>
    </div>
</template>

<script setup>
import courses from '../../data/courses.json';
</script>

<style scoped>
@import '../../styles/academics-page.css';

.program-card {
    --crs-color: var(--crs-color-light, #ccc);
    border-left: 4px solid var(--crs-color);
}

.program-card:hover {
    border-color: var(--crs-color);
}

:global(html[data-theme="dark"]) ::v-deep .program-card {
    --crs-color: var(--crs-color-dark, var(--crs-color));
}

.program-card h3 i {
    color: var(--crs-color);
}

.program-card h3,
.program-card p {
    color: var(--crs-color);
}
</style>