import React from 'react'
import addToMailchimp from 'gatsby-plugin-mailchimp'

import './Subscribe.scss'

class Subscribe extends React.Component {
  constructor(props) {
    super(props)

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)

    this.state = {
      mode: 'subscribe',
    }
  }
  handleChange(e) {
    console.log({
      [`${e.target.name}`]: e.target.value,
    })
    this.setState({
      [`${e.target.name}`]: e.target.value,
    })
  }

  handleSubmit(e) {
    e.preventDefault()

    addToMailchimp(this.state.email, this.state)
      .then(({ msg, result }) => {
        if (result !== 'success') {
          throw msg
        }
        this.setState({ mode: 'subscribed', message: msg })
      })
      .catch(err => {
        this.setState({
          mode: 'error',
          errorMessage: err,
        })
      })
  }

  render() {
    return (
      <div className="subscribe">
        <div className="subscribe-cta">
          <h2 className="title">{this.props.title}</h2>
          <p>{this.props.cta}</p>
        </div>
        <div className="subscribe-form">
          {this.state.mode === 'error' && (
            <p className="error">{this.state.errorMessage}</p>
          )}
          {this.state.mode !== 'subscribed' && (
            <form onSubmit={this.handleSubmit}>
              <label htmlFor="FNAME">
                First Name
                <input
                  type="text"
                  onChange={this.handleChange}
                  placeholder="First name"
                  name="FNAME"
                />
              </label>
              <label htmlFor="email">
                Email
                <input
                  type="email"
                  onChange={this.handleChange}
                  placeholder="email"
                  name="email"
                />
              </label>
              <button type="submit">Subscribe</button>
            </form>
          )}
          {this.state.mode === 'subscribed' && (
            <div>
              <p class="success">{this.state.message}</p>
            </div>
          )}
        </div>
      </div>
    )
  }
}

export default Subscribe
