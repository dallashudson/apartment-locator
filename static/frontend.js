// 1. imports from unpkg.com
import * as Preact from 'https://unpkg.com/preact@10.4.7/dist/preact.module.js'
import htm from 'https://unpkg.com/htm@3.0.4/dist/htm.module.js'
// 2. make htm import work with Preact import
const html = htm.bind(Preact.createElement)
// 3. define App component
class App extends Preact.Component {
  constructor() {
    super()
    this.state = {
      loading: false,
      apartments: []
    }
  }
  async getApartments() {
    const response = await fetch('/apartments')
    if (response.status !== 200) {
      throw new Error('Failed to fetch')
    }
    const responseBody = await response.json()
    const apartments = responseBody
    return apartments
  }
  async componentDidMount() {
    try {
      // set loading true
      this.setState({
        loading: true
      })
      // fetch apartments
      const apartments = await this.getApartments()
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
  render() {
    const { loading, apartments } = this.state
    return html`
      <div class="app">
        <h1>Apartments</h1>
        <p>loading: ${this.state.loading.toString()}</p>
        <ul>
          ${apartments.map(apartment => html`<li key="${apartment.id}">${apartment.name}</li>`)}
        </ul>
      </div>
    `
  }
}
// 4. append rendered App component to node document.body
Preact.render(html`<${App}></App>`, document.body)
