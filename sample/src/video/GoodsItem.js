import React from 'react';

class GoodsItem extends React.Component {  
  render() {
    const {item} = this.props
    return <div className="col-xl-4 goods-item">
      <img src={item.thumbnail_url} alt={`${item.title} thumnail`}/>
      <p className="title text-ellipsis">{item.title}</p>
      <p className="price">{`${item.price} 원`}</p>
    </div>
  }
}

export default GoodsItem