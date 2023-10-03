<script>
 import { RELEASES_URL, EARLIEST_VERSION } from '../lib/constants.js';
 import { onMount, afterUpdate } from 'svelte';
 import { isEmpty, mapValues, groupBy } from 'lodash-es';
 import dayjs from 'dayjs';
 import yaml from 'js-yaml';
 import { gte } from '../lib/semver.js'
 import { releaseJsonExists } from '../lib/utils.js'
 import {
   activeFilters,
   activeRelease,
     releases,
     latestVersion
 } from '../store';

 export let params;
 export let query;

 $: ({
     version,
     level,
     category,
     endpoint
 } = params);

 afterUpdate(async() => {
     if ($releases && isEmpty($releases)) {
       let releasesFromYaml = await fetch(`${RELEASES_URL}/releases.yaml`)
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
     level: '',
     category: '',
     endpoint: ''
   }))
   if (isEmpty($activeRelease.endpoints)) {
     let rel = await fetch(`${RELEASES_URL}/${version}.json`).then(res => res.json());
     releases.update(rels => {
       rels[version] = rel;
       return rels;
     });
   }
 });

 $: lastUpdate = $activeRelease
               ? dayjs($activeRelease.release_date).format('DD MMMM, YYYY')
               : '';
</script>

<svelte:head>
	<title>KnativeSnoop | About</title>
</svelte:head>
<h1>About KnativeSnoop</h1>

<p>
    KnativeSnoop is a tool for checking the current test coverage of the Knative Kubernetes CRDs.
    It is a custom offshoot of <a href="https://apisnoop.cncf./io">APISnoop</a>.
</p>

<p>
    The source code of this tool is available <a href="https://github.com/ii/knative-conformance">on  github</a>
</p>

<p>
  This is a proto work-in-progress, more of a proof of concept at this stage, but with exciting potential and a strong
  foundation in APISnoop.
</p>

<h2>What the graph shows</h2>

<p>
The graph on the homepage shows the Knative endpoints in a kubernetes cluster
  where Knative serving and eventing has been deployed, and whether they are
  currently hit by any Knative conformance tests. At the moment, this is quite
  innacurate, as there is not a consistent way of checking conformance test
  coverage, and so the 0% coverage is accurate in terms of what we can show, but
  not what the current conformance tests actually hit.
<p>
  <h2>How we get our coverage</h2>

  <p>
    For APISnoop, our report was generated with the openapi spec available in
    the kubernetes repo and with audit logs from the kubernetes conformance
    suite. This suite ran every few hours, with the logs published to a bucket
    we could draw from.
  </p>

  <p>
    We processed these logs to map which endpoint was hit to its description in the
    openapi spec, and then built out a visualization.
  </p>

  <p>
    With Knative, we do not have as easy access to either side of data. Since
    the KN endpoints are CRD's, we need to pull the api spec dynamically from a cluster.
    We do this by starting up a kind cluster, deploying knative serving and eventing to it,
    and then using Apisnoop's snoopdb tool to generate a live api spec and views from it.
  </p>

  <p>
    As far as we are aware, there is not an accessible audit log for the knative conformance tests.
    Instead, we attempted to run the conformance suite on the same deployed cluster, and capture
    which endpoints were being hit in real time.  This worked in practice, but we were not able to
    consistently complete the conformance suite.  Our naive expectation was that a cluster built
    following the knative quickstart example would be conformant, and could pass the knative conformance
    tests without additional configuration, but this strategy has not been successful.
  </p>

  <p>
    Ideally, there would be test logs available to draw from.  Barring that, the next plan for this site
    is to setup a documented, consistently conformant cluster we can spin up, run the tests, and output
    the logs ourselves
  </p>
