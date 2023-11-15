import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize'
import sequelize from '@/libs/db'
import { UUID } from '@sequelize/core/_non-semver-use-at-your-own-risk_/dialects/abstract/data-types.js'

interface Student
  extends Model<InferAttributes<Student>, InferCreationAttributes<Student>> {
  id: UUID
  indexNo: string
  firstName: string
  lastName: string
  otherName: string
  sex: string
  courseId: UUID
  yearGroup: string
}

interface Course
  extends Model<InferAttributes<Course>, InferCreationAttributes<Course>> {
  id: UUID
  code: Number
  name: string
}

interface Subject
  extends Model<InferAttributes<Subject>, InferCreationAttributes<Subject>> {
  id: UUID
  code: Number
  type: string
  name: string
}

interface Grade
  extends Model<InferAttributes<Grade>, InferCreationAttributes<Grade>> {
  id: UUID | string
  studentId: UUID | string
  subjectId: UUID | string
  grade?: string
  status?: string
}

interface CourseSubject
  extends Model<
    InferAttributes<CourseSubject>,
    InferCreationAttributes<CourseSubject>
  > {
  courseId: UUID | string
  subjectId: UUID | string
}

interface User
  extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  id: UUID
  email: string
  password: string
}

const Course = sequelize.define<Course>(
  'Course',
  {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    code: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'courses',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  }
)

const Student = sequelize.define<Student>(
  'Student',
  {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    indexNo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    otherName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sex: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    courseId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Course,
        key: 'id',
      },
    },
    yearGroup: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: 'students',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  }
)

const Subject = sequelize.define<Subject>(
  'Subject',
  {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    code: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'subjects',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  }
)

const Grade = sequelize.define<Grade>(
  'Grade',
  {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    studentId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Student,
        key: 'id',
      },
    },
    subjectId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Subject,
        key: 'id',
      },
    },
    grade: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: 'grades',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  }
)

const User = sequelize.define<User>(
  'User',
  {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: 'users',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  }
)

const CourseSubject = sequelize.define<CourseSubject>(
  'Course_Subject',
  {
    courseId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Course,
        key: 'id',
      },
    },
    subjectId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Subject,
        key: 'id',
      },
    },
  },
  {
    tableName: 'course_subject',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  }
)

Course.hasMany(Student, {
  foreignKey: 'courseId',
})

Student.belongsTo(Course, {
  foreignKey: 'courseId',
})

Student.belongsToMany(Subject, {
  through: Grade,
  foreignKey: 'studentId',
})

Subject.belongsToMany(Student, {
  through: Grade,
  foreignKey: 'subjectId',
})

Course.belongsToMany(Subject, {
  through: CourseSubject,
  foreignKey: 'courseId',
})

Subject.belongsToMany(Course, {
  through: CourseSubject,
  foreignKey: 'subjectId',
})

export { Student, Course, Subject, User, Grade, CourseSubject }
