/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { transformCharacterData } from 'utils/constants'
import { Flex, Image, Progress, Text } from '@chakra-ui/react'

const Arena = ({ characterNFT, contract, abi }) => {
  const [gameContract, setGameContract] = useState(null)
  const [boss, setBoss] = useState(null)

  useEffect(() => {
    const { ethereum } = window

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum)
      const signer = provider.getSigner()
      const gameContract = new ethers.Contract(
        contract,
        abi,
        signer
      )

      setGameContract(gameContract)
    } else {
      console.log('Ethereum object not found')
    }
  }, [])

  useEffect(() => {
    const fetchBoss = async () => {
      const bossTxn = await gameContract.getBigBoss()
      console.log('Boss:', bossTxn)
      setBoss(transformCharacterData(bossTxn))
    }

    if (gameContract) {
      fetchBoss()
    }
  }, [gameContract])

  return (
    <Flex
      direction={'column'}
      align={'center'}
      justify={'flex-start'}
      my={10}
    >
      {/* Boss */}
      <Flex
        direction={'column'}
        align={'center'}
        justify={'flex-start'}
      >
        {boss && (
          <Flex
            direction={'column'}
            align={'center'}
            justify={'center'}
            w={'300px'}
            borderRadius={10}
            bgGradient='linear(to-r, gray.500, gray.700)'
            p={3}
            mb={10}
            mx={2}
            cursor={'pointer'}
            position={'relative'}
            _hover={{
              boxShadow: '0px 0px 10px 0px'
            }}
          >
            <Image
              src={boss.imageURI}
              alt={boss.name}
              boxSize='100%'
            />
            <Flex
              justify={'space-between'}
              w={'100%'}
              py={0}
            >
              <Flex
                direction={'column'}
                align={'flex-start'}
                justify={'flex-start'}
                color={'white'}
                w={'100%'}
              >
                <Flex
                  align={'center'}
                  justify={'center'}
                  w={'100%'}
                  pb={3}
                >
                  <Text
                    fontWeight={'bold'}
                    letterSpacing={1}
                    fontSize={'large'}
                  >
                    {boss.name}
                  </Text>

                </Flex>
                <Progress value={80} />
                <Text>❤ {boss.hp}/{boss.maxHp}</Text>
                <Text>⚔ {boss.attackDamage}</Text>
              </Flex>
            </Flex>
          </Flex>
        )}
      </Flex>

      {/* Character NFT */}
      <p>CHARACTER NFT GOES HERE</p>
    </Flex>
  )
}

export default Arena
