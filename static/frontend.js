import * as Preact from 'https://unpkg.com/preact@10.4.7/dist/preact.module.js'
import htm from 'https://unpkg.com/htm@3.0.4/dist/htm.module.js'

const html = htm.bind(Preact.createElement)

const apiRequest = async (url) => {
  const response = await window.fetch(url, {
    method: 'GET'
  })
  if (response.status !== 200) {
    throw new Error('Failed to fetch')
  }
  return response.json()
}

class ApartmentsList extends Preact.Component {
  constructor() {
    super()
  }
  formatAddress(address) {
    return `${address.street1}, ${address.street2} ${address.city}, ${address.state}, ${address.zip}`
  }
  render() {
    const { loading, apartments } = this.props
    if (loading) {
      return html`Loading...`
    }
    return html`
      <table border="">
        <thead>
          <tr>
            <th>Name</th>
            <th>Layout</th>
            <th>Price</th>
            <th>Address</th>
          </tr>
        </thead>
        <tbody>
          ${apartments.map(apartment => html`
            <tr key="${apartment.id}">
              <td>${apartment.layout}</td>
              <td>${apartment.name}</td>
              <td>\$${apartment.price}</td>
              <td>${this.formatAddress(apartment.address)}</td>
            </tr>
          `)}
        </tbody>
      </table>
    `
  }
}

class Filters extends Preact.Component {
  constructor() {
    super()
  }
  render() {
    const { onFilterChange, filters } = this.props
    const template = []
    for (let i = 0; i < filters.length; ++i) {
      const filter = filters[i]
      if (filter.type === 'checkbox') {
        template.push(html`<input type="${filter.type}" name="${filter.name}" value="${filter.value}" onChange=${(event) => onFilterChange(event, i)} checked=${filter.checked} /> ${filter.label}<br/>`)
      } else if (filter.type === 'number' || filter.type === 'text') {
        template.push(html`<input type="${filter.type}" name="${filter.name}" value="${filter.value}" onKeyUp=${(event) => onFilterChange(event, i)} /> ${filter.label}<br/>`)
      } else {
        throw new Error(`Unknown filter type: ${filer.type}`)
      }
    }
    return template
  }
}

class App extends Preact.Component {
  constructor() {
    super()
    this.state = {
      loading: false,
      apartments: [],
      filters: [
        {
          type: 'text',
          name: 'zip',
          label: 'Zip code',
          value: ''
        },
        {
          type: 'number',
          name: 'minPrice',
          label: 'Price (min)',
          value: ''
        },
        {
          type: 'number',
          name: 'maxPrice',
          label: 'Price (max)',
          value: ''
        },
        {
          type: 'checkbox',
          name: 'layout',
          value: '2x2',
          label: '2x2',
          checked: true
        },
        {
          type: 'checkbox',
          name: 'layout',
          value: '3x3',
          label: '3x3',
          checked: true
        },
        {
          type: 'checkbox',
          name: 'layout',
          value: '4x4',
          label: '4x4',
          checked: true
        }
      ]
    }
  }
  async fetchApartments(filters) {
    try {
      // set loading true
      this.setState({
        loading: true
      })
      // fetch apartments
      const url = new window.URL(`${window.location.protocol}//${window.location.host}/apartments`)
      url.searchParams.append('filters', JSON.stringify(filters))
      const apartments = await apiRequest(url)
      // set state
      this.setState({
        apartments
      })
    } catch (err) {
      // alert on error
      alert(err)
    } finally {
      // set loading false
      this.setState({
        loading: false
      })
    }
  }
  async componentDidMount() {
    await this.fetchApartments(this.state.filters)
  }
  onFilterChange = async (event, filterIndex) => {
    const newFilters = JSON.parse(JSON.stringify(this.state.filters))
    const filter = newFilters[filterIndex]
    if (filter.type === 'checkbox'){
      newFilters[filterIndex].checked = event.target.checked
    } else if (filter.type === 'number') {
      newFilters[filterIndex].value = parseInt(event.target.value, 10)
    } else if (filter.type === 'text') {
      newFilters[filterIndex].value = event.target.value
    } else {
      throw new Error(`Unknown filer type: ${filter.type}`)
    }
    this.setState({
      filters: newFilters
    })
    await this.fetchApartments(newFilters)
  }
  render() {
    const { loading, apartments, filters } = this.state
    return html`
      <h1>Apartments</h1>
      <${Filters} filters=${filters} onFilterChange=${this.onFilterChange} />
      <${ApartmentsList} loading=${loading} apartments=${apartments} />
    `
  }
}

Preact.render(html`<${App}/>`, document.body)
