const nrwlConfig = require('@nrwl/react/plugins/webpack.js')

module.exports = (config, context) => {
  nrwlConfig(config)

  config.node = {
    module: 'empty',
    dgram: 'empty',
    dns: 'mock',
    fs: 'empty',
    http2: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
  }

  // Neuter the error overlay
  const overlayPluginIdx = config.plugins.findIndex(p => p.options && p.options.overlay)
  if (overlayPluginIdx !== -1) {
    config.plugins[overlayPluginIdx].options.overlay.entry = null
  }
  config.output.publicPath = './'

  return config
}
