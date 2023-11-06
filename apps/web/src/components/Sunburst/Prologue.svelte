<script>
 import SectionHeader from '../SectionHeader.svelte';
 import { activeRelease, releases } from '../../store';

 $: ({release} = $activeRelease);
</script>

{#if release}
  <SectionHeader title={""}>
    <h2>{release} Knative Testing Coverage </h2>
    <p>
      KNATIVE WRITE SOMETHING!
    </p>
  </SectionHeader>
{/if}


<style>
 ul.releases , ul.releases li {
   display: inline;
   margin-right: 1rem;
   padding-left: 0;
   margin-left: 0;
 }
</style>
