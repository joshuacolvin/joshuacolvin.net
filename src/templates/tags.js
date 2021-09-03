import React from 'react'
import PropTypes from 'prop-types'

// Components
import { Link, graphql } from 'gatsby'
import Layout from '../components/Layout'

const Tags = ({ pageContext, data }) => {
  const { tag } = pageContext
  const { edges, totalCount } = data.allMarkdownRemark
  const { title } = data.site.siteMetadata

  return (
    <Layout title={title}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2.625rem',
        }}
      >
        <h2 style={{ margin: 0 }}>
          {tag}{' '}
          <span style={{ fontSize: '13px', padding: '8px' }}>
            <Link to="/tags">all tags</Link>
          </span>
        </h2>
        <span>{totalCount} Posts</span>
      </div>
      <div style={{ display: 'grid' }}>
        {edges.map(({ node }) => {
          const { slug } = node.fields
          const { title } = node.frontmatter

          return (
            <div key={slug}>
              <Link to={slug}>{title}</Link>
              <p>{node.excerpt}</p>
            </div>
          )
        })}
      </div>
    </Layout>
  )
}

Tags.propTypes = {
  pageContext: PropTypes.shape({
    tag: PropTypes.string.isRequired,
  }),
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      totalCount: PropTypes.number.isRequired,
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            frontmatter: PropTypes.shape({
              title: PropTypes.string.isRequired,
            }),
            fields: PropTypes.shape({
              slug: PropTypes.string.isRequired,
            }),
            excerpt: PropTypes.string.isRequired,
          }),
        }).isRequired
      ),
    }),
  }),
}

export default Tags

export const pageQuery = graphql`
  query($tag: String) {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      limit: 2000
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { tags: { in: [$tag] } } }
    ) {
      totalCount
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            title
          }
          excerpt
        }
      }
    }
  }
`
