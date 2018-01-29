export default function (kibana) {

  return new kibana.Plugin({
    uiExports: {
      visTypes: [
        'plugins/sm_status_light_visualization/sm_status_light_vis'
      ]
    }
  });
}
