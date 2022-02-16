/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from 'react'
import { ethers } from 'ethers'
import { transformBossData, transformCharacterData } from 'utils/constants'
import { Box, Button, Flex, Image, Spinner, Text } from '@chakra-ui/react'

import fire from 'public/fire.png'
import water from 'public/water.png'
import leaf from 'public/leaf.png'
import ArenaCard from './ArenaCard'

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

const handleShadowColor = power => {
  if (power === '🔥') return '0px 0px 10px 1px #E53E3E, 0px 0px 20px 0px #DD6B20, 0px 0px 30px 0px #FBD38D'
  if (power === '💧') return '0px 0px 10px 1px #3182CE, 0px 0px 20px 0px #00B5D8, 0px 0px 30px 0px #76E4F7'
  if (power === '🌿') return '0px 0px 10px 1px #38A169, 0px 0px 20px 0px #68D391, 0px 0px 30px 0px #9AE6B4'
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

const animateComponent = (ref, animationName, animationDuration = '2s') => {
  if (ref && ref.current) {
    ref.current.classList.add('animate__animated', `${animationName}`)
    ref.current.style.setProperty('--animate-duration', `${animationDuration}`)
    ref.current.addEventListener('animationend', () => {
      ref.current.classList.remove('animate__animated', `${animationName}`)
    })
  }
}

const Arena = ({ contract, abi }) => {
  const [characterNFT, setCharacterNFT] = useState(null)
  const [gameContract, setGameContract] = useState(null)
  const [boss, setBoss] = useState(null)
  const [attackState, setAttackState] = useState(ATTACK_STATE.NULL)
  const [showAttackState, setShowAttackState] = useState(false)
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

  const fetchNFTMetadata = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const gameContract = new ethers.Contract(
      contract,
      abi,
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

  const fetchBoss = async () => {
    const bossTxn = await gameContract.getBigBoss()
    console.log('Boss:', bossTxn)
    setBoss(transformBossData(bossTxn))
  }

  useEffect(() => {
    if (gameContract) {
      fetchBoss()
      fetchNFTMetadata()
    }
  }, [gameContract])

  const runAttackAction = async () => {
    try {
      // Seleccion de poder random del jefe.
      if (gameContract && characterPower && bossPower) {
        setLoader(true)
        setShowAttackState(false)
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
          setShowAttackState(true)
          await attackTxn.wait()
          console.log('attackTxn:', attackTxn)
          setShowBossPower(true)
          setLoader(false)
          setAttackState(
            characterWinPower(characterPower, bossPower)
              ? ATTACK_STATE.CHARACTER_HIT
              : ATTACK_STATE.BOSS_HIT
          )
          if (gameContract) {
            await fetchBoss()
            await fetchNFTMetadata()
          }
        } else {
          console.log('Empate!')
          setAttackState(ATTACK_STATE.NULL)
        }
        setShowBossPower(true)
        setLoader(false)
      }
    } catch (error) {
      console.error('Error attacking boss:', error)
      setShowBossPower(false)
      setAttackState(ATTACK_STATE.NULL)
      setLoader(false)
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
      setAttackState(ATTACK_STATE.NULL)
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

  useEffect(() => {
    animateComponent(cardCharacterRef, 'animate__pulse', '0.3s')
    setAttackState(ATTACK_STATE.NULL)
    setShowBossPower(false)
    handleBossPower()
  }, [characterPower])

  useEffect(() => {
    if (attackState === ATTACK_STATE.BOSS_HIT) {
      animateComponent(cardBossRef, 'animate__bounceOutLeft', '1s')
      animateComponent(cardCharacterRef, 'animate__jello')
    }
    if (attackState === ATTACK_STATE.CHARACTER_HIT) {
      animateComponent(cardCharacterRef, 'animate__bounceOutRight', '1s')
      animateComponent(cardBossRef, 'animate__jello')
    }
  }, [attackState])

  return (
    <Flex
      direction={'column'}
      align={'center'}
      justify={'flex-start'}
      my={10}
      w={'100%'}
    >
      <Flex
        align={'center'}
        justify={'center'}
        w={'100%'}
        py={10}
      >
        <Text
          as={'h2'}
          fontSize={'2xl'}
          fontStyle={'italic'}
          bgGradient={'linear(to-r, blue.300, blue.500)'}
          bgClip='text'
        >
          {boss && characterNFT && boss.hp !== 0
            ? showAttackState && attackState.status && attackState.message
            : 'We defeated the boss!!! But do not relax, soon a new boss will be reborn'
          }
        </Text>
      </Flex>
      {boss && characterNFT &&
        <Flex
          direction={'row'}
          align={'center'}
          justify={'space-between'}
          w={'100%'}
        >
        {/* // Card Character player */}
        {characterNFT && (
          <div ref={cardCharacterRef}>
            <ArenaCard
              data={characterNFT}
              bgGradient={
                characterNFT.hp !== 0
                  ? attackState === ATTACK_STATE.BOSS_HIT
                    ? 'linear(to-r, red.400, red.600, red.800)'
                    : 'linear(to-r, blue.400, blue.600, blue.800)'
                  : 'linear(to-r, gray.400, gray.600, gray.400)'
              }
              boxShadow={handleShadowColor(characterPower)}
              style={{
                animation: 'slideInLeft',
                animationDuration: '2s'
              }}
            />
          </div>
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
                  {showAttackState ? 'Waiting for the attack...' : 'Loading...'}
                </Text>
              </Flex>
              )
            : boss.hp !== 0 && (
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
          <div ref={cardBossRef}>
            <ArenaCard
              data={boss}
              bgGradient={
                boss.hp !== 0
                  ? attackState === ATTACK_STATE.CHARACTER_HIT
                    ? 'linear(to-r, red.400, red.600, red.800)'
                    : 'linear(to-r, yellow.400, yellow.600, yellow.800)'
                  : 'linear(to-r, gray.400, gray.600, gray.400)'
              }
              boxShadow={showBossPower && `0px 0px 30px 0px ${handleShadowColor(bossPower)}`}
              style={{
                animation: 'slideInRight',
                animationDuration: '2s'
              }}
            />
          </div>
        )}
        </Flex>
      }
    </Flex>
  )
}

export default Arena
