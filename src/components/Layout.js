import React from 'react'
import { Link } from 'gatsby'
import { ThemeToggler } from 'gatsby-plugin-dark-mode'
import Toggle from 'react-toggle'
import { FiSun, FiMoon } from 'react-icons/fi'

import { rhythm, scale } from '../utils/typography'

class Layout extends React.Component {
  render() {
    const { location, title, children } = this.props
    const isRootPath = location.pathname === `${__PATH_PREFIX__}/`
    const pageNumber = location.pathname
      .split('/')
      .filter(Boolean)
      .pop()
    const isPaginatedPath = pageNumber && Boolean(pageNumber.match(/^[0-9]+$/))
    let header

    if (isRootPath || isPaginatedPath) {
      header = (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2.625rem',
            lineHeight: '2.625rem',
          }}
        >
          <h1
            style={{
              marginBottom: 0,
              marginTop: 0,
              fontSize: '1.98818rem',
              lineHeight: '2.625rem',
            }}
          >
            <Link
              style={{
                boxShadow: `none`,
                textDecoration: `none`,
                color: `inherit`,
              }}
              to={`/`}
            >
              {title}
            </Link>
          </h1>
          <ThemeToggler>
            {({ theme, toggleTheme }) => (
              <Toggle
                aria-label="switch between light and dark mode"
                className="dark-mode-toggle"
                checked={theme === 'dark'}
                onChange={e => toggleTheme(e.target.checked ? 'dark' : 'light')}
                icons={{
                  checked: <FiMoon />,
                  unchecked: <FiSun />,
                }}
              />
            )}
          </ThemeToggler>
        </div>
      )
    } else {
      header = (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2.625rem',
          }}
        >
          <h3
            style={{
              fontFamily: `Montserrat, sans-serif`,
              marginTop: 0,
              marginBottom: 0,
              lineHeight: '2.625rem',
            }}
          >
            <Link
              style={{
                boxShadow: `none`,
                textDecoration: `none`,
                color: `inherit`,
              }}
              to={`/`}
            >
              {title}
            </Link>
          </h3>
          <ThemeToggler>
            {({ theme, toggleTheme }) => (
              <Toggle
                aria-label="switch between light and dark mode"
                className="dark-mode-toggle"
                checked={theme === 'dark'}
                onChange={e => toggleTheme(e.target.checked ? 'dark' : 'light')}
                icons={{
                  checked: <FiMoon />,
                  unchecked: <FiSun />,
                }}
              />
            )}
          </ThemeToggler>
        </div>
      )
    }
    return (
      <div
        style={{
          marginLeft: `auto`,
          marginRight: `auto`,
          maxWidth: rhythm(24),
          padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
        }}
      >
        {header}
        {children}
      </div>
    )
  }
}

export default Layout
