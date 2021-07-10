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
  config.plugins[config.plugins.findIndex(p => p.options && p.options.overlay)].options.overlay.entry = null

  return config
}
