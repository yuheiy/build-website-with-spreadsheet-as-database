module.exports = (eleventyConfig) => {
  eleventyConfig.addFilter('jsSlice', (arrayOrString, start, end) => {
    return arrayOrString.slice(start, end)
  })

  return {
    dir: {
      input: 'src',
      output: 'dist',
    },
  }
}
