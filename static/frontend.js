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
  render() {
    const { loading, apartments } = this.props
    if (loading) {
      return html`Loading...`
    }
    return html`<ul>
      ${apartments.map(apartment => html`<li key="${apartment.id}">${apartment.name}</li>`)}
    </ul>`
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
        template.push(html`<input type="checkbox" name="${filter.name}" value="${filter.value}" onChange=${(event) => onFilterChange(event, i)} checked=${filter.checked} /> ${filter.label}<br/>`)
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
          type: 'checkbox',
          name: 'layouts.name',
          value: '2x2',
          label: '2x2',
          checked: false
        },
        {
          type: 'checkbox',
          name: 'layouts.name',
          value: '3x3',
          label: '3x3',
          checked: false
        },
        {
          type: 'checkbox',
          name: 'layouts.name',
          value: '4x4',
          label: '4x4',
          checked: false
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
