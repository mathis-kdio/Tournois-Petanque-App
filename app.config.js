export default ({ config }) => {
  config.hooks.postPublish[0].config.authToken = process.env.SENTRY_KEY;
  return {
    ...config,
  };
};
