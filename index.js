const express = require('express')
const fs = require('fs')

const apartmentPassesFilters = (apartment, filters) => {
  return filters.every(filter => {
    if (filter.type === 'checkbox') {
      if (!filter.checked) {
        return true
      }
      if (filter.name === 'layouts.name') {
        return apartment.layouts.some(layout => layout.name === filter.value)
      }
    } else {
      throw new Error(`Unknown filter type: ${filter.type}`)
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
