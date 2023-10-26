<script>
  import { onDestroy } from "svelte"

  export let onVisible = () => {}
  export let page

  let loading = false
  let failed = false

  const actionWhenInViewport = (e) => {
    const observer = new IntersectionObserver(async (entries) => {
      if(entries[0].isIntersecting) {
        loading = true
        const res = await onVisible()
        if (!res) {
          failed = true
        }
        loading = false
      } else {
        failed = false
      }
    });

    observer.observe(e);
  }

  onDestroy(() => {
    observer.disconnect();
  });
</script>


<div class="text-center my-16" use:actionWhenInViewport>
  {#if loading}
  <p>Loading...</p>
  {:else if failed}
  <p>Failed to load more {page}</p>
  {:else}
  <p>You have fetched all {page}</p>
  {/if}
</div>