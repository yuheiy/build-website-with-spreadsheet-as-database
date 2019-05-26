module.exports = (eleventyConfig) => {
  eleventyConfig.addFilter('jsSlice', (arrayOrString, start, end) => {
    return arrayOrString.slice(start, end)
  })

  eleventyConfig.addCollection('works', (collection) => {
    return collection.getFilteredByGlob('src/works/*.md').sort((a, b) => {
      return a.data.order - b.data.order
    })
  })

  return {
    dir: {
      input: 'src',
      output: 'dist',
    },
  }
}
