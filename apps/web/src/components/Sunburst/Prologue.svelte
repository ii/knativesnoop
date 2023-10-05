<script>
 import dayjs from 'dayjs';
 import { takeRight } from 'lodash-es';
 import SectionHeader from '../SectionHeader.svelte';
 import { activeRelease, releases, versions } from '../../store';

 const SPYGLASS_URL = 'https://prow.k8s.io/view/gcs/kubernetes-jenkins/logs'
 let releaseSwitch = false;

 $: ({
   release,
   release_date,
   sources
 } = $activeRelease);

 $: date = dayjs(release_date).format('DD MMMM, YYYY');

 const prettyPrintNumber = (num) => {
   let numbers = ['zero', 'one', 'two', 'three', 'four', 'five'];
   return numbers[Number(num)];
 }

</script>

{#if release}
  <SectionHeader title={""}>
    <h2>{release} Knative Testing Coverage
      <!-- <button on:click={() => releaseSwitch = true}>switch release</button> -->
    </h2>
    {#if releaseSwitch}
      <ul class='releases'>
      {#each $versions as version}
        <li><a href={'/'+version+'/'} on:click={() => releaseSwitch = false}>{version}</a></li>
      {/each}
      </ul>
    {:else}
      <!-- <em>Data comes from 1 e2e test suite run from {date}:</em> -->
      <!-- <ul class='sources'>
           {#each sources as source}
           <li>
           <a href="{source}" title="spyglass link" target="_blank" rel="noreferrer noopener">
           {takeRight(source.split('/'), 2).join('/')}
           </a>
           </li>
           {/each}
           </ul> -->
    {/if}
    <p>
      The Kubernetes conformance project allows vendors to publicly verify their offering is conformant to the k8s spec, through
      running the suite via Sonobuoy and submitting it to the <a href="https://github.com/cncf/k8s-conformance/blob/master/instructions.md">k8s conformance repo</a>.</p>
    <p>
      APISnoop was implemented to track the progress of conformance coverage, running the tests with an audit sink to check each
      k8s stable endpoint is covered by some test.</p>
    <p>
      This tool is used as part of the <a href="https://testgrid.k8s.io/sig-arch-conformance#apisnoop-conformance-gate">release cycle of K8s</a>, to ensure no new GA endpoints are added without coverage. It is also
      used by test writers to help with the focus and accuracy of their tests.
    </p>
    <p>
      We are interested if this project can be extended to help Knative conformance. Our current questions are:
    </p>
    <ul>
      <li>How does Knative currently measure coverage progress?  If one were to say "Knative is 100% covered by conformance tests", how would
        that be shown or verified?</li>
      <li>Where does the knative spec live? Does it consist of Kubernetes CRD's only? If not, what else is included in the spec?</li>
      <li>Is there a recommended method and target for running the Knative suite currently?</li>
      <li>The suite is run as a gh action using KinD. Is there a specific kind config that should be used if wnating to reproduce the action on our own KinD cluster?</li>

    </ul>
  </SectionHeader>
{/if}


<style>
 ul.releases , ul.releases li {
   display: inline;
   margin-right: 1rem;
   padding-left: 0;
   margin-left: 0;
 }
 a:hover {
   background: aliceblue;
 }
 ul.sources {
   margin: 0;
   padding: 0;
   list-style-type: none;
 }
</style>
