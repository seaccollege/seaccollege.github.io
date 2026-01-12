<template>
    <div role="list" class="programs-grid">
        <article v-for="(pub, index) in publications" :key="index" class="program-card" role="listitem" itemscope
            itemtype="https://schema.org/Course"
            :style="{ ['--pub-color-light']: pub.color?.light, ['--pub-color-dark']: pub.color?.dark }">
            <h3>
                <i :class="pub.icon" aria-hidden="true"></i>
                <br />
                <span itemprop="name">{{ pub.name }}</span>
            </h3>
            <p itemprop="description">{{ pub.description || '' }}</p>
        </article>
    </div>
</template>

<script setup>
import publications from '../../data/publications.json';
</script>

<style scoped>
@import '../../styles/academics-page.css';

.program-card {
    --pub-color: var(--pub-color-light, #ccc);
    border-top: 4px solid var(--pub-color);
}

.program-card:hover {
    border-color: var(--pub-color);
}

:global(html[data-theme="dark"]) ::v-deep .program-card {
    --pub-color: var(--pub-color-dark, var(--pub-color));
}

.program-card h3 i {
    color: var(--pub-color);
}

.program-card h3,
.program-card p {
    color: var(--pub-color);
}
</style>