@CB:R01
# testfile: test/service_test.go
# link: https://github.com/knative/specs/blob/main/specs/serving/knative-api-specification-1.0.md#status-2
# status: passed
Scenario: Route URL's must contain their scheme
  Given a service status with a route
  When the owned route is given a url to reach the application
  Then the URL must contain its scheme

@CB:S25
# testfile: test/route_test.go
# status: passed
# link: https://github.com/knative/specs/blob/main/specs/common/error-signalling.md
Scenario: Route error signaling is reflected in owning Service
  Given a Service owning a Route
  And the Service has a RouteReady status
  When the Route's status is False
  Then the Services's RouteReady status is False

@CB:S26
# status: untested
# link: https://github.com/knative/specs/blob/main/specs/serving/knative-api-specification-1.0.md#metadata
Scenario: Owned Configuration and Route must have correct service label
  Given a service named Foo
  When a configuration and route are owned by service Foo
  Then they both have the serving.knative.dev/service label
  And the serving.knative.dev/service label's value is Foo
