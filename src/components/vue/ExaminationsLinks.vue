<template>
    <div role="list" class="programs-grid">
        <article v-for="(exam, index) in examinations" :key="index" class="program-card" role="listitem" itemscope
            itemtype="https://schema.org/Course"
            :style="{ ['--exam-color-light']: exam.color?.light, ['--exam-color-dark']: exam.color?.dark }">
            <h3>
                <i :class="exam.icon" aria-hidden="true"></i>
                <br />
                <span itemprop="name">{{ exam.name }}</span>
            </h3>
            <p itemprop="description">{{ exam.description || '' }}</p>
        </article>
    </div>
</template>

<script setup>
import examinations from '../../data/examinations.json';
</script>

<style scoped>
@import '../../styles/academics-page.css';

.program-card {
    --exam-color: var(--exam-color-light, #ccc);
    border-top: 4px solid var(--exam-color);
}

.program-card:hover {
    border-color: var(--exam-color);
}

:global(html[data-theme="dark"]) ::v-deep .program-card {
    --exam-color: var(--exam-color-dark, var(--exam-color));
}

.program-card h3 i {
    color: var(--exam-color);
}

.program-card h3,
.program-card p {
    color: var(--exam-color);
}
</style>