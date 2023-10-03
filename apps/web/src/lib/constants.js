const head = process.env.HEAD;
export const RELEASES_URL = head
  ? `https://raw.githubusercontent.com/ii/knative-conformance/${head}/resources/coverage`
  : 'https://raw.githubusercontent.com/ii/knative-conformance/main/resources/coverage';
// the earliest release we have test data for
export const PENDING_ENDPOINTS_URL = "https://raw.githubusercontent.com/kubernetes/kubernetes/master/test/conformance/testdata/pending_eligible_endpoints.yaml";
export const INELIGIBLE_ENDPOINTS_URL = "https://raw.githubusercontent.com/kubernetes/kubernetes/master/test/conformance/testdata/ineligible_endpoints.yaml";
export const EARLIEST_VERSION ='1.10.0';
