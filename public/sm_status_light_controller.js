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

    function generate_plot(value,label,fillcolor,strokecolor) {
        var xmlns = "http://www.w3.org/2000/svg";
        var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute('id', 'status_' + label);
        svg.setAttribute('width', $scope.vis.params.size);
        svg.setAttribute('height', $scope.vis.params.size);
        svg.setAttribute('viewBox', '0 0 ' +  $scope.vis.params.size + ' ' +  $scope.vis.params.size);
        svg.setAttribute('preserveAspectRatio', "xMinYMin meet");
        svg.style.border =  "0px solid";
        svg.style.fill = $scope.vis.params.backgroundcolor;

        var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", "50%");
        circle.setAttribute("cy", "50%");
        circle.setAttribute("r", ($scope.vis.params.size/2 - $scope.vis.params.strokewidth * 0.75 ));
        circle.style.stroke = strokecolor;
        circle.style.strokeWidth = $scope.vis.params.strokewidth + 'px';
        circle.style.fill = fillcolor;
        circle.style.opacity = 1.0;
        svg.appendChild(circle);

        if($scope.vis.params.showvalue) {
            var text_value = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text_value.setAttribute("x", "50%");
            text_value.setAttribute("y", "50%");
            text_value.setAttribute("text-anchor", "middle");
            text_value.setAttribute("fill", $scope.vis.params.textcolor);
            text_value.setAttribute("dy", "0.0em");

            var tspan_value = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
            tspan_value.style.fontWeight = "bold";
            tspan_value.style.fontSize = $scope.vis.params.fontsize;
            tspan_value.appendChild(document.createTextNode(value));
            text_value.appendChild(tspan_value);
            svg.appendChild(text_value);
        }

        if($scope.vis.params.showbucketkey) {
            var text_label = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text_label.setAttribute("x", "50%");
            text_label.setAttribute("y", "50%");
            text_label.setAttribute("text-anchor", "middle");
            text_label.setAttribute("fill", $scope.vis.params.textcolor);
            if($scope.vis.params.showvalue) {
                text_label.setAttribute("dy", "1.0em");
            } else {
                text_label.setAttribute("dy", "0.0em");
            }

            var tspan_label = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
            if($scope.vis.params.showbucketkey) {
                tspan_label.style.fontSize = ($scope.vis.params.fontsize*0.75);
            } else {
                tspan_label.style.fontSize = $scope.vis.params.fontsize;
                tspan_label.style.fontWeight = "bold";
            }

            tspan_label.appendChild(document.createTextNode(label));
            text_label.appendChild(tspan_label);
            svg.appendChild(text_label);
        }
        return svg.outerHTML;
    }

    $scope.$watchMulti(['esResponse', 'vis.params'], function ([resp]) {
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
                plot: generate_plot(
                    formatValue(getValue(metricsAgg,bucket), $scope.vis.aggs.bySchemaName['metric'][0]['params']['field']['name']),
                    bucket.key,
                    getColorFill(getValue(metricsAgg,bucket)),
                    getColorStroke(getValue(metricsAgg,bucket)))
            };
        });
    });
});
