import contractJson from 'utils/abis/MyEpicGame.json'

const CONTRACT = {
  MY_EPIC_GAME: {
    ADDRESS: '0x6e4fCCCB9bC1c7eC0f9F81Da42e3f2DBEC0C7f2d',
    ABI: contractJson.abi
  }
}

export const transformCharacterData = (characterData) => {
  return {
    name: characterData.name,
    imageURI: characterData.imageURI,
    hp: characterData.hp.toNumber(),
    maxHp: characterData.maxHp.toNumber(),
    attackDamage: characterData.attackDamage.toNumber(),
    shield: characterData.shield ? characterData.shield.toNumber() : null
  }
}

export default CONTRACT
