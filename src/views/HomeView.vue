<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <main class="min-h-screen px-6 py-10 text-neutral-200">
    <section class="mx-auto flex max-w-3xl flex-col gap-4">
      <h1 class="text-lg text-neutral-100">tools</h1>
      <ul class="list-disc pl-5 text-sm text-neutral-400">
        <li>
          <RouterLink class="hover:text-neutral-200" to="/base64"
            >base64 encode / decode</RouterLink
          >
        </li>
        <li>
          <RouterLink class="hover:text-neutral-200" to="/diff"
            >side-by-side text differ</RouterLink
          >
        </li>
        <li>
          <RouterLink class="hover:text-neutral-200" to="/markdown">markdown previewer</RouterLink>
        </li>
        <li>
          <RouterLink class="hover:text-neutral-200" to="/http-status"
            >http status code lookup</RouterLink
          >
        </li>
        <li>
          <RouterLink class="hover:text-neutral-200" to="/notes"
            >notepad (local storage)</RouterLink
          >
        </li>
        <li>
          <RouterLink class="hover:text-neutral-200" to="/cron">cron expression builder</RouterLink>
        </li>
        <li>
          <RouterLink class="hover:text-neutral-200" to="/url">url encode / decode</RouterLink>
        </li>
        <li>
          <RouterLink class="hover:text-neutral-200" to="/ids"
            >uuid, nanoid, ulid generator</RouterLink
          >
        </li>
        <li>
          <RouterLink class="hover:text-neutral-200" to="/hashes">hash playground</RouterLink>
        </li>
        <li>
          <RouterLink class="hover:text-neutral-200" to="/base-convert">base conversion</RouterLink>
        </li>
        <li><RouterLink class="hover:text-neutral-200" to="/color">color picker</RouterLink></li>
      </ul>
    </section>
  </main>
</template>
