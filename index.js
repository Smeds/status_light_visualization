export default function (kibana) {

  return new kibana.Plugin({
    uiExports: {
      visTypes: [
        'plugins/status_light_visualization/status_light_vis'
      ]
    }
  });
}
