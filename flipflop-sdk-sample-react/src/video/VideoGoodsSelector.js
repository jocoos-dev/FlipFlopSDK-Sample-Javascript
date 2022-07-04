import React from 'react';
import configs from '../Configs'
import GoodsSelectItem from './GoodsSelectItem';

class VideoGoodsSelector extends React.Component {
  render() {
    const items = configs.SAMPLE_GOODS.map((item, index) => (
      <GoodsSelectItem key={index} item={item} checked={this.props.items.findIndex(i => i.id === item.id) >= 0} onClick={this.props.onClick}/>
    ))
    return <div className="row goods-selecter">
      { items }
    </div>
  }
}

export default VideoGoodsSelector;