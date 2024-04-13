import { Sequelize } from 'sequelize'
// @ts-ignore
import pg from 'pg'

// const sequelize = new Sequelize(process.env.NEXT_PUBLIC_POSTGRESQL_URI!, {
//   dialect: 'postgres',
//   dialectModule: pg,
// })

const sequelize = new Sequelize(process.env.NEXT_PUBLIC_POSTGRESQL_URL!, {
  dialect: 'postgres',
  dialectModule: pg,
})

export default sequelize
