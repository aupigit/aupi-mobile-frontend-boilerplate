import '../global.css'
import { Slot } from 'expo-router'
import { Providers } from './providers'
import { StatusBar } from 'expo-status-bar'

export default function Layout() {
  return (
    <>
      <Providers>
        <StatusBar style="dark" />
        <Slot />
      </Providers>
    </>
  )
}
