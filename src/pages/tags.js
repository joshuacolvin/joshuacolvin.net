import React from 'react'
import PropTypes from 'prop-types'
// Utilities
import kebabCase from 'lodash/kebabCase'

// Components
import { Helmet } from 'react-helmet'
import { Link, graphql } from 'gatsby'
import Layout from '../components/Layout'

const TagsPage = ({
  data: {
    allMarkdownRemark: { group },
    site: {
      siteMetadata: { title },
    },
  },
}) => (
  <Layout title={title}>
    <div>
      <h2>All Tags</h2>
      <div
        className="tags"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(125px, 1fr))',
          gap: '8px',
        }}
      >
        {group.map(tag => (
          <Link
            className="tag"
            key={tag.fieldValue}
            to={`/tags/${kebabCase(tag.fieldValue.toLowerCase())}/`}
            style={{
              boxShadow: 'none',
              color: '#fff',
              fontWeight: 'bold',
            }}
          >
            {tag.fieldValue}
          </Link>
        ))}
      </div>
    </div>
  </Layout>
)

TagsPage.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      group: PropTypes.arrayOf(
        PropTypes.shape({
          fieldValue: PropTypes.string.isRequired,
          totalCount: PropTypes.number.isRequired,
        }).isRequired
      ),
    }),
    site: PropTypes.shape({
      siteMetadata: PropTypes.shape({
        title: PropTypes.string.isRequired,
      }),
    }),
  }),
}

export default TagsPage

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        menuLinks {
          name
          link
        }
      }
    }
    allMarkdownRemark(limit: 2000) {
      group(field: frontmatter___tags) {
        fieldValue
        totalCount
      }
    }
  }
`
