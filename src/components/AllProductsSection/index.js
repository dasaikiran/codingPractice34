import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import FiltersGroup from '../FiltersGroup'
import ProductCard from '../ProductCard'
import ProductsHeader from '../ProductsHeader'

import './index.css'

const categoryOptions = [
  {
    name: 'Clothing',
    categoryId: '1',
  },
  {
    name: 'Electronics',
    categoryId: '2',
  },
  {
    name: 'Appliances',
    categoryId: '3',
  },
  {
    name: 'Grocery',
    categoryId: '4',
  },
  {
    name: 'Toys',
    categoryId: '5',
  },
]

const sortbyOptions = [
  {
    optionId: 'PRICE_HIGH',
    displayText: 'Price (High-Low)',
  },
  {
    optionId: 'PRICE_LOW',
    displayText: 'Price (Low-High)',
  },
]

const ratingsList = [
  {
    ratingId: '4',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-four-stars-img.png',
  },
  {
    ratingId: '3',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-three-stars-img.png',
  },
  {
    ratingId: '2',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-two-stars-img.png',
  },
  {
    ratingId: '1',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-one-star-img.png',
  },
]

const statusChekingList = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'RENDER',
  initial: 'INITIAL',
  noProduct: 'NO PRODUCTS',
}

class AllProductsSection extends Component {
  state = {
    productsList: [],
    statusNow: statusChekingList.initial,
    activeOptionId: sortbyOptions[0].optionId,
    titleSearch: '',
    category: '',
    rating: '',
    input: '',
  }

  componentDidMount() {
    this.getProducts()
  }

  getProducts = async () => {
    this.setState({
      statusNow: statusChekingList.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')

    // TODO: Update the code to get products with filters applied

    const {activeOptionId, titleSearch, category, rating} = this.state
    console.log(titleSearch)
    const apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}&category=${category}&title_search=${titleSearch}&rating=${rating}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    try {
      const response = await fetch(apiUrl, options)
      const fetchedData = await response.json()
      if (response.ok) {
        const updatedData = fetchedData.products.map(product => ({
          title: product.title,
          brand: product.brand,
          price: product.price,
          id: product.id,
          imageUrl: product.image_url,
          rating: product.rating,
        }))
        if (updatedData.length > 0) {
          this.setState({
            productsList: updatedData,
            statusNow: statusChekingList.success,
          })
        } else {
          this.setState({
            statusNow: statusChekingList.noProduct,
          })
        }
      }
    } catch (e) {
      this.setState({
        statusNow: statusChekingList.failure,
      })
    }
  }

  changeSortby = activeOptionId => {
    this.setState({activeOptionId}, this.getProducts)
  }

  onCategoryChange = id => {
    this.setState(
      {
        category: id,
      },
      this.getProducts,
    )
  }

  onRatingChange = id => {
    this.setState(
      {
        rating: id,
      },
      this.getProducts,
    )
  }

  onInputChange = val => {
    this.setState(
      {
        titleSearch: val,
      },
      this.getProducts,
    )
  }

  onClearFilters = () => {
    this.setState(
      {
        titleSearch: '',
        input: '',
        category: '',
        rating: '',
        activeOptionId: sortbyOptions[0].optionId,
      },
      this.getProducts,
    )
  }

  onInputValChange = val => {
    this.setState({input: val})
  }

  renderProductsList = () => {
    const {productsList, activeOptionId} = this.state

    // TODO: Add No Products View
    return (
      <div className="all-products-container">
        <ProductsHeader
          activeOptionId={activeOptionId}
          sortbyOptions={sortbyOptions}
          changeSortby={this.changeSortby}
        />
        <ul className="products-list">
          {productsList.map(product => (
            <ProductCard productData={product} key={product.id} />
          ))}
        </ul>
      </div>
    )
  }

  renderLoader = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  // TODO: Add failure view
  failure = () => (
    <div className="failure-container">
      <img
        className="failure-image"
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png "
        alt="products failure"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-para">
        We are having some trouble processing your request.Please try again.
      </p>
    </div>
  )

  noProduct = () => (
    <div className="no-products-container">
      <img
        className="no-products-image"
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png"
        alt="no products"
      />
      <h1 className="no-products-heading">No Products Found</h1>
      <p className="no-products-para">
        We could not find any products.Try other filters.
      </p>
    </div>
  )

  getFunToSwitch = statusNow => {
    switch (statusNow) {
      case statusChekingList.failure:
        return this.failure()
      case statusChekingList.success:
        return this.renderProductsList()
      case statusChekingList.inProgress:
        return this.renderLoader()
      case statusChekingList.noProduct:
        return this.noProduct()
      default:
        return null
    }
  }

  render() {
    const {statusNow, input, category} = this.state

    return (
      <div className="all-products-section">
        {/* TODO: Update the below element */}
        <FiltersGroup
          categoryList={categoryOptions}
          ratingList={ratingsList}
          onRatingChange={this.onRatingChange}
          onCategoryChange={this.onCategoryChange}
          onClearFilters={this.onClearFilters}
          onInputChange={this.onInputChange}
          inputVal={input}
          onInputValChange={this.onInputValChange}
          activeCategory={category}
        />
        {this.getFunToSwitch(statusNow)}
      </div>
    )
  }
}

export default AllProductsSection
