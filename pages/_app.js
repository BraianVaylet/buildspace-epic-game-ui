/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/prop-types */
import { ChakraProvider, ColorModeScript, CSSReset } from '@chakra-ui/react'
import customTheme from 'styles/theme'
import 'animate.css'

function MyApp ({ Component }) {
  return (
    <ChakraProvider theme={customTheme}>
      <CSSReset />
      <ColorModeScript initialColorMode={customTheme.initialColorMode} />
      <Component />
    </ChakraProvider>
  )
}

export default MyApp
