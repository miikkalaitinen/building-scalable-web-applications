<script>
  import { userUuid, points } from "../stores/stores.js";
</script>

<nav class="p-4 mx-auto mb-4 shadow  font-sans flex space-x-20 bg-goodblue text-white">
  <span class="text-2xl">Hello {$userUuid}!</span>
  <div>
    <p class="text-sm">Your points: {$points}/300</p>
    <div class="flex w-96">
      {#if $points == 0}
        <div class="w-96 bg-gray-400 rounded-3xl">&nbsp;</div>
      {:else if $points == 100}
        <div class="w-1/3 bg-green-400 rounded-s-3xl">&nbsp;</div>
        <div class="w-2/3 bg-gray-400 rounded-e-3xl">&nbsp;</div>
      {:else if $points == 200}
        <div class="w-2/3 bg-green-400 rounded-s-3xl">&nbsp;</div>
        <div class="w-1/3 bg-gray-400 rounded-e-3xl">&nbsp;</div>
      {:else if $points == 300}
        <div class="w-96 bg-green-400 rounded-3xl">&nbsp;</div>
      {/if}
    </div>
  </div>
</nav>
