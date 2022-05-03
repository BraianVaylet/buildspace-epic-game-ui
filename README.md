<p align="center" width="200">
   <img align="center" width="100" src="https://raw.githubusercontent.com/BraianVaylet/buildspace-epic-game-ui/main/public/wizard.png" />                                        </p>

# 🧙‍♂️ Epic Game [UI]

El proyecto se encuentra deployado en Vercel para que puedan verlo e interactuar con él, toda crítica o comentario se agradece, pueden acceder a la demo en el siguiente link:

### **[VER DEMO](https://buildspace-epic-game-ui.vercel.app/)**

Este proyecto consume un smart-contract desarrollado en Solidity utilizando el framework HardHat, pueden encontrar el repositorio en el siguiente link:

### [REPO SMART-CONTRACT](https://github.com/BraianVaylet/buildspace-epic-game)

## Sobre el proyecto

Proyecto web basado en la web3 desarrollado con **[Next.js](https://nextjs.org/)** y **[ChakraUI](https://chakra-ui.com/)**. En esta aplicación los usuarios podrán jugar un pequeño juego donde tendrán que acuñar su propio personaje NFT el cual luego utilizarán para tratar de derrotar al jefe del junto a otros jugadores, toda el proceso será almacenado dentro de la blockchain.

Para esto es necesario primero autenticarse usando la wallet **[Metamask](https://metamask.io/)** y configurandola para usar la red de prueba de **[Rinkeby](https://www.rinkeby.io/#stats)**.

Los usuarios podrán mintear sus NFTs, para esto es necesario pagar la transacción usando ETH. Dado a que nos encontramos en la red de Rinkeby no estaremos usando ETH real, sino unos de prueba. Para cargarle saldo a tu wallet y así tener ETH para usar en la red de Rinkeby pueden usar el siguiente **[enlace](https://faucets.chain.link/rinkeby)**. También van a necesitar ETH para poder atacar al jefe.

Las reglas del juego son bastante simple, cada personaje cuenta con tres atributos, estos son:

| Atributo | Descripción |
| -- | -- |
| ❤ | hp del personaje |
| ⚔ |  daño al atacar |
| 🛡 |  defensa |

Les presento a los personajes de esta saga: (los personajes fueron creados en [Hero Forge](https://www.heroforge.com/))

<table>
   <tr>
      <td>
         <img
            align="center"
            width="200"
            src="https://i.imgur.com/FJ5lUgJ.png"
         />
         <table width="250" border="1px solid black">
            <tr>
               <th>Atributo</th>
               <th>Descripción</th>
            </tr>
            <tr>
               <td>❤</td>
               <td>1500</td>
            </tr>
            <tr>
               <td>⚔</td>
               <td>150</td>
            </tr>
            <tr>
               <td>🛡</td>
               <td>50</td>
            </tr>
         </table>
      </td>
      <td>
         <img
            align="center"
            width="200"
            src="https://i.imgur.com/CmYArzl.png"
         />
         <table width="250" border="1px solid black">
            <tr>
               <th>Atributo</th>
               <th>Descripción</th>
            </tr>
            <tr>
               <td>❤</td>
               <td>1500</td>
            </tr>
            <tr>
               <td>⚔</td>
               <td>150</td>
            </tr>
            <tr>
               <td>🛡</td>
               <td>50</td>
            </tr>
         </table>
      </td>
      <td>
         <img
            align="center"
            width="200"
            src="https://i.imgur.com/BvpPiRE.png"
         />
         <table width="250" border="1px solid black">
            <tr>
               <th>Atributo</th>
               <th>Descripción</th>
            </tr>
            <tr>
               <td>❤</td>
               <td>1500</td>
            </tr>
            <tr>
               <td>⚔</td>
               <td>200</td>
            </tr>
            <tr>
               <td>🛡</td>
               <td>0</td>
            </tr>
         </table>
      </td>
   </tr>
   <tr>
      <td>
         <img
            align="center"
            width="200"
            src="https://i.imgur.com/3XGEHQh.png"
         />
         <table width="250" border="1px solid black">
            <tr>
               <th>Atributo</th>
               <th>Descripción</th>
            </tr>
            <tr>
               <td>❤</td>
               <td>1500</td>
            </tr>
            <tr>
               <td>⚔</td>
               <td>100</td>
            </tr>
            <tr>
               <td>🛡</td>
               <td>100</td>
            </tr>
         </table>
      </td>
      <td>
         <img
            align="center"
            width="200"
            src="https://i.imgur.com/v0W6GOD.png"
         />
         <table width="250" border="1px solid black">
            <tr>
               <th>Atributo</th>
               <th>Descripción</th>
            </tr>
            <tr>
               <td>❤</td>
               <td>1500</td>
            </tr>
            <tr>
               <td>⚔</td>
               <td>50</td>
            </tr>
            <tr>
               <td>🛡</td>
               <td>150</td>
            </tr>
         </table>
      </td>
      <td>
         <img
            align="center"
            width="200"
            src="https://i.imgur.com/Ld5Ra2j.png"
         />
         <table width="250" border="1px solid black">
            <tr>
               <th>Atributo</th>
               <th>Descripción</th>
            </tr>
            <tr>
               <td>❤</td>
               <td>1500</td>
            </tr>
            <tr>
               <td>⚔</td>
               <td>100</td>
            </tr>
            <tr>
               <td>🛡</td>
               <td>100</td>
            </tr>
         </table>
      </td>
   </tr>
   <tr>
      <td>
         <img
            align="center"
            width="200"
            src="https://i.imgur.com/Sqa43qp.png"
         />
         <table width="250" border="1px solid black">
            <tr>
               <th>Atributo</th>
               <th>Descripción</th>
            </tr>
            <tr>
               <td>❤</td>
               <td>1500</td>
            </tr>
            <tr>
               <td>⚔</td>
               <td>50</td>
            </tr>
            <tr>
               <td>🛡</td>
               <td>150</td>
            </tr>
         </table>
      </td>
      <td>
         <img
            align="center"
            width="200"
            src="https://i.imgur.com/L2QcAbi.png"
         />
         <table width="250" border="1px solid black">
            <tr>
               <th>Atributo</th>
               <th>Descripción</th>
            </tr>
            <tr>
               <td>❤</td>
               <td>1500</td>
            </tr>
            <tr>
               <td>⚔</td>
               <td>150</td>
            </tr>
            <tr>
               <td>🛡</td>
               <td>50</td>
            </tr>
         </table>
      </td>
      <td>
         <img
            align="center"
            width="200"
            src="https://i.imgur.com/2fC9ewH.png"
         />
         <table width="250" border="1px solid black">
            <tr>
               <th>Atributo</th>
               <th>Descripción</th>
            </tr>
            <tr>
               <td>❤</td>
               <td>1500</td>
            </tr>
            <tr>
               <td>⚔</td>
               <td>100</td>
            </tr>
            <tr>
               <td>🛡</td>
               <td>100</td>
            </tr>
         </table>
      </td>
   </tr>
   <tr>
      <td>
         <img
            align="center"
            width="200"
            src="https://i.imgur.com/pn0iaKf.png"
         />
         <table width="250" border="1px solid black">
            <tr>
               <th>Atributo</th>
               <th>Descripción</th>
            </tr>
            <tr>
               <td>❤</td>
               <td>1500</td>
            </tr>
            <tr>
               <td>⚔</td>
               <td>50</td>
            </tr>
            <tr>
               <td>🛡</td>
               <td>150</td>
            </tr>
         </table>
      </td>
      <td>
         <img
            align="center"
            width="200"
            src="https://i.imgur.com/zT8ObmD.png"
         />
         <table width="250" border="1px solid black">
            <tr>
               <th>Atributo</th>
               <th>Descripción</th>
            </tr>
            <tr>
               <td>❤</td>
               <td>1500</td>
            </tr>
            <tr>
               <td>⚔</td>
               <td>150</td>
            </tr>
            <tr>
               <td>🛡</td>
               <td>50</td>
            </tr>
         </table>
      </td>
      <td>
         <img
            align="center"
            width="200"
            src="https://i.imgur.com/eyG6FgJ.png"
         />
         <table width="250" border="1px solid black">
            <tr>
               <th>Atributo</th>
               <th>Descripción</th>
            </tr>
            <tr>
               <td>❤</td>
               <td>1500</td>
            </tr>
            <tr>
               <td>⚔</td>
               <td>50</td>
            </tr>
            <tr>
               <td>🛡</td>
               <td>150</td>
            </tr>
         </table>
      </td>
   </tr>
</table>

Ten en cuenta que la defensa es un bonus que tu personaje tiene ya que el jefe no cuenta con ese privilegio, aunque si vemos sus puntos de hp estamos ante un enemigo muy difícil de derribar.

Les presento al primer jefe de esta saga, se trata de Big Kangh.

<div>
   <img
      align="center"
      width="200"
      src="https://i.imgur.com/jBQ57F5.png"
   />
   <table width="250" border="1px solid black">
      <tr>
         <th>Atributo</th>
         <th>Descripción</th>
      </tr>
      <tr>
         <td>❤</td>
         <td>120000</td>
      </tr>
      <tr>
         <td>⚔</td>
         <td>200</td>
      </tr>
      <tr>
         <td>🛡</td>
         <td>0</td>
      </tr>
   </table>
</div>

Para atacar al jefe primero necesitas escoger un poder, puedes seleccionar uno de estos tres: 🔥 fuego, 💧 agua y 🌿 vegetación. Cada uno de ellos es bueno contra 1 pero débil contra otro.

<p width="400">
   <img align="center" width="250" src="https://raw.githubusercontent.com/BraianVaylet/buildspace-epic-game-ui/main/public/powers.png" />
</p>

Cada vez que seleccionamos un poder y atacamos al jefe el jefe también seleccionará uno de ellos, el ganador tendrá la posibilidad de atacar y causarle daño al otro.

Recuerda que el jefe cuenta con mucho hp y tu personaje no, asi que invita a tus amigos para que entre todos puedan derrotarlo! 😁

Este fue un proyecto con fin 100% académico mientras realizaba los cursos de la plataforma **[buildspace](https://buildspace.so/)**, la cual recomiendo a todo desarrollador que quiera comenzar a desarrollar para la web3.

### [[NFT] CURSO COMPLETO](https://opensea.io/assets/matic/0x3CD266509D127d0Eac42f4474F57D0526804b44e/13284?force_update=true)

## Algunas capturas del proyecto:

![screenshot#1](https://raw.githubusercontent.com/BraianVaylet/buildspace-epic-game-ui/main/screenshot/1.png)

![screenshot#2](https://raw.githubusercontent.com/BraianVaylet/buildspace-epic-game-ui/main/screenshot/2.png)

![screenshot#3](https://raw.githubusercontent.com/BraianVaylet/buildspace-epic-game-ui/main/screenshot/3.png)

![screenshot#4](https://raw.githubusercontent.com/BraianVaylet/buildspace-epic-game-ui/main/screenshot/4.png)

---

### This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
