<script>

 import { onMount, afterUpdate } from 'svelte';
 import urlExist from 'url-exist';
 import yaml from 'js-yaml';
 import { gte } from '../lib/semver.js';
 import {
     groupBy,
     isEmpty,
     mapValues,
 } from 'lodash-es';

 import {
   EARLIEST_VERSION,
   RELEASES_URL,
   INELIGIBLE_ENDPOINTS_URL,
   PENDING_ENDPOINTS_URL
 } from '../lib/constants.js';
 import { features } from '../sampledata/features.js';

 import {
  releaseJsonExists
 } from '../lib/utils.js';
 import {
   activeFilters,
   activeRelease,
   latestVersion,
   releases,
   behaviours
 } from '../store';
 import Sunburst from '../components/Sunburst/Wrapper.svelte'
 import Behaviours from '../components/behaviours.svelte'

 export let query;
 export let params;

 $: ({
     version,
     level,
     category,
     endpoint
 } = params);


 afterUpdate(async() => {
   if ($behaviours && isEmpty($behaviours)) {
     behaviours.update(b => features);
   }
   if ($releases && isEmpty($releases)) {
       let releasesFromYaml = await fetch(`${RELEASES_URL}/releases.yaml?`)
         .then(res => res.blob())
         .then(blob => blob.text())
         .then(yamlString => yaml.load(yamlString))
         .then(releases => releases.filter(({version}) => gte(version, EARLIEST_VERSION)))

       let releasesData = await releaseJsonExists(releasesFromYaml)
         .then(releases => {
           return mapValues(groupBy(releases, 'version'),
                            ([{version, release_date}]) => ({
                              release: version,
                              release_date: release_date == '' ? new Date() : release_date,
                              spec: '',
                              source: '',
                              endpoints: [],
                              tests: []
           }))
         });
         releases.update(rel => releasesData);
     }
     if (version === 'latest' || version == null) {
         version = $latestVersion;
     };
     activeFilters.update(af => ({
         ...af,
         version,
         level: level || '',
         category: category || '',
         endpoint: endpoint || ''
     }));

     if ($activeRelease !== 'older' && isEmpty($activeRelease.endpoints)) {
         let rel = await fetch(`${RELEASES_URL}/${$activeRelease.release}.json`)
             .then(res => res.json());
         releases.update(rels => ({...rels, [$activeRelease.release]: rel}));
     }
 });
</script>

<svelte:head>
    <title>KnativeSnoop</title>
</svelte:head>
{#if $activeRelease && $activeRelease.endpoints && $activeRelease.endpoints.length > 0}
    <Sunburst />
    <Behaviours />
{:else}
    <em>loading data...</em>
{/if}
