import './index.css'
import {BsSearch} from 'react-icons/bs'

const Category = props => {
  const {item, categoryChange, isActive} = props
  const {name, categoryId} = item
  const categoryChangeFun = () => {
    categoryChange(categoryId)
  }
  const newClassName = isActive ? 'active-category' : 'category'
  return (
    <li>
      <button
        onClick={categoryChangeFun}
        className={newClassName}
        type="button"
      >
        <p className="category-para">{name}</p>
      </button>
    </li>
  )
}

const Rating = props => {
  const {item, ratingChange} = props
  const {ratingId, imageUrl} = item
  const ratingChangeFun = () => {
    ratingChange(ratingId)
  }

  return (
    <li>
      <button onClick={ratingChangeFun} className="rating-item" type="button">
        <img
          className="rating-image"
          src={imageUrl}
          alt={`rating ${ratingId}`}
        />
        <p className="rating-para">& up</p>
      </button>
    </li>
  )
}

const FiltersGroup = props => {
  const {
    categoryList,
    ratingList,
    onRatingChange,
    onCategoryChange,
    onClearFilters,
    onInputChange,
    onInputValChange,
    inputVal,
    activeCategory,
  } = props

  const clearFilters = () => {
    onClearFilters()
  }

  const inputChange = event => {
    if (event.key === 'Enter') {
      onInputChange(event.target.value)
    }
  }

  const inputOnChange = event => {
    onInputValChange(event.target.value)
  }

  return (
    <div className="filters-group-container">
      <div className="search-input-container">
        <input
          className="search-input"
          type="search"
          placeholder="Search"
          id="search-input"
          onKeyUp={inputChange}
          onChange={inputOnChange}
          value={inputVal}
        />
        <label htmlFor="search-input">
          <BsSearch className="search-icon" />
        </label>
      </div>
      <div className="category-container">
        <h1 className="category-heading">Category</h1>
        <ul className="category-items-container">
          {categoryList.map(item => (
            <Category
              categoryChange={onCategoryChange}
              item={item}
              key={item.categoryId}
              isActive={item.categoryId === activeCategory}
            />
          ))}
        </ul>
      </div>
      <div className="rating-stars-container">
        <h1 className="rating-heading">Rating</h1>
        <ul className="rating-items-container">
          {ratingList.map(item => (
            <Rating
              ratingChange={onRatingChange}
              item={item}
              key={item.ratingId}
            />
          ))}
        </ul>
      </div>
      <button onClick={clearFilters} className="clear-filters" type="button">
        Clear Filters
      </button>
    </div>
  )
}

export default FiltersGroup
