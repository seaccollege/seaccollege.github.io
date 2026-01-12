<template>
    <div role="list" class="programs-grid">
        <article v-for="(dept, index) in departments" :key="index" class="program-card" role="listitem" itemscope
            itemtype="https://schema.org/Course"
            :style="{ ['--dept-color-light']: dept.color?.light, ['--dept-color-dark']: dept.color?.dark }">
            <h3>
                <i :class="dept.icon" aria-hidden="true"></i>
                <br />
                <span itemprop="name">{{ dept.name }}</span>
            </h3>
            <p itemprop="description">{{ dept.description || '' }}</p>
        </article>
    </div>
</template>

<script setup>
import departments from '../../data/departments.json';
</script>

<style scoped>
@import '../../styles/academics-page.css';

.program-card {
    --dept-color: var(--dept-color-light, #ccc);
    border-top: 4px solid var(--dept-color);
}

.program-card:hover {
    border-color: var(--dept-color);
}

:global(html[data-theme="dark"]) ::v-deep .program-card {
    --dept-color: var(--dept-color-dark, var(--dept-color));
}

.program-card h3 i {
    color: var(--dept-color);
}

.program-card h3,
.program-card p {
    color: var(--dept-color);
}
</style>