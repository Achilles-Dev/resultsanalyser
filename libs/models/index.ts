import sequelize from '../db'
import {
  Course,
  CourseSubject,
  Grade,
  Student,
  StudentGrade,
  Student_Subject,
  Subject,
  User,
} from './definitions'

export {
  Student,
  Course,
  CourseSubject,
  Grade,
  StudentGrade,
  Student_Subject,
  Subject,
  User,
}

export const initDB = async () => {
  try {
    await sequelize.authenticate()
    await Course.sync()
    await Student.sync({ alter: true })
    await Subject.sync()
    await Grade.sync()
    await User.sync()
    await Student_Subject.sync()
    await CourseSubject.sync()
    await StudentGrade.sync()
    console.log('Connection has been established successfully.')
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}
