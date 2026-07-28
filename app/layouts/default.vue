<template>
  <div class="h-screen overflow-hidden ">
    <div class="h-screen flex flex-col">
      <Header />
      <main class="flex-1 custom-scrollbar overflow-auto flex flex-col">
        <div class="flex-1">
          <slot />
        </div>
        <Footer />
      </main>
    </div>
  </div>
</template>
