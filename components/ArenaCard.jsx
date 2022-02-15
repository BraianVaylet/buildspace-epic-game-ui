/* eslint-disable react/prop-types */
import React from 'react'
import { Flex, Image, Progress, Text } from '@chakra-ui/react'

const ArenaCard = ({ data, ...props }) => {
  return (
    <Flex
      as={'div'}
      direction={'column'}
      align={'center'}
      justify={'center'}
      w={'300px'}
      borderRadius={10}
      p={3}
      mb={10}
      mx={2}
      position={'relative'}
      {...props}
    >
      <Image
        src={data.imageURI}
        alt={data.name}
        filter={data.hp === 0 && 'grayscale(100%)'}
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
              {data.name}
            </Text>
          </Flex>
          <Progress
            colorScheme={'red'}
            isAnimated
            value={data.hp}
            min={0}
            max={data.maxHp}
            w={'100%'}
          />
          <Text>❤ {data.hp}/{data.maxHp}</Text>
          <Text>⚔ {data.attackDamage}</Text>
          <Text>🛡 {data.shield || 0}</Text>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default ArenaCard
