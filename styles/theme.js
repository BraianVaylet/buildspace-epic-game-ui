import { theme, extendTheme } from '@chakra-ui/react'

const customTheme = extendTheme({
  ...theme,
  initialColorMode: 'light',
  useSystemColorMode: true,
  styles: {
    global: props => ({
      'html, body': {
        fontSize: 'md',
        color: props.colorMode === 'dark' ? 'white' : 'gray.600',
        lineHeight: 'tall'
      },
      a: {
        color: props.colorMode === 'dark' ? 'teal.300' : 'teal.500'
      }
    })
  },
  colors: {
    brand: {}
  }
})

export default customTheme
