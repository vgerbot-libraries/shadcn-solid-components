import type { Component } from 'solid-js'
import styles from './App.module.css'
import { Button } from 'src'

const App: Component = () => {
  return (
    <div class={styles.App}>
    <Button>Hello shadcn-solid</Button>
    </div>
  )
}

export default App
