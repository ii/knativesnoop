export const features = [
  {id: "R01",
   status: "passed",
   links: ["https://github.com/knative/specs/blob/main/specs/serving/knative-api-specification-1.0.md#status-2"],
   scenario: "Route URL's must contain their scheme",
   feature: `
Given a service status with a route
When the owned route is given a url to reach the application
Then the URL must contain its scheme`,
   endpoints: [
     "readServingKnativeDevV1NamespacedRoute",
     "readServingKnativeDevV1NamespacedRouteStatus",
     "readServingKnativeDevV1NamespacedServiceStatus",
     "listServingKnativeDevV1NamespacedService"
   ]
  },
  {id: "S25",
   status: "passed",
   links: ["https://github.com/knative/specs/blob/main/specs/common/error-signalling.md"],
   scenario: "Route error signaling is reflected in owning Service",
   feature: `
Given a Service owning a Route
And the Service has a RouteReady status
When the Route's status is False
Then the Services's RouteReady status is False`,
   endpoints:[
     "readServingKnativeDevV1NamespacedRouteStatus",
     "readServingKnativeDevV1NamespacedServiceStatus",
     "readServingKnativeDevV1NamespacedConfigurationStatus",
     "readServingKnativeDevV1NamespacedServiceStatus"
   ]
  },
  {

    id: "S26",
    status: "untested",
    links: ["https://github.com/knative/specs/blob/main/specs/serving/knative-api-specification-1.0.md#metadata"],
    scenario: "Owned Configuration and Route must have correct service label",
    feature:`
Given a service named Foo
When a configuration and route are owned by service Foo
Then they both have the serving.knative.dev/service label
And the serving.knative.dev/service label's value is Foo`,
    endpoints: []
  }
]
