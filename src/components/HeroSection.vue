<template>
    <section id="home" class="hero" aria-labelledby="hero-title">
        <div class="hero-content">
            <slot>
                <h1 id="hero-title">SEAC College</h1>
                <p class="lead">Learning for life — discover our programs below.</p>
            </slot>
        </div>
        <button class="scroll-indicator" @click="scrollToPrograms" aria-label="Scroll to programs">
            <i class="fas fa-chevron-down" aria-hidden="true"></i>
        </button>
    </section>
</template>

<script setup>
const scrollToPrograms = () => {
    const el = document.getElementById('programs');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
};
</script>

<style scoped>
/* Hero Section */
.hero {
    background: url("assets/images/background.jpg") center/cover no-repeat fixed;
    color: white;
    padding: 0;
    text-align: center;
    margin-top: 0;
    position: relative;
    overflow: hidden;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.hero::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    /* background: rgba(0, 0, 0, 0.4); */
    z-index: 1;
}

.hero-content {
    position: relative;
    z-index: 2;
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
}

.hero-content h1,
.hero h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
    animation: fadeInUp 0.8s ease-out;
    position: relative;
    z-index: 1;
}

.hero-content p,
.hero p {
    font-size: 1.3rem;
    margin-bottom: 2rem;
    animation: fadeInUp 1s ease-out;
    position: relative;
    z-index: 1;
}

/* Scroll Down Indicator */
.scroll-indicator {
    position: absolute;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    animation: bounce 2s infinite;
    cursor: pointer;
    z-index: 1;
}

.scroll-indicator i {
    font-size: 2rem;
    color: white;
}

</style>
