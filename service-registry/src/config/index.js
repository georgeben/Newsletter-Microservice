const commonConfig = {
  maxAge: 5,
};

module.exports = function () {
  const environment = process.env.NODE_ENV;
  switch (environment) {
    default:
      return {
        ...commonConfig,
      };
  }
};
