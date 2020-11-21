exports.serializeUser = (user) => {
    return {
      id: user._id,
      email: user.email,
      subscription: user.subscription,
    };
  };