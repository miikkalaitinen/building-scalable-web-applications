<script>
  import { userUuid, points } from "../stores/stores.js";
  import { onMount } from "svelte";

  onMount(async () => {
    const response = await fetch("/api/users/points", {
      method: "GET",
      headers: {
        'X-User-Id': $userUuid,
      },
    });
    const data = await response.json();
    points.set(data.points);
  });
</script>

<nav class="p-4 mb-4 shadow flex space-x-20">
  <span class="text-2xl text-gray-700 font-serif">Hello {$userUuid}!</span>
  <div>
    <p class="text-sm">Your points: {points}/300</p>
    <div class="flex w-96">
      {#if points == 0}
        <div class="w-96 bg-gray-400 rounded-3xl">&nbsp;</div>
      {:else if points == 100}
        <div class="w-1/3 bg-green-400 rounded-s-3xl">&nbsp;</div>
        <div class="w-2/3 bg-gray-400 rounded-e-3xl">&nbsp;</div>
      {:else if points == 200}
        <div class="w-2/3 bg-green-400 rounded-s-3xl">&nbsp;</div>
        <div class="w-1/3 bg-gray-400 rounded-e-3xl">&nbsp;</div>
      {:else if points == 300}
        <div class="w-96 bg-green-400 rounded-3xl">&nbsp;</div>
      {/if}
    </div>
  </div>
</nav>
