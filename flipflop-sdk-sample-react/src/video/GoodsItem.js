import React from 'react';

class GoodsItem extends React.Component {  
  costFormat = (price) => {
    return new Intl.NumberFormat('ko-KR', { currency: 'KRW' }).format(price);
  }

  render() {
    const {item} = this.props
    return <div className="goods-item">
      <img src={item.thumbnail_url} alt={`${item.title} thumnail`}/>
      <p className="title text-ellipsis">{item.title}</p>
      <p className="price">{`${this.costFormat(item.price)} 원`}</p>
    </div>
  }
}

export default GoodsItem