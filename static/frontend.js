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
    this.setState({
      apartments: await this.getApartments()
    })
  }
  render() {
    const { apartments } = this.state
    return html`
      <div class="app">
        <h1>Apartments</h1>
        <ul>
          ${apartments.map(apartment => html`<li key="${apartment.id}">${apartment.name}</li>`)}
        </ul>
      </div>
    `
  }
}
// 6. append rendered App component to node document.body
Preact.render(html`<${App}></App>`, document.body)
