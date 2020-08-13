const express = require('express')
const fs = require('fs')

const apartmentPassesFilters = (apartment, filters) => {
  const minPriceFilter = filters.find(filter => filter.name === 'minPrice')
  const maxPriceFilter = filters.find(filter => filter.name === 'maxPrice')
  const zipCodeFilter = filters.find(filter => filter.name === 'zip')
  const layoutFilters = filters.filter(filter => filter.name === 'layout')
  if (minPriceFilter.value) {
    const passes = apartment.price >= minPriceFilter.value
    if (!passes) {
      return false
    }
  }
  if (maxPriceFilter.value) {
    const passes = apartment.price <= maxPriceFilter.value
    if (!passes) {
      return false
    }
  }
  if (zipCodeFilter.value) {
    const passes = apartment.address.zip === zipCodeFilter.value
    if (!passes) {
      return false
    }
  }
  for (let i = 0; i < layoutFilters.length; ++i) {
    const layoutFilter = layoutFilters[i]
    if (!layoutFilter.checked) {
      const passes = apartment.layout !== layoutFilter.value
      if (!passes) {
        return false
      }
    }
  }
  return true
}

const run = () => {
  const db = JSON.parse(fs.readFileSync('db.json'))
  const app = express()
  app.use(express.static('static/'))
  app.use(express.json())
  app.get('/apartments', (req, res) => {
    const filters = JSON.parse(req.query.filters || '[]')
    const filteredApartments = db.apartments.filter(apartment => apartmentPassesFilters(apartment, filters))
    res.send(filteredApartments)
  })
  app.listen(3000, () => console.log('Listening on port 3000'))
}

run()
