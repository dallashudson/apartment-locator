const express = require('express')
const fs = require('fs')

const apartmentPassesFilters = (apartment, filters) => {
  return filters.every(filter => {
    if (filter.name === 'layout') {
      // no filter value yet, always include
      if (!filter.checked) {
        return true
      }
      return apartment.layout === filter.value
    } else if (filter.name === 'minPrice') {
      // no filter value yet, always include
      if (!filter.value) {
        return true
      }
      return apartment.price >= filter.value
    } else if (filter.name === 'maxPrice') {
      // no filter value yet, always include
      if (!filter.value) {
        return true
      }
      return apartment.price <= filter.value
    } else if (filter.name === 'address.zip') {
      // no filter value yet, always include
      if (!filter.value) {
        return true
      }
      return apartment.address.zip === filter.value
    } else {
      throw new Error(`Unknown filter name: ${filter.name}`)
    }
  })
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
