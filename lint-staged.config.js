module.exports = {
  "*.(js|jsx|ts|tsx)": ["yarn lint", "yarn test --findRelatedTests"],
  "*.+(js|jsx|json|yml|yaml|css|less|scss|ts|tsx|md|graphql|mdx)": [
    "yarn format",
  ],
};
