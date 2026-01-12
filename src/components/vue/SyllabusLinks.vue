<template>
    <div role="list" class="programs-grid">
        <article v-for="(syl, index) in syllabus" :key="index" class="program-card" role="listitem" itemscope
            itemtype="https://schema.org/Course"
            :style="{ ['--syl-color-light']: syl.color?.light, ['--syl-color-dark']: syl.color?.dark }">
            <h3>
                <i :class="syl.icon" aria-hidden="true"></i>
                <br />
                <span itemprop="name">{{ syl.name }}</span>
            </h3>
            <p itemprop="description">{{ syl.description || '' }}</p>
        </article>
    </div>
</template>

<script setup>
import syllabus from '../../data/syllabus.json';
</script>

<style scoped>
@import '../../styles/academics-page.css';

.program-card {
    --syl-color: var(--syl-color-light, #ccc);
    border-top: 4px solid var(--syl-color);
}

.program-card:hover {
    border-color: var(--syl-color);
}

:global(html[data-theme="dark"]) ::v-deep .program-card {
    --syl-color: var(--syl-color-dark, var(--syl-color));
}

.program-card h3 i {
    color: var(--syl-color);
}

.program-card h3,
.program-card p {
    color: var(--syl-color);
}
</style>