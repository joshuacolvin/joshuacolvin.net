import React from 'react'
import { Link } from 'gatsby'
import kebabCase from 'lodash/kebabCase'

const Tag = ({ tag }) => (
  <Link
    style={{
      boxShadow: 'none',
      padding: '4px 12px',
      color: '#fff',
      background: '#007ACC',
      borderRadius: '3px',
      fontSize: '13px',
      fontWeight: 700,
      textAlign: 'center',
    }}
    to={`/tags/${kebabCase(tag.toLowerCase())}/`}
  >
    {tag.toLowerCase()}
  </Link>
)

export default Tag
