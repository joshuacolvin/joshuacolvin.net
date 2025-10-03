import React from 'react'
import { graphql } from 'gatsby'

import Layout from '../../../components/Layout'
import SEO from '../../../components/seo'

const FlexLiftPrivacyPage = ({ data, location }) => {
  const { site, markdownRemark } = data
  const siteTitle = site.siteMetadata.title
  const policy = markdownRemark

  return (
    <Layout location={location} title={siteTitle}>
      <SEO title="FlexLift Privacy Policy" description={policy.excerpt} />
      <article dangerouslySetInnerHTML={{ __html: policy.html }} />
    </Layout>
  )
}

export default FlexLiftPrivacyPage

export const pageQuery = graphql`
  query FlexLiftPrivacyPage {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(fileAbsolutePath: { regex: "/privacy/flex-lift.md$/" }) {
      html
      excerpt(pruneLength: 160)
    }
  }
`
