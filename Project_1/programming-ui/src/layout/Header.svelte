<script>
  import { userUuid, points } from "../stores/stores.js";
</script>

<nav class="mx-auto mb-4 shadow font-sans flex screen-h space-x-20 bg-goodblue text-white p-4">
  <div class="mx-auto flex">
  <span class="text-2xl pt-2 -ms-8 me-8">Hello {$userUuid}!</span>
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
  </div>
</nav>
