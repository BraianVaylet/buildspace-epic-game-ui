/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { transformBossData } from 'utils/constants'
import { Button, Flex, Image, Link, Progress, Text } from '@chakra-ui/react'

const Arena = ({ characterNFT, contract, abi }) => {
  const [gameContract, setGameContract] = useState(null)
  const [boss, setBoss] = useState(null)
  const [attackState, setAttackState] = useState(null)
  const [characterPower, setCharacterPower] = useState(null)
  const [bossPower, setBossPower] = useState(null)
  const powers = ['🔥', '💧', '🌿']

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
      setBoss(transformBossData(bossTxn))
    }
    if (gameContract) {
      fetchBoss()
    }
  }, [gameContract])

  const runAttackAction = async () => {
    try {
      const bossPower = handleBossPower()
      console.log('characterPower', characterPower)
      console.log('bossPower', bossPower)
      console.log('characterWinPower(characterPower, bossPower)', characterWinPower(characterPower, bossPower))
      if (gameContract && characterPower && bossPower) {
        if (characterPower !== bossPower) {
          if (characterWinPower(characterPower, bossPower)) {
            setAttackState('attacking')
            console.log('Attacking boss...')
            const attackTxn = await gameContract.attackBoss()
            await attackTxn.wait()
            console.log('attackTxn:', attackTxn)
            setAttackState('hit')
          } else {
            setAttackState('attacking')
            console.log('Attacking boss...')
            const attackTxn = await gameContract.attackCharacter()
            await attackTxn.wait()
            console.log('attackTxn:', attackTxn)
            setAttackState('hit')
          }
        } else {
          console.log('Empate!')
        }
      }
    } catch (error) {
      console.error('Error attacking boss:', error)
      setAttackState(null)
    }
  }

  const characterWinPower = (character, boss) => {
    if (character === '🔥') {
      if (boss === '🔥') return null
      if (boss === '💧') return false
      if (boss === '🌿') return true
    }

    if (character === '💧') {
      if (boss === '🔥') return true
      if (boss === '💧') return null
      if (boss === '🌿') return false
    }

    if (character === '🌿') {
      if (boss === '🔥') return false
      if (boss === '💧') return true
      if (boss === '🌿') return null
    }
  }

  const handleBossPower = () => {
    if (characterPower) {
      const randomPowerSelection = powers[Math.floor(Math.random() * (powers.length - 0))]
      setBossPower(randomPowerSelection)
      return randomPowerSelection
    }
    return null
  }

  const restartAttack = () => {
    if (gameContract && characterPower && bossPower && (characterPower === bossPower)) {
      setBossPower(null)
      setCharacterPower(null)
      setAttackState(null)
    }
  }

  const renderBtns = () => {
    if (!characterPower) {
      return (<Text>Select a Power to attack!</Text>)
    }

    if (characterPower !== bossPower) {
      return (
        <Button
          w={'100%'}
          disabled={!characterPower}
          onClick={() => runAttackAction()}
        >
          Attack {boss.name}
        </Button>
      )
    }

    if (characterPower === bossPower) {
      return (
        <Button
          w={'100%'}
          disabled={!characterPower || !bossPower}
          onClick={() => restartAttack()}
        >
          Restart attack
        </Button>
      )
    }
  }

  return (
    <Flex
      direction={'column'}
      align={'center'}
      justify={'flex-start'}
      my={10}
      w={'100%'}
    >
      {boss && characterNFT &&
        <Flex
        direction={'row'}
        align={'center'}
        justify={'space-between'}
        w={'100%'}
      >
        {characterNFT && (
          <Flex
            direction={'column'}
            align={'center'}
            justify={'center'}
            w={'300px'}
            borderRadius={10}
            bgGradient='linear(to-r, blue.500, blue.700)'
            p={3}
            mb={10}
            mx={2}
            position={'relative'}
          >
            <Image
              src={characterNFT.imageURI}
              alt={characterNFT.name}
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
                    {characterNFT.name}
                  </Text>
                </Flex>
                <Progress
                  colorScheme={'red'}
                  isAnimated
                  value={characterNFT.hp}
                  min={0}
                  max={characterNFT.maxHp}
                  w={'100%'}
                />
                <Text>❤ {characterNFT.hp}/{characterNFT.maxHp}</Text>
                <Text>⚔ {characterNFT.attackDamage}</Text>
                <Text>🛡 {characterNFT.shield}</Text>
              </Flex>
            </Flex>
          </Flex>
        )}

        <Flex
          direction={'column'}
          w={'50%'}
          p={5}
        >
          <Flex
            w={'100%'}
            align={'center'}
            justify={'center'}
            mb={10}
          >
            {renderBtns()}
          </Flex>
          <Flex
            w={'100%'}
            direction={'row'}
            align={'center'}
            justify={'space-between'}
          >
            <Flex
              w={'25%'}
              h={'100%'}
              direction={'column'}
              align={'flex-start'}
            >
              {powers.map(btn => (
                <Button
                  key={btn}
                  variant={'outline'}
                  isActive={characterPower === btn}
                  onClick={() => setCharacterPower(btn)}
                  w={10}
                  h={10}
                  mb={5}
                >
                  {btn}
                </Button>
              ))}
            </Flex>

            <Flex
              w={'25%'}
              h={'100%'}
              direction={'column'}
              align={'flex-end'}
            >
              {powers.map(btn => (
                <Button
                  key={btn}
                  variant={'outline'}
                  disabled={bossPower !== btn}
                  filter={bossPower !== btn && 'grayscale(100%)'}
                  w={10}
                  h={10}
                  mb={5}
                >
                  {btn}
                </Button>
              ))}
            </Flex>
          </Flex>
        </Flex>

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
            position={'relative'}
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
                <Progress
                  colorScheme={'red'}
                  isAnimated
                  value={boss.hp}
                  min={0}
                  max={boss.maxHp}
                  w={'100%'}
                />
                <Text>❤ {boss.hp}/{boss.maxHp}</Text>
                <Text>⚔ {boss.attackDamage}</Text>
                <Text>🛡 0</Text>
              </Flex>
            </Flex>
          </Flex>
        )}
        </Flex>
      }
    </Flex>
  )
}

export default Arena
