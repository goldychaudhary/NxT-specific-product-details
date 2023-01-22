import {Component} from 'react'
import Cookies from 'js-cookie'
import {Loader} from 'react-loader-spinner'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Header from '../Header'

import SimilarProductItem from '../SimilarProductItem'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productDetails: {},
    similarProductsList: [],
    count: 1,
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getDetails()
  }

  getDetails = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/products/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    const data = await response.json()
    console.log('data', data)
    if (response.ok === true) {
      const productDetailsData = {
        availability: data.availability,
        brand: data.brand,
        description: data.description,
        id: data.id,
        imageUrl: data.image_url,
        price: data.price,
        rating: data.rating,
        style: data.style,
        title: data.title,
        totalReviews: data.total_reviews,
      }

      const similarProductsData = data.similar_products.map(each => ({
        brand: data.brand,
        id: each.id,
        imageUrl: each.image_url,
        price: each.price,
        rating: each.rating,
        title: data.title,
      }))

      this.setState({
        productDetails: productDetailsData,
        similarProductsList: similarProductsData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  onDecQuantity = () => {
    this.setState(prevState => ({count: prevState.count - 1}))
  }

  onIncQuantity = () => {
    this.setState(prevState => ({count: prevState.count + 1}))
  }

  renderItemDetails = () => {
    const {productDetails, count} = this.state

    return (
      <div className="product-details-section-bg">
        <img
          className="product-pic"
          src={productDetails.imageUrl}
          alt="product"
        />
        <div className="product-detail-content-bg">
          <h1>{productDetails.title}</h1>
          <p className="price">Rs {productDetails.price}/- </p>
          <div className="rating-review-container">
            <div className="rating">
              <p>{productDetails.rating}</p>
              <img
                className="star-pic"
                src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                alt="star"
              />
            </div>
            <p className="review-para">{productDetails.totalReviews} Reviews</p>
          </div>
          <p className="description">{productDetails.description}</p>
          <p className="availability">
            Available: {productDetails.availability}
          </p>
          <p className="availability">Brand: {productDetails.brand}</p>
          <hr className="hr-line" />
          <div className="count-container">
            <button
              data-testid="minus"
              onClick={this.onDecQuantity}
              className="plus-btn"
              type="button"
            >
              <BsDashSquare />
            </button>
            <p className="count-para">{count}</p>
            <button
              data-testid="plus"
              onClick={this.onIncQuantity}
              className="plus-btn"
              type="button"
            >
              <BsPlusSquare />
            </button>
          </div>
          <button className="add-cart-btn" type="button">
            ADD TO CART
          </button>
        </div>
      </div>
    )
  }

  renderProductDetails = () => {
    const {similarProductsList} = this.state
    console.log('product details')
    return (
      <div>
        <Header />
        {this.renderItemDetails()}
        <h1 className="similar-heading">Similar Products</h1>
        <ul className="similar-prod-container">
          {similarProductsList.map(each => (
            <SimilarProductItem key={each.id} details={each} />
          ))}
        </ul>
      </div>
    )
  }

  continueShopping = () => {
    const {history} = this.props
    history.replace('/products')
  }

  renderProductFailureView = () => (
    <>
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="error view"
        className="register-prime-image"
      />
      <h1>Product Not Found</h1>
      <button onClick={this.continueShopping()} type="button">
        Continue Shopping
      </button>
    </>
  )

  renderLoading = () => (
    <div data-testid="loader" className="primedeals-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  render() {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductDetails()

      case apiStatusConstants.failure:
        return this.renderProductFailureView()

      case apiStatusConstants.inProgress:
        return this.renderLoading()

      default:
        return null
    }

    // if (apiStatus === apiStatusConstants.success) {
    //   console.log('success if block')
    //   return this.renderProductDetails()
    // }
    // if (apiStatus === apiStatusConstants.failure) {
    //   console.log('fail if block')
    //   return this.renderProductFailureView()
    // }
    // if (apiStatus === apiStatusConstants.inProgress) {
    //   console.log('load if block')
    //   return this.renderLoading()
    // }

    // return null
  }
}

export default ProductItemDetails
