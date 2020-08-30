import React from 'react'
import { Link, graphql } from 'gatsby'

import Bio from '../components/Bio'
import Layout from '../components/Layout'
import SEO from '../components/seo'
import { rhythm, scale } from '../utils/typography'
import Share from '../components/Share'
import Subscribe from '../components/Subscribe'

class BlogPostTemplate extends React.Component {
  render() {
    const post = this.props.data.markdownRemark
    const siteTitle = this.props.data.site.siteMetadata.title
    const siteUrl = this.props.data.site.siteMetadata.siteUrl
    const { previous, next } = this.props.pageContext

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO title={post.frontmatter.title} description={post.excerpt} />
        <h1>{post.frontmatter.title}</h1>
        <p
          style={{
            ...scale(-1 / 5),
            display: `block`,
            marginBottom: rhythm(1),
            marginTop: rhythm(-1),
          }}
        >
          {post.frontmatter.date}
          <span> &#183; </span>
          {post.fields.readingTime.text}
        </p>
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
        <div>
          Find this article interesting? <a href="https://twitter.com/joshuacolvin" target="_blank">Follow me on Twitter</a> for related content.
        </div>
        {/* <Share
          socialConfig={{
            config: {
              url: `${siteUrl}${post.fields.slug}`,
              title: post.frontmatter.title,
              twitter: this.props.data.site.siteMetadata.social.twitter,
            },
          }}
        /> */}
        <Bio />
        {/* <Subscribe
          title="Never Miss a Post"
          cta="Get articles like this one in your inbox"
        /> */}
      </Layout>
    )
  }
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
        siteUrl
        social {
          twitter
        }
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
      }
      fields {
        slug
        readingTime {
          text
        }
      }
    }
  }
`
