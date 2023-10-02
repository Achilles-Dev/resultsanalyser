import { Sequelize } from 'sequelize'

const sequelize = new Sequelize(process.env.NEXT_POSTGRESQL_URI!)

export default sequelize
