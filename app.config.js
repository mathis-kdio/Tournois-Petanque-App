export default ({ config }) => {
  config.hooks.postPublish.config.authToken = process.env.SENTRY_KEY;
  return {
    ...config,
  };
};
