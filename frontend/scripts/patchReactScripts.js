const fs = require('fs');
const path = require('path');

const configPath = path.join(
  __dirname,
  '..',
  'node_modules',
  'react-scripts',
  'config',
  'webpackDevServer.config.js'
);

const beforeBlock = `    onBeforeSetupMiddleware(devServer) {
      // Keep \`evalSourceMapMiddleware\`
      // middlewares before \`redirectServedPath\` otherwise will not have any effect
      // This lets us fetch source contents from webpack for the error overlay
      devServer.app.use(evalSourceMapMiddleware(devServer));

      if (fs.existsSync(paths.proxySetup)) {
        // This registers user provided middleware for proxy reasons
        require(paths.proxySetup)(devServer.app);
      }
    },
    onAfterSetupMiddleware(devServer) {
      // Redirect to \`PUBLIC_URL\` or \`homepage\` from \`package.json\` if url not match
      devServer.app.use(redirectServedPath(paths.publicUrlOrPath));

      // This service worker file is effectively a 'no-op' that will reset any
      // previous service worker registered for the same host:port combination.
      // We do this in development to avoid hitting the production cache if
      // it used the same host and port.
      // https://github.com/facebook/create-react-app/issues/2272#issuecomment-302832432
      devServer.app.use(noopServiceWorkerMiddleware(paths.publicUrlOrPath));
    },`;

const replacementBlock = `    setupMiddlewares(middlewares, devServer) {
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined');
      }

      // Keep \`evalSourceMapMiddleware\`
      // middlewares before \`redirectServedPath\` otherwise will not have any effect
      // This lets us fetch source contents from webpack for the error overlay
      devServer.app.use(evalSourceMapMiddleware(devServer));

      if (fs.existsSync(paths.proxySetup)) {
        // This registers user provided middleware for proxy reasons
        require(paths.proxySetup)(devServer.app);
      }

      // Redirect to \`PUBLIC_URL\` or \`homepage\` from \`package.json\` if url not match
      devServer.app.use(redirectServedPath(paths.publicUrlOrPath));

      // This service worker file is effectively a 'no-op' that will reset any
      // previous service worker registered for the same host:port combination.
      // We do this in development to avoid hitting the production cache if
      // it used the same host and port.
      // https://github.com/facebook/create-react-app/issues/2272#issuecomment-302832432
      devServer.app.use(noopServiceWorkerMiddleware(paths.publicUrlOrPath));

      return middlewares;
    },`;

try {
  if (!fs.existsSync(configPath)) {
    console.warn(`[patchReactScripts] Skipped: ${configPath} not found.`);
    process.exit(0);
  }

  const original = fs.readFileSync(configPath, 'utf8');

  if (original.includes('setupMiddlewares(middlewares, devServer)')) {
    console.log('[patchReactScripts] react-scripts dev server patch already applied.');
    process.exit(0);
  }

  if (!original.includes(beforeBlock)) {
    console.warn('[patchReactScripts] Skipped: expected react-scripts block not found.');
    process.exit(0);
  }

  const updated = original.replace(beforeBlock, replacementBlock);
  fs.writeFileSync(configPath, updated, 'utf8');
  console.log('[patchReactScripts] Applied webpack-dev-server deprecation patch.');
} catch (error) {
  console.error('[patchReactScripts] Failed to patch react-scripts:', error.message);
  process.exit(1);
}
