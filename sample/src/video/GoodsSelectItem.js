import React from 'react';

class GoodsSelectItem extends React.Component {  
  onClick =() => {
    const { item } = this.props
    this.props.onClick(item)
  }

  costFormat = (price) => {
    return new Intl.NumberFormat('ko-KR', { currency: 'KRW' }).format(price);
  }

  render() {
    const {item} = this.props
    return <div className={"goods-item" + (this.props.checked ? ' active': '')} onClick={this.onClick}>
      <img src={item.thumbnail_url} alt={`${item.title} thumnail`}/>
      <p className="title text-ellipsis">{item.title}</p>
      <p className="price">{`${this.costFormat(item.price)} 원`}</p>
    </div>
  }
}

export default GoodsSelectItem