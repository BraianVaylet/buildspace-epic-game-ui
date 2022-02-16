/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useState } from 'react'
import Head from 'next/head'
import { ethers } from 'ethers'
import { Button, Flex, Text, Spinner, useToast, Accordion, AccordionItem, AccordionButton, AccordionIcon, Box, AccordionPanel, Image, Link } from '@chakra-ui/react'
import Layout from 'components/Layout'
import SelectCharacter from 'components/SelectCharacter'
import Arena from 'components/Arena'
import CONTRACT, { transformCharacterData } from 'utils/constants'
import powers from 'public/powers.png'

const CONTRACT_ADDRESS = CONTRACT.MY_EPIC_GAME.ADDRESS // > Nuestra direccion del contrato que desplegamos.
const CONTRACT_ABI = CONTRACT.MY_EPIC_GAME.ABI // > Nuestro abi del contrato

export default function Home () {
  const toast = useToast()
  const [loader] = useState(false)
  const [currentAccount, setCurrentAccount] = useState('') // Almacenamos la billetera pública de nuestro usuario.
  const [characterNFT, setCharacterNFT] = useState(null)
  const [chainIdOk, setChainIdOk] = useState(false)

  const checkNetwork = async () => {
    try {
      if (window.ethereum.networkVersion !== '4') {
        setChainIdOk(false)
        toast({
          title: 'Wrong network.',
          description: 'You are not connected to the Rinkeby testnet!.',
          status: 'error',
          duration: 9000,
          isClosable: true
        })
      } else {
        setChainIdOk(true)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window
      // > Nos aseguramos de tener acceso a window.ethereum
      if (!ethereum) {
        console.log('Make sure you have metamask!')
        toast({
          description: 'Make sure you have metamask!',
          status: 'info',
          duration: 9000,
          isClosable: true
        })
        return
      } else {
        console.log('We have the ethereum object', ethereum)
      }

      // > Comprobamos si estamos autorizados a acceder a la billetera del usuario
      const accounts = await ethereum.request({ method: 'eth_accounts' })

      if (accounts.length !== 0) {
        const account = accounts[0]
        console.log('Found an authorized account:', account)
        setCurrentAccount(account)
        // > Escucho eventos! caso en que un usuario llega a nuestro sitio y YA tenía su billetera conectada + autorizada.
        // setupEventListener()
        // > check de la red
        checkNetwork()
      } else {
        console.log('No authorized account found')
        toast({
          description: 'No authorized account found',
          status: 'error',
          duration: 9000,
          isClosable: true
        })
      }
    } catch (error) {
      console.log(new Error(error))
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window
      if (!ethereum) {
        toast({
          description: 'Get MetaMask!',
          status: 'info',
          duration: 9000,
          isClosable: true
        })
        return
      }
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
      console.log('Connected', accounts[0])
      toast({
        description: 'Connected!',
        status: 'success',
        duration: 2000,
        isClosable: true
      })
      setCurrentAccount(accounts[0])
      // > Escucho evenots! caso en que un usuario ingresa a nuestro sitio y conecta su billetera por primera vez.
      // setupEventListener()
      // > check de la red
      checkNetwork()
    } catch (error) {
      console.log(new Error(error))
    }
  }

  const fetchNFTMetadata = async () => {
    console.log('Checking for Character NFT on address:', currentAccount)

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const gameContract = new ethers.Contract(
      CONTRACT_ADDRESS,
      CONTRACT_ABI,
      signer
    )

    const txn = await gameContract.checkIfUserHasNFT()
    console.log('txn', txn)
    if (txn.name) {
      console.log('User has character NFT')
      setCharacterNFT(transformCharacterData(txn))
    } else {
      console.log('No character NFT found')
    }
  }

  useEffect(() => {
    checkNetwork()
    checkIfWalletIsConnected()
  }, [])

  useEffect(() => {
    // Corremos esta funcionalidad solo si tenemos nuestra wallet conectada.
    if (currentAccount) {
      console.log('CurrentAccount:', currentAccount)
      fetchNFTMetadata()
    }
  }, [currentAccount])

  const renderViews = () => {
    // Conecto Billetera
    if (!currentAccount) {
      return (
        <Button
          mt={10}
          w={'30%'}
          letterSpacing={1}
          borderRadius={'md'}
          bg={'gray.600'}
          color={'white'}
          boxShadow={'2xl'}
          _hover={{
            opacity: '.9',
            cursor: 'pointer'
          }}
          onClick={connectWallet}
          disabled={currentAccount}
        >
          {'Connect your Wallet'}
        </Button>
      )
    } else {
      if (currentAccount && !characterNFT) {
        return (
            <SelectCharacter
              setCharacterNFT={setCharacterNFT}
              contract={CONTRACT_ADDRESS}
              abi={CONTRACT_ABI}
            />
        )
      }

      if (currentAccount && characterNFT) {
        return (
            <Arena
              characterNFT={characterNFT}
              contract={CONTRACT_ADDRESS}
              abi={CONTRACT_ABI}
            />
        )
      }
    }
  }

  return (
    <Layout
      contract={CONTRACT_ADDRESS}
      chain={chainIdOk}
      address={currentAccount}
      head={
        <Head>
          <title>buildsapce-epic-game</title>
          <meta name="description" content="buildspace-epic-game with Next.js" />
          <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico"></link>
        </Head>
      }
    >
      <Flex
        align={'center'}
        justify={'flex-start'}
        direction={'column'}
        w={'100%'}
        py={100}
      >

        <Flex
          align={'center'}
          justify={'center'}
          direction={'column'}
          w={'50%'}
        >
          <Text
            id='top'
            as='h1'
            fontSize={'3xl'}
            fontWeight={900}
            letterSpacing={'1px'}
          >
            {"Hi 👋, I'm Braian and"}
          </Text>
          <Text
            as='h3'
            my={5}
            fontSize={'5xl'}
            fontWeight={600}
            letterSpacing={'.5px'}
          >
            Welcome to Epic Game 🧙‍♂️
          </Text>

          <Accordion w={'100%'} allowMultiple>
            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box flex='1' textAlign='left'>
                    <Text
                      as={'h2'}
                      fontSize={30}
                      fontWeight={'bold'}>
                        About the project
                    </Text>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <Text mb={5} as={'p'} fontSize={20}>Epic Game 🧙‍♂️ is a small and simple NFT game made with React and Solidity. The UI is made with Next.js and ChakraUI while the smart-contract is developed using the HardHat framework.</Text>
                <Text mb={5} as={'p'} fontSize={20}>To play it is necessary to have Metamask installed in your browser, be connected to the Rinkeby testnet and have test ETH to interact with the application.</Text>
                <Text mb={5} as={'p'} fontSize={20}>You can obtain ETH in this <Link color={'blue.300'} href='https://faucets.chain.link/rinkeby' >link</Link></Text>
                <Text mb={5} as={'p'} fontSize={20}>When you start the game you will need to choose a character, you can choose one of those listed on the platform (keep in mind that not all are the same, some differ in their attributes). For this you will need to mint your own NFT which you will use during the game… But be careful! You will only be able to mint a single NFT character with your wallet, you will not be able to reselect another one so choose carefully…</Text>
                <Text mb={5} as={'p'} fontSize={20}>Once you have your character you can start playing, the objective is to defeat the leader, but it is unlikely that you can do it alone, so you will need to invite your friends to select their own characters and help you defeat him...</Text>
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box flex='1' textAlign='left'>
                    <Text
                      as={'h2'}
                      fontSize={30}
                      fontWeight={'bold'}>
                        Rules
                    </Text>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4} w={'100%'}>
                  <Text mb={5} as={'p'} fontSize={20}>The rules of the game are quite simple, each character has three attributes, these are: ❤ the character's hp, ⚔ is the damage your character does when attacking and 🛡 which is the defense it has. Keep in mind that defense is a bonus that your character has since the boss does not have that privilege, although if we see his hp points we are facing an enemy that is very difficult to take down.</Text>
                  <Text mb={5} as={'p'} fontSize={20}>To attack the boss you first need to choose a power, you can select one of these three: 🔥 fire, 💧 water and 🌿 vegetation. Each of them is good against 1 but weak against another.</Text>
                  <Flex
                    align={'center'}
                    justify={'center'}
                    w={'100%'}
                    py={5}
                  >
                    <Image src={powers.src} boxSize={'xl'} alt={'rules'} />
                  </Flex>
                  <Text mb={5} as={'p'} fontSize={20}>Every time we select a power and attack the boss the boss will also select one of them, the winner will have the chance to attack and cause damage to the other.</Text>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>

          {renderViews()}
        </Flex>

        {loader &&
            (
            <Flex
              direction={'column'}
              align={'center'}
              justify={'center'}
              w={'100%'}
              mt={10}
            >
              <Spinner
                thickness='6px'
                speed='0.45s'
                emptyColor='blue.100'
                color='blue.500'
                size='xl'
              />
              <Text
                mt={2.5}
              >{'Mining'}</Text>
            </Flex>
            )
        }
      </Flex>
    </Layout>
  )
}
