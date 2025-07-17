export const filterProducts = (products, filters) => {
  let filtered = [...products]

  // Filter by categories
  if (filters.category) {
    filtered = filtered.filter((product) => product.categoryId === filters.category)
  }

  // Filter by vendor
  if (filters.vendor) {
    filtered = filtered.filter((product) => product.vendorId === filters.vendor)
  }

  // Filter by price range
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    filtered = filtered.filter((product) => {
      const price = product.price
      const minPrice = filters.minPrice || 0
      const maxPrice = filters.maxPrice || Number.POSITIVE_INFINITY
      return price >= minPrice && price <= maxPrice
    })
  }

  // Filter by stock
  if (filters.inStock) {
    filtered = filtered.filter((product) => {
      if (product.variants && product.variants.length > 0) {
        return product.variants.some((variant) => variant.stock > 0)
      }
      return product.stock > 0
    })
  }

  // Filter by comfort tags
  if (filters.tags && filters.tags.length > 0) {
    filtered = filtered.filter((product) => {
      return filters.tags.some((tag) => product.comfortTags && product.comfortTags.includes(tag))
    })
  }

  // Filter by status
  filtered = filtered.filter((product) => product.status === "active")

  return filtered
}

export const sortProducts = (products, sortOption) => {
  const sorted = [...products]

  switch (sortOption) {
    case "Price: Low to High":
      return sorted.sort((a, b) => a.price - b.price)
    case "Price: High to Low":
      return sorted.sort((a, b) => b.price - a.price)
    case "Newest":
      return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    case "Name: A to Z":
      return sorted.sort((a, b) => a.name.localeCompare(b.name))
    case "Stock: High to Low":
      return sorted.sort((a, b) => {
        const aStock = a.variants?.reduce((sum, v) => sum + v.stock, 0) || a.stock
        const bStock = b.variants?.reduce((sum, v) => sum + v.stock, 0) || b.stock
        return bStock - aStock
      })
    case "Featured":
    default:
      return sorted.sort((a, b) => {
        if (a.isFeatured && !b.isFeatured) return -1
        if (!a.isFeatured && b.isFeatured) return 1
        return new Date(b.createdAt) - new Date(a.createdAt)
      })
  }
}

export const getCategoryName = (categoryId, categories) => {
  const category = categories.find((cat) => cat._id === categoryId)
  return category ? category.name : "Unknown Category"
}
