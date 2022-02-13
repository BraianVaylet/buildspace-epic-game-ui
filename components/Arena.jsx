/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from 'react'
import { ethers } from 'ethers'
import { transformBossData } from 'utils/constants'
import { Box, Button, Flex, Image, Progress, Spinner, Text } from '@chakra-ui/react'

import fire from 'public/fire.png'
import water from 'public/water.png'
import leaf from 'public/leaf.png'

fire.name = '🔥'
water.name = '💧'
leaf.name = '🌿'

const ATTACK_STATE = {
  CHARACTER_ATTACK: {
    status: 'CHARACTER_ATTACK',
    message: 'Attacking the boss...',
    animationClass: ''
  },
  BOSS_ATTACK: {
    status: 'BOSS_ATTACK',
    message: 'Attacking the player'
  },
  CHARACTER_HIT: {
    status: 'CHARACTER_HIT',
    message: 'Player hit!'
  },
  BOSS_HIT: {
    status: 'BOSS_HIT',
    message: 'Boss hit!'
  },
  NULL: {
    status: null,
    message: 'Loading...'
  }
}

const Arena = ({ characterNFT, contract, abi }) => {
  const [gameContract, setGameContract] = useState(null)
  const [boss, setBoss] = useState(null)
  const [attackState, setAttackState] = useState(ATTACK_STATE.NULL)
  const [characterPower, setCharacterPower] = useState(null)
  const [bossPower, setBossPower] = useState(null)
  const [showBossPower, setShowBossPower] = useState(false)
  const [loader, setLoader] = useState(false)
  const cardCharacterRef = useRef(null)
  const cardBossRef = useRef(null)
  const powers = [fire, water, leaf]

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
      // Seleccion de poder random del jefe.
      const bossPower = handleBossPower()
      if (gameContract && characterPower && bossPower) {
        setLoader(true)
        if (characterPower !== bossPower) {
          let attackTxn = null
          if (characterWinPower(characterPower, bossPower)) {
            setAttackState(ATTACK_STATE.CHARACTER_ATTACK)
            console.log('Attacking boss...')
            attackTxn = await gameContract.attackBoss()
          } else {
            setAttackState(ATTACK_STATE.BOSS_ATTACK)
            console.log('Attacking character...')
            attackTxn = await gameContract.attackCharacter()
          }
          await attackTxn.wait()
          console.log('attackTxn:', attackTxn)
          setShowBossPower(true)
          setLoader(false)
          setAttackState(
            characterWinPower(characterPower, bossPower)
              ? ATTACK_STATE.CHARACTER_HIT
              : ATTACK_STATE.BOSS_HIT
          )
        } else {
          console.log('Empate!')
          setShowBossPower(true)
          setAttackState(ATTACK_STATE.NULL)
          setLoader(false)
        }
      }
    } catch (error) {
      console.error('Error attacking boss:', error)
      setShowBossPower(false)
      setAttackState(ATTACK_STATE.NULL)
      setLoader(false)
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
      const randomPowerSelection = powers[Math.floor(Math.random() * (powers.length - 0))].name
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
      setShowBossPower(false)
    }
  }

  const renderBtns = () => {
    if (!characterPower) {
      return (
        <Button
          w={'100%'}
          disabled={true}
        >
          Select a Power to attack {boss.name}!
        </Button>
      )
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

  // Revisar
  const animateComponent = (ref, animationName) => {
    ref && ref.current && ref.current.classList.add('animate__animated', `animate__${animationName}`)
    ref && ref.current && ref.current.addEventListener('animationend', () => {
      ref.current.classList.remove('animate__animated', `animate__${animationName}`)
    })
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
        {/* // Card Character player */}
        {characterNFT && (
          <Flex
            as={'div'}
            ref={cardCharacterRef}
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
            style={{
              animation: 'fadeInLeft',
              animationDuration: '2s'
            }}
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
          {loader
            ? (
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
                >
                  {attackState.message}
                </Text>
              </Flex>
              )
            : (
                <Box
                  style={{
                    animation: 'fadeIn',
                    animationDuration: '2s'
                  }}
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
                          key={btn.name}
                          variant={'outline'}
                          isActive={characterPower === btn.name}
                          onClick={() => setCharacterPower(btn.name)}
                          boxSize={20}
                          mb={5}
                        >
                          <Image
                            src={btn.src}
                            alt={btn.name}
                            objectFit='cover'
                          />
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
                          key={btn.name}
                          variant={'outline'}
                          disabled={!showBossPower ? true : bossPower !== btn.name}
                          filter={(!showBossPower || bossPower !== btn.name) && 'grayscale(100%)'}
                          // filter={bossPower !== btn.name ? 'grayscale(100%)' : showBossPower && ''}
                          boxSize={20}
                          mb={5}
                        >
                          <Image
                            src={btn.src}
                            alt={btn.name}
                            objectFit='cover'
                          />
                        </Button>
                      ))}
                    </Flex>
                  </Flex>
                </Box>
              )
            }
        </Flex>

        {/* // Card Boss */}
        {boss && (
          <Flex
            ref={cardBossRef}
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
            style={{
              animation: 'fadeInRight',
              animationDuration: '2s'
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
