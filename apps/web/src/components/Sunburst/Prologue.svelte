<script>
 import SectionHeader from '../SectionHeader.svelte';
 import { activeRelease, releases } from '../../store';

 $: ({release} = $activeRelease);
</script>

{#if release}
  <SectionHeader title={""}>
    <h2>{release} Knative Testing Coverage </h2>
    <p>
      This site is a prototype showing a possible way to investigate the
      conformance testing coverage of Knative, when deployed onto a kubernetes
      cluster.
    </p>
    <p>
      It is a fork and revision of <a href="https://apisnoop.cncf.io">APISnoop</a>,
      which is used to track the conformance progress of the kubernetes api.
    </p>
    <p>
      In this offshoot, the goal is to combine behaviour driven testing (as
      Knative's conformant spec is defined as a set of behaviours) along with the
      endpoint measurement of Kubernetes conformance program.
    </p>
    <p>
      It envisions transposing the Knative spec as a set of machine-readable
      behaviour files, written in gherkin, which can then be used to measure how
      many behaviours have tests written, and how many of those tests pass. In
      addition, it can show which endpoints are hit during these tests, in other
      words the parts of the API needed for each behaviour.
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
