import angular from 'angular';
import { uiModules } from 'ui/modules';

const module = uiModules.get('status_light_visualization/status_light_visualization', ['kibana']);
module.controller('StatusLightVisController', function ($scope, courier, $timeout) {
    function getColorFill(value) {
        if (value == "NA") {
            return $scope.vis.params.offFillColor;
        }
        if(value <= $scope.vis.params.offThreshold) {
            return $scope.vis.params.offFillColor;
        } else if($scope.vis.params.threeLevel && value <= $scope.vis.params.onThreshold ) {
            return $scope.vis.params.intermediateFillColor;
        } else {
            return $scope.vis.params.onFillColor;
        }
    }

    function formatValue(value,field) {
        if (value == "NA") {
            return value;
        }
        if(field.indexOf(".ms") != -1) {
            var days = Math.floor(value / (24*60*60*1000));
            var hours = Math.floor((value % (24*60*60*1000))/(60*60*1000));
            var minutes = Math.floor((value % (60*60*1000))/(60*1000));
            var sec = Math.floor((value % (60*1000))/(1000));
            if(days > 1) {
                return days + " d";
            }
            if(days > 0) {
                return days + " d " + hours + " h";
            }
            if(hours > 12) {
                return hours + " h";
            }
            if(hours > 0) {
                return hours + " h " + minutes + " m";
            }
            return minutes + " m " + sec + " s";
        }
        if(value % 1 != 0) {
            return Number(value).toFixed(2);
        }
        return value;
    }

    function getColorStroke(value) {
        if (value == "NA") {
            return $scope.vis.params.offStrokeColor;
         }
         if(value <= $scope.vis.params.offThreshold) {
             return $scope.vis.params.offStrokeColor;
         } else if($scope.vis.params.threeLevel && value <= $scope.vis.params.onThreshold ) {
             return $scope.vis.params.intermediateStrokeColor;
         } else {
             return $scope.vis.params.onStrokeColor;
         }
    }

    function getValue(metricsAgg, bucket) {
        return metricsAgg.getValue(bucket) ? metricsAgg.getValue(bucket) : 'NA';
    }

    $scope.$watch('esResponse', function(resp) {
        if (!resp) {
            $scope.status = null;
            return;
        }

        // Retrieve the id of the configured tags aggregation
        var statusAggId = $scope.vis.aggs.bySchemaName['status'][0].id;

        // Get the buckets of that aggregation
        var buckets = resp.aggregations[statusAggId].buckets;
        // Transform all buckets into tag objects
        var metricsAgg = $scope.vis.aggs.bySchemaName['metric'][0];

        $scope.status = buckets.map(function(bucket) {
            return {
                label: bucket.key,
                value: formatValue(getValue(metricsAgg,bucket), $scope.vis.aggs.bySchemaName['metric'][0]['params']['field']['name']),
                fillcolor: getColorFill(getValue(metricsAgg,bucket)),
                strokecolor: getColorStroke(getValue(metricsAgg,bucket))
            };
        });
    });

    $scope.$watch(function() {
        // Retrieve the id of the configured tags aggregation
        var statusAggId = $scope.vis.aggs.bySchemaName['status'][0].id;
        // Get the buckets of that aggregation
        var buckets = resp.aggregations[statusAggId].buckets;
        // Transform all buckets into tag objects
        var metricsAgg = $scope.vis.aggs.bySchemaName['metric'][0];

        $scope.status = buckets.map(function(bucket) {
            return {
                label: bucket.key,
                value: formatValue(getValue(metricsAgg,bucket), $scope.vis.aggs.bySchemaName['metric'][0]['params']['field']['name']),
                fillcolor: getColorFill(getValue(metricsAgg,bucket)),
                strokecolor: getColorStroke(getValue(metricsAgg,bucket))
            };
        });
    });
});
