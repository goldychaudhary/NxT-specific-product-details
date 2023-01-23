import './index.css'

const SimilarProductItem = props => {
  const {details} = props
  const {imageUrl, title, brand, price, rating} = details

  return (
    <li className="similar-prod-card">
      <img src={imageUrl} alt={`similar product ${title}`} />
      <p className="similar-title">{title}</p>
      <p className="similar-brand">by {brand}</p>
      <div className="similar-rating-price">
        <p className="price">Rs {price}/- </p>
        <div className="rating">
          <p>{rating}</p>
          <img
            className="star-pic"
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
          />
        </div>
      </div>
    </li>
  )
}
export default SimilarProductItem
