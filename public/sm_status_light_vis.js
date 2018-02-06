import optionsTemplate from './options_template.html';
import { StatusLightController } from './sm_status_light_controller';

import { CATEGORY } from 'ui/vis/vis_category';
import { VisFactoryProvider } from 'ui/vis/vis_factory';
import { VisTypesRegistryProvider } from 'ui/registry/vis_types';
import { VisSchemasProvider } from 'ui/vis/editors/default/schemas';

require('plugins/sm_status_light_visualization/sm_status_light_controller')
import template from './sm_status_light.html'

function StatusLightVisProvider(Private) {
  const VisFactory = Private(VisFactoryProvider);
  const Schemas = Private(VisSchemasProvider);

  return VisFactory.createAngularVisualization({
    name: 'sm_status_light_vis',
    title: 'Status Light',
    icon: 'fa fa-circle-o',
    description: 'Status light used to.....',
    category: CATEGORY.OTHER,
    visConfig: {
      template,
      defaults: {
                  textcolor: "#000000",
                  backgroundcolor: "#ffffff",
                  fontsize: 20,
                  size: 100,
                  strokewidth: 10,
                  offThreshold: 0,
                  onThreshold: 1,
                  threeLevel: false,
                  showvalue: true,
                  showbucketkey: true,
                  onFillColor: "#32CD32",
                  onStrokeColor: "#008000",
                  intermediateFillColor: "#ffa31a",
                  intermediateStrokeColor: "#cc7a00",
                  offFillColor: "#C0C0C0",
                  offStrokeColor: "#696969"

              }
    },
    responseHandler: 'none',
    editorConfig: {
          collections: {},
          optionsTemplate,
          schemas: new Schemas([
            {
              group: 'metrics',
              name: 'metric',
              title: 'Value',
              /*min: 1,
              max: 1,
              aggFilter: [ 'top_hits', 'sum']*/
            },
            {
              group: 'buckets',
              name: 'status',
              icon: 'fa fa-eye',
              title: 'View by',
              min: 0,
              max: 1,
              aggFilter: 'terms'
            }
          ])
        }
  });
}

// register the provider with the visTypes registry
VisTypesRegistryProvider.register(StatusLightVisProvider);

export default StatusLightVisProvider;