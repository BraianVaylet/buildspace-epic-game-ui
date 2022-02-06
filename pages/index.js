/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useState } from 'react'
import Head from 'next/head'
import { ethers } from 'ethers'
import { Button, Flex, Text, Spinner, useToast, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useDisclosure, Link, Accordion, AccordionItem, AccordionButton, AccordionIcon, Box, AccordionPanel } from '@chakra-ui/react'
import myEpicNft from '../utils/MyEpicNFT.json'
import Layout from '../components/Layout'
import SelectCharacter from '../components/SelectCharacter'

// > Nuestra direccion del contrato que desplegamos.
const CONTRACT_ADDRESS = '0x9a59CFc34ABED8FDE5989892A1D2B75235d14b14'
// > Nuestro abi del contrato
const contractABI = myEpicNft.abi

export default function Home () {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()
  const [loader] = useState(false)
  const [newTokenId, setNewTokenId] = useState(null)
  const [totalSupply, setTotalSupply] = useState(0) // Almacenamos el total de NFTs que se podra mintear.
  const [currentSupply, setCurrentSupply] = useState(0) // Almacenamos total actual de NFTs minteados
  const [currentAccount, setCurrentAccount] = useState('') // Almacenamos la billetera pública de nuestro usuario.
  const [characterNFT, setCharacterNFT] = useState(null)
  const [chainIdOk, setChainIdOk] = useState(false)

  console.log('totalSupply', totalSupply)
  console.log('currentSupply', currentSupply)

  const checkIfChainIsCorrect = async () => {
    try {
      const { ethereum } = window
      // > Comprobamos si estamos en la red correcta
      const chainId = await ethereum.request({ method: 'eth_chainId' })
      const rinkebyChainId = '0x4'
      if (chainId !== rinkebyChainId) {
        setChainIdOk(false)
        toast({
          title: 'Red incorrecta.',
          description: '¡No está conectado a Rinkeby Test Network!.',
          status: 'error',
          duration: 9000,
          isClosable: true
        })
      } else {
        setChainIdOk(true)
      }
    } catch (error) {
      console.log(new Error(error))
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
        setupEventListener()
        // > check de la red
        checkIfChainIsCorrect()
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
      setupEventListener()
      // > check de la red
      checkIfChainIsCorrect()
    } catch (error) {
      console.log(new Error(error))
    }
  }

  // > Funcion que permite escuchar los eventos del contrato.
  const setupEventListener = async () => {
    try {
      const { ethereum } = window

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer)

        // > Capturo el evento
        connectedContract.on('NewEpicNFTMinted', (from, tokenId) => {
          setNewTokenId(tokenId.toNumber())
          onOpen()
          getCurrentTotalEpicNFTs()
          console.log(from, tokenId.toNumber())
        })
        console.log('Setup event listener!')
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getTotalEpicNFTs = async () => {
    try {
      const { ethereum } = window
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer)
        const total = await connectedContract.getTotalNFTs()
        setTotalSupply(total.toNumber())
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getCurrentTotalEpicNFTs = async () => {
    try {
      const { ethereum } = window
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer)
        const total = await connectedContract.getCurrentTotalNFTs()
        setCurrentSupply(total.toNumber())
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error)
    }
  }

  // const askContractToMintNft = async () => {
  //   try {
  //     const { ethereum } = window

  //     if (ethereum) {
  //       // > Un "provider" es lo que usamos para comunicarnos con los nodos de Ethereum.
  //       // En este caso usamos nodos que Metamask proporciona en segundo plano para enviar/recibir datos de nuestro contrato implementado.
  //       const provider = new ethers.providers.Web3Provider(ethereum)
  //       // > info: https://docs.ethers.io/v5/api/signer/#signers
  //       const signer = provider.getSigner()
  //       // > Crea la conexión con nuestro contrato
  //       const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer)

  //       console.log('Going to pop wallet now to pay gas...')
  //       const nftTxn = await connectedContract.makeAnEpicNFT()
  //       setLoader(true)
  //       console.log('Mining...please wait.')
  //       await nftTxn.wait()
  //       setLoader(false)
  //       // console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`)
  //     } else {
  //       console.log("Ethereum object doesn't exist!")
  //     }
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  useEffect(() => {
    checkIfWalletIsConnected()
    getTotalEpicNFTs()
    getCurrentTotalEpicNFTs()
  }, [])

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

          <Accordion w={'100%'} defaultIndex={[0]} allowMultiple>
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
                <Text fontSize={20}>Project info...</Text>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>

          {/* Conectar billetera */}
          {!currentAccount
            ? (
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
            : currentAccount && !characterNFT && (
              <SelectCharacter setCharacterNFT={setCharacterNFT} />
            )
        }
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

      {/* modal */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>🐲 Hey you!</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Text>Hello! We mint your NFT and send it to your wallet. It may be blank at this time. It may take a maximum of 10 minutes to appear on OpenSea and Rarible.</Text>
          </ModalBody>

          <ModalFooter>
            <Button
              as={Link}
              href={`https://rinkeby.rarible.com/token/${CONTRACT_ADDRESS}:${newTokenId}`}
              isExternal
              borderRadius={'md'}
              bgGradient={'linear(to-r, yellow.300, yellow.500)'}
              color={'white'}
              mr={3}
            >
              Show in Rarible
            </Button>
            <Button onClick={() => {
              onClose()
              setNewTokenId(null)
            }}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Layout>
  )
}
