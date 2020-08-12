// 1. imports from unpkg.com
import * as Preact from 'https://unpkg.com/preact@10.4.7/dist/preact.module.js'
import htm from 'https://unpkg.com/htm@3.0.4/dist/htm.module.js'
// 2. make htm import work with Preact import
const html = htm.bind(Preact.createElement)
// 3. define LoadingIndicator component
class LoadingIndicator extends Preact.Component {
  constructor() {
    super()
  }
  render() {
    const { loading } = this.props
    return html`<p>Loading: ${loading.toString()}</p>`
  }
}
// 4. define App component
class App extends Preact.Component {
  constructor() {
    super()
    this.state = {
      loading: false,
      apartments: []
    }
  }
  async apiRequest(url) {
    const response = await window.fetch(url)
    if (response.status !== 200) {
      throw new Error('Failed to fetch')
    }
    return response.json()
  }
  async componentDidMount() {
    try {
      // set loading true
      this.setState({
        loading: true
      })
      // fetch apartments
      const apartments = await this.apiRequest('/apartments')
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
      <h1>Apartments</h1>
      <${LoadingIndicator} loading="${loading}"/>
      <ul>
        ${apartments.map(apartment => html`<li key="${apartment.id}">${apartment.name}</li>`)}
      </ul>
    `
  }
}
// 4. append rendered App component to node document.body
Preact.render(html`<${App}/>`, document.body)
