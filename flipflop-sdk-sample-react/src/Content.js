import React from 'react'
import { VideoList, VideoViewer, VideoStreamer, Logout, MobileViewer } from './pages'
import { Route } from 'react-router-dom'

class Content extends React.Component {
  render() {
    return (
      <div className="content">
        <Route exact path="/" component={VideoList} />
        <Route exact path="/logout" component={Logout} />
        <Route exact path="/videos/:id" component={VideoViewer} />
        <Route exact path="/videos" component={VideoStreamer} />
        <Route exact path="/mv" component={MobileViewer} />
      </div>
    )
  }
}

export default Content