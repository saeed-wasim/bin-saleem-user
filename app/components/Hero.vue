<script setup>
import Hero from "/assets/images/Hero.png";
</script>

<template>
  <section class="relative w-full">
    <!-- Hero Image -->
    <img
      :src="Hero"
      alt="Hero"
      class="w-full h-[450px] md:h-[650px] object-cover"
    />

    <!-- Overlay Content -->
    <div
      class="absolute inset-0 flex items-center"
    >
      <div class="max-w-xl px-6 md:px-16">
        <h1 class="text-white font-serif text-4xl md:text-6xl leading-tight">
          The Art of
          <br />
          <span class="italic">
            Eternal Radiance
          </span>
        </h1>

        <p class="mt-5 text-white text-sm md:text-base leading-7 max-w-md">
          Discover our new high-jewellery collection, where heritage
          craftsmanship meets contemporary elegance. Every piece tells a story
          of timeless beauty and unparalleled luxury.
        </p>

        <!-- Button -->
       <NuxtLink to="/new-arrivals">
         <button
          class="mt-8 inline-flex items-center gap-2 bg-theme text-white px-6 py-3 rounded-md hover:opacity-90 transition"
        >
          New Arrivals

        <div class="mt-1">
            <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M5 12h14m-6-6l6 6-6 6"
            />
          </svg>
        </div>
        </button>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>