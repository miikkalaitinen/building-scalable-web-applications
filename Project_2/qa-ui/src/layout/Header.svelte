<script>
  import { userUuid } from "../stores/stores.js";
</script>

<nav class="p-4 shadow flex items-center">
  <img class="h-14" src="https://raw.githubusercontent.com/miikkalaitinen/building-scalable-web-applications/master/Project_2/qa-ui/public/logo.jpeg" alt="Aalto university logo" />
  <span class="text-2xl text-gray-700 font-sans">Hello user: {$userUuid}!</span>
</nav>
