import React from 'react';

class GoodsSelectItem extends React.Component {  
  onClick =() => {
    const { item } = this.props
    this.props.onClick(item)
  }

  render() {
    const {item} = this.props
    return <div className={"col-xl-4 goods-item" + (this.props.checked ? ' active': '')} onClick={this.onClick}>
      <img src={item.thumbnail_url} alt={`${item.title} thumnail`}/>
      <p className="title text-ellipsis">{item.title}</p>
      <p className="price">{`${item.price} 원`}</p>
    </div>
  }
}

export default GoodsSelectItem