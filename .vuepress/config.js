module.exports = {
  title: 'GeekTR Blog',
  description: '@GeekTR //志在互联网，所好者繁，染拖延之疾，久治未愈，有乔翁之心，奈何命定庸人。',
  head: [
    ['link', { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    ['link', { rel: 'icon', type: 'image/png', href: '/favicon.png' }]
  ],
  evergreen: true,
  extraWatchFiles: [
    '.vuepress/theme/*',
  ],
  plugins: [
    ['@vuepress/blog', {
      frontmatters: [
        {
          id: "tag",
          keys: ['tag', 'tags'],
          path: '/tags/',
          layout: 'Tags',
          frontmatter: { title: 'Tag' },
          itemlayout: 'Tags',
          pagination: {
            lengthPerPage: 20
          }
        },
      ],
    }],
  ],
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Tags', link: '/tags/' },
    ]
  }
}
