// 1. imports from unpkg.com
import * as Preact from 'https://unpkg.com/preact@10.4.7/dist/preact.module.js'
import htm from 'https://unpkg.com/htm@3.0.4/dist/htm.module.js'
// 2. make htm import work with Preact import
const html = htm.bind(Preact.createElement)
// 3. define Header component
class Header extends Preact.Component {
  render() {
    const { name } = this.props
    return html`<h1>${name} List</h1>`
  }
}
// 4. define Footer component
class Footer extends Preact.Component {
  render() {
    const { children } = this.props
    return html`<footer>${children}</footer>`
  }
}
// 5. define App component
class App extends Preact.Component {
  constructor() {
    super()
    this.state = {
      todos: []
    }
  }
  addTodo() {
    const { todos } = this.state
    this.setState({
      todos: todos.concat(`Item ${todos.length}`)
    })
  }
  async getApartments() {
    const response = await fetch('/apartments')
    if (response.status !== 200) {
      throw new Error('Failed to fetch')
    }
    const responseBody = await response.json()
    const apartments = responseBody
    console.log(apartments)
  }
  render() {
    const { page } = this.props
    const { todos } = this.state
    return html`
      <div class="app">
        <${Header} name="ToDo's (${page})"></Header>
        <ul>
          ${todos.map(todo => html`<li key="${todo}">${todo}</li>`)}
        </ul>
        <button onClick=${() => this.addTodo()}>Add Todo</button>
        <button onClick=${() => this.getApartments()}>Get Apartments</button>
        <${Footer}>footer content here</Footer>
      </div>
    `
  }
}
// 6. append rendered App component to node document.body
Preact.render(html`<${App} page="All"></App>`, document.body)
