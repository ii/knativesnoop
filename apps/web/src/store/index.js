import { readable, writable, derived } from 'svelte/store';
import { lt,gt } from '../lib/semver.js'

import {
  compact,
  differenceBy,
  flatten,
  groupBy,
  keyBy,
  last,
  isEmpty,
  map,
  mapValues,
  orderBy,
  reverse,
  sortBy,
  take,
  uniq,
  values
} from 'lodash-es';

import {
  kindColours,
  endpointColour,
  levelColours
} from '../lib/colours.js';

import { EARLIEST_VERSION } from '../lib/constants.js';

export const releases = writable([])
export const behaviours = writable([])

export const activeBehaviour = writable({});

export const behaviourEndpoints = derived(activeBehaviour, ($ab, set) => {
  if (!$ab.id) {
    set([])
  } else {
    set($ab.endpoints)
  }
});

export const versions = derived(releases, ($releases, set) => {
  // shorthand of the versions we have available, sorted by newest.
  if (!isEmpty($releases)) {
    const versions = sortBy($releases, 'release_date')
      .map(r => r.release)
      .map(r =>{
        return r
      })
      .sort((a, b) => {
        // debugger;
        return gt(b, a) ? 1 : -1
      });
    set(versions);
  } else {
    set([])
  }
});

export const latestVersion = derived(
  versions,
  ($v, set) => {
    if (!isEmpty($v)) {
      set($v[0]);
    } else {
      set('');
    }
  }
);

// Based on url query params, any filters being set.
export const activeFilters = writable({
  test_tags: [],
  useragent: '',
  level: '',
  category: '',
  endpoint: '',
  kind: '',
  version: '',
});

export const activeRelease = derived(
  // The release whose key is the current version filter,
  // (which will be set by our url)
  [releases, latestVersion, activeFilters],
  ([$r, $v, $a], set) => {
    if (isEmpty($r)) {
      set({});
    }
    if (!$a.version || $a.version === '') {
      set($r[$v]);
    } else if (lt($a.version, EARLIEST_VERSION)) {
      set('older');
    } else {
      set($r[$a.version])
    }
  }
);

// holds information on when user mouse is hovering over part of sunburst
export const mouseOverPath = writable([]);

export const breadcrumb = derived(
  [activeFilters, mouseOverPath],
  ([$active, $mouse], set) => {
    const mouseCrumbs = $mouse.map(m => m.data.name);
    const activeAndMouseCrumbs = compact(uniq([$active.level, $active.category, $active.endpo8, ...mouseCrumbs]));
    let crumbs = [];
    // if length is 4, it means we are zoomed into an endpoint, and hovering over a different endpoint.
    if (activeAndMouseCrumbs.length === 4) {
      // if that's the case, we want to show the one we are hovered on.
      crumbs = activeAndMouseCrumbs.filter(crumb => crumb !== $active.endpoint);
    } else {
      crumbs = take(compact(uniq([$active.level, $active.category, $active.endpoint, ...mouseCrumbs])), 3);
    }
    set(crumbs);
  }
);

export const endpoints = derived(
  [activeRelease, activeFilters],
  ([$rel, $filters], set) => {
    let endpoints = [];
    if (!$rel) {
      set(endpoints);
    } else {
      endpoints = $rel.endpoints.filter(({group}) => {
        return !group.endsWith("operator.knative.dev") &&
          !group.endsWith("internal.knative.dev")
      });
      set(endpoints);
    }
  });

export const groupedEndpoints = derived([activeRelease, endpoints, activeBehaviour], ([$ar, $eps, $ab], set) => {
  if ($eps && $eps.length > 0) {
    const epsByLevel = groupBy($eps, 'level');
    set(mapValues(epsByLevel, epsInLevel => {
      const epsByKind = groupBy(epsInLevel, 'kind');
      return mapValues(epsByKind, epsInKind => {
        return epsInKind.map(ep => {
          let ofActiveBehaviour = false;
          if ($ab.endpoints && $ab.endpoints.length > 0 ) {
            ofActiveBehaviour = $ab.endpoints.includes(ep.endpoint)
          }
          return {
            ...ep,
            name: ep.endpoint,
            value: 1,
            color: ofActiveBehaviour ? kindColours[ep.kind] : endpointColour(ep)
          };
        });
      });
    }));
  } else {
    set({});
  }
});

