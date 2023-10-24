<script>
  import { userUuid } from "../stores/stores.js";
</script>

<nav class="p-4 shadow flex items-center">
  <img class="h-14" src="/logo.jpeg" alt="Aalto university logo" />
  <span class="text-2xl text-gray-700 font-sans">Hello user: {$userUuid}!</span>
</nav>
