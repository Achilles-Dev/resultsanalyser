import sequelize from '../db'
import {
  Course,
  CourseSubject,
  Grade,
  Student,
  Subject,
  User,
} from './definitions'

export { Student, Course, CourseSubject, Grade, Subject, User }

export const initDB = async () => {
  try {
    await sequelize.authenticate()
    await Course.sync()
    await Student.sync({ alter: true })
    await Subject.sync()
    await Grade.sync({ alter: true })
    await User.sync()
    await CourseSubject.sync()
    console.log('Connection has been established successfully.')
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}
