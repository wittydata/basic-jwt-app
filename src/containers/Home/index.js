import React, { Component } from 'react'
import { connect } from 'react-redux'
import { authService } from '../../services'

// UI
import './styles.css'

class Home extends Component {
  constructor (props) {
    super(props)
    const user = authService.getCurrentUser()
    this.state = {
      user
    }
  }

  render () {
    const { user } = this.state
    const { name } = user

    return (
      <div className='wd-home'>
        <h2>Welcome, {name}</h2>

        <div className='text'>
          If you sign in as Admin, you will be able to navigate to both <b>Notes</b> and <b>Users</b> sections.
        </div>

        <div className='text'>
          Otherwise, you only will be able to navigate to both <b>Notes</b> section.
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = {
}

const mapStateToProps = (state) => {
  return state
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home)
