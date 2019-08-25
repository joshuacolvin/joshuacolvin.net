import React from 'react'
import PropTypes from 'prop-types'
import {
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  RedditIcon,
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  RedditShareButton,
} from 'react-share'

import './Share.scss'

const Share = ({ socialConfig }) => (
  <div className="post-social">
    <div className="social-icon">
      <FacebookShareButton
        url={socialConfig.config.url}
        className="share-button"
      >
        <FacebookIcon round size={32} />
      </FacebookShareButton>
    </div>
    <div className="social-icon">
      <TwitterShareButton
        url={socialConfig.config.url}
        title={socialConfig.config.title}
        via={socialConfig.config.twitter.split('@').join('')}
        className="share-button"
      >
        <TwitterIcon round size={32} />
      </TwitterShareButton>
    </div>
    <div className="social-icon">
      <LinkedinShareButton
        url={socialConfig.config.url}
        className="button is-outlined is-rounded linkedin"
        title={socialConfig.config.title}
        className="share-button"
      >
        <LinkedinIcon round size={32} />
      </LinkedinShareButton>
    </div>
    <div className="social-icon">
      <RedditShareButton
        url={socialConfig.config.url}
        className="button is-outlined is-rounded reddit"
        title={socialConfig.config.title}
        className="share-button"
      >
        <RedditIcon round size={32} />
      </RedditShareButton>
    </div>
  </div>
)

Share.propTypes = {
  socialConfig: PropTypes.shape({
    config: PropTypes.shape({
      url: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      twitter: PropTypes.string.isRequired,
    }),
  }).isRequired,
}

export default Share