export const sunburst = derived(groupedEndpoints, ($gep, set) => {
  if (!isEmpty($gep)) {
    var sunburst = {
      name: 'root',
      color: 'white',
      children: map($gep, (endpointsByKindAndEndpoint, level) => {
        return {
          name: level,
          color: levelColours[level] || levelColours['unused'],
          level: level,
          category: '',
          kind: '',
          endpoint: '',
          children: map(endpointsByKindAndEndpoint, (endpointsByEndpoint, kind) => {
            return {
              name: kind,
              level: level,
              category: kind,
              kind: kind,
              endpoint: '',
              color: kindColours[kind] || 'rgba(183, 28, 28, 1)', // basic color so things compile right.
              children: sortBy(endpointsByEndpoint, [
                (endpoint) => endpoint.tested,
                (endpoint) => endpoint.conf_tested
              ])
            };
          })
        };
      })
    };
    sunburst.children = orderBy(sunburst.children, 'name', 'desc');
    set(sunburst);
  } else {
    set({});
  }
});

export const zoomedSunburst = derived(
  [sunburst, activeFilters],
  ([$sunburst, $filters], set) => {
    let { level, category } = $filters;
    if (!isEmpty($sunburst) && category) {
      let sunburstAtLevel = $sunburst.children.find(child => child.name === level);
      let sunburstAtCategory = sunburstAtLevel.children.find(child => child.name === category);
      set(sunburstAtCategory);
    } else if (!isEmpty($sunburst) && !category && level) {
      let sunburstAtLevel = $sunburst.children.find(child => child.name === level);
      set(sunburstAtLevel);
    } else {
      set($sunburst);
    }
  });

export const currentDepth = derived(breadcrumb, ($breadcrumb, set) => {
  let depths = ['root', 'level', 'category', 'endpoint'];
  let depth = $breadcrumb.length;
  set(depths[depth]);
});

export const coverageAtDepth = derived([breadcrumb, currentDepth, endpoints], ([$bc, $depth, $eps], set) => {
  let eps;
  if (isEmpty($eps)) {
    set({});
    return;
  } else if ($bc.length === 0) {
    eps = $eps;
  } else if ($bc.length === 1) {
    eps = $eps.filter(ep => ep.level === $bc[0]);
  } else if ($bc.length === 2) {
    eps = $eps.filter(ep => ep.level === $bc[0] && ep.category === $bc[1]);
  } else if ($bc.length === 3) {
    eps = $eps.filter(ep => ep.level === $bc[0] && ep.category === $bc[1] && ep.endpoint === $bc[2]);
  } else {
    eps = $eps;
  }
  let totalEndpoints = eps.length;
  let testedEndpoints = eps.filter(ep => ep.tested).length;
  let confTestedEndpoints = eps.filter(ep => ep.conf_tested).length;
  set({
    totalEndpoints,
    testedEndpoints,
    confTestedEndpoints
  });
});

export const endpointCoverage = derived([breadcrumb, currentDepth, endpoints], ([$bc, $cd, $eps], set) => {
  let currentEndpoint;
  let opId;
  let defaultCoverage = {
    tested: '',
    endpoint: '',
    confTested: '',
    description: '',
    path: '',
    group: '',
    version: '',
    kind: ''
  };
  if (isEmpty($eps) || $cd !== 'endpoint') {
    set(defaultCoverage);
  } else {
    opId = $bc[2];
    currentEndpoint = $eps.find(ep => ep.endpoint === opId);
    let {
      tested,
      conf_tested: confTested,
      endpoint,
      path,
      description,
      k8s_group: group,
      k8s_version: version,
      k8s_kind: kind
    } = currentEndpoint;
    set({
      tested,
      confTested,
      endpoint,
      path,
      description,
      group,
      version,
      kind
    });
  }
});