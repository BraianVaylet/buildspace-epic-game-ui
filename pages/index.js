/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useState } from 'react'
import Head from 'next/head'
import { ethers } from 'ethers'
import { Button, Flex, Text, Spinner, useToast, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useDisclosure, Link, Accordion, AccordionItem, AccordionButton, AccordionIcon, Box, AccordionPanel } from '@chakra-ui/react'
import Layout from 'components/Layout'
import SelectCharacter from 'components/SelectCharacter'
import Arena from 'components/Arena'
import CONTRACT, { transformCharacterData } from 'utils/constants'

const CONTRACT_ADDRESS = CONTRACT.MY_EPIC_GAME.ADDRESS // > Nuestra direccion del contrato que desplegamos.
const CONTRACT_ABI = CONTRACT.MY_EPIC_GAME.ABI // > Nuestro abi del contrato

export default function Home () {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()
  const [loader] = useState(false)
  const [newTokenId, setNewTokenId] = useState(null)
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

  // > Funcion que permite escuchar los eventos del contrato.
  // const setupEventListener = async () => {
  //   try {
  //     const { ethereum } = window

  //     if (ethereum) {
  //       const provider = new ethers.providers.Web3Provider(ethereum)
  //       const signer = provider.getSigner()
  //       const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT.MY_EPIC_GAME.ABI, signer)

  //       // > Capturo el evento
  //       connectedContract.on('NewEpicNFTMinted', (from, tokenId) => {
  //         setNewTokenId(tokenId.toNumber())
  //         onOpen()
  //         getCurrentTotalEpicNFTs()
  //         console.log(from, tokenId.toNumber())
  //       })
  //       console.log('Setup event listener!')
  //     } else {
  //       console.log("Ethereum object doesn't exist!")
  //     }
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

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

      {/* modal */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>🧙‍♂️ Hey you!</ModalHeader>
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
