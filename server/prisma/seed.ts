import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({})

async function main() {
    const user = await prisma.user.create({
        data : {
            name : "John Doe",
            email : "john.doe@example.com"
        }
    })

    const pool = await prisma.pool.create({
        data : {
            title : 'Example Pool',
            code : 'BOL123',
            ownerId : user.id,

            participants : {
                create: {
                    userId : user.id,
                }
            }
        }
    })

    await prisma.game.create({
        data : {
            date : '2022-11-10T14:03:53.201Z',
            firstTeamContryCode : 'DE',
            secondTeamContryCode : 'BR',
        }
    })

    await prisma.game.create({
        data : {
            date : '2022-11-15T14:03:53.201Z',
            firstTeamContryCode : 'BR',
            secondTeamContryCode : 'AR',

            guesses: {
                create: {
                    firstTeamPoints : 2,
                    secondTeamPoints : 1,

                    participant : {
                        connect : {
                            userId_poolId : {
                                poolId : pool.id,
                                userId : user.id 
                                
                            }
                        }
                    }
                }
            }
        }
    })

}

main()