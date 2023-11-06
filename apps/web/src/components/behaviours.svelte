<script>
 import { behaviours, activeBehaviour } from '../store';
 import { afterUpdate } from 'svelte';
 import { faCheckCircle } from '@fortawesome/free-solid-svg-icons/faCheckCircle';
 import { faQuestion } from '@fortawesome/free-solid-svg-icons/faQuestion';
 import Icon from 'fa-svelte';
 const checkmark = faCheckCircle;
 const emptySet = faQuestion;

 $: bes = $behaviours;

 const updateActiveBehaviour = (b) => {
   if ($activeBehaviour.id && $activeBehaviour.id === b.id) {
     activeBehaviour.update(ab => ({}))
   } else {
     activeBehaviour.update(ab => b)
   }
 }
</script>



<section id='behaviours'>
  <h2>Conformant Behaviours</h2>
      {#each bes as behaviour}
        <details on:click="{() => updateActiveBehaviour(behaviour)}" >
          <summary>
            {behaviour.scenario}
          {#if behaviour.status === 'passed'}
            <Icon class='success check' icon={checkmark} />
          {:else}
            <Icon class='check fail' icon={emptySet} />
          {/if}
          </summary>
            <div class="feature">
              {#if behaviour.status === 'untested'}
                <em>currently untested</em>
              {/if}
              <pre>
              {behaviour.feature}
              </pre>
            </div>
        </details>
      {/each}
</section>
<style>
details {
  max-width: 700px;
  padding: 0.5rem 0 0.5rem 0;
  border-top: 1px solid black;
  font-size: 1.3rem;
  cursor: pointer;
 }
 details::last-of-type {
  border-bottom: 1px solid black;
 }

 .feature {
   position: relative;
   max-width: 700px;
 }

 pre {
   padding: 0;
   margin: 0;
   font-size: 1rem;
 }

summary :global(.success) {
   color: rgba(60, 180, 75, 1);
 }

</style>