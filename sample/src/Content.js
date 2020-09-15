import React from 'react'
import { VideoList, VideoViewer, VideoStreamer, Logout } from './pages'
import { Route } from 'react-router-dom'

class Content extends React.Component {
  render() {
    return (
      <div>
        <Route exact path="/" component={VideoList} />
        <Route exact path="/logout" component={Logout} />
        <Route exact path="/videos/:id" component={VideoViewer} />
        <Route exact path="/videos" component={VideoStreamer} />
      </div>
    )
  }
}

export default Content