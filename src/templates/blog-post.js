import React from 'react'
import { Link, graphql } from 'gatsby'

import Bio from '../components/Bio'
import Layout from '../components/Layout'
import SEO from '../components/seo'
import { rhythm, scale } from '../utils/typography'
import Share from '../components/Share'
import Subscribe from '../components/Subscribe'
import Tag from '../components/Tag'

class BlogPostTemplate extends React.Component {
  render() {
    const post = this.props.data.markdownRemark
    const siteTitle = this.props.data.site.siteMetadata.title
    const menuLinks = this.props.data.site.siteMetadata.menuLinks
    const siteUrl = this.props.data.site.siteMetadata.siteUrl
    const { previous, next } = this.props.pageContext

    return (
      <Layout title={siteTitle} menuLinks={menuLinks}>
        <SEO title={post.frontmatter.title} description={post.excerpt} />
        <h1>{post.frontmatter.title}</h1>
        <p
          style={{
            ...scale(-1 / 5),
            display: `block`,
            marginBottom: rhythm(0),
            marginTop: rhythm(-1),
          }}
        >
          Published {post.frontmatter.date}
          <span style={{ padding: rhythm(0.5) }}> &#183; </span>
          {post.fields.readingTime.text}
        </p>

        <div
          className="tags"
          style={{ marginBottom: rhythm(1), marginTop: rhythm(0.5) }}
        >
          {post.frontmatter.tags &&
            post.frontmatter.tags.map((tag, index) => (
              <Tag tag={tag} key={index}></Tag>
            ))}
        </div>
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
        <div>
          Find this article helpful or interesting?{' '}
          <a href="https://twitter.com/joshuacolvin" target="_blank">
            Follow me on Twitter
          </a>{' '}
          for related content.
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
        menuLinks {
          name
          link
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
        tags
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
