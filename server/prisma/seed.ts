import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john.doe@gmail.com',
      avatarUrl: 'https://github.com/omarcoaur3lio.png'
    }
  })

  const pool = await prisma.pool.create({
    data: {
      title: 'Pool example',
      code: 'BOL123',
      ownerId: user.id,

      participants: {
        create: {
          userId: user.id
        }
      }
    }
  })
  // const participant = await prisma.participant.create({
  //   data: {
  //     poolId: pool.id,
  //     userId: user.id,
  //   }
  // })

  const game = await prisma.game.create({
    data: {
      date: '2022-11-25T13:30:18.551Z',
      firstTeamCountryCode: 'DE',
      secondTeamCountryCode: 'BR',
    }
  })
  
  await prisma.game.create({
    data: {
      date: '2022-11-27T13:30:18.551Z',
      firstTeamCountryCode: 'BR',
      secondTeamCountryCode: 'AR',

      guesses: {
        create: {
          firstTeamGoals: 3,
          secondTeamGoals: 1,

          participant: {
            connect: {
              userId_poolId: {
                userId: user.id,
                poolId: pool.id,
              }
            }
          }

        }
      }
    }
  })
}

main()