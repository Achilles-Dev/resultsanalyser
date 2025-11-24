import { FindOptions, Model } from 'sequelize';
import sequelize from '../db'
import {
  Course,
  CourseSubject,
  Grade,
  Student,
  Subject,
  User,
  School,
} from './definitions'
import { getCurrentTenantId } from '../tenantContext';

export { Student, Course, CourseSubject, Grade, Subject, User, School }

// ======================== AUTOMATIC TENANT SCOPING ========================
function applyTenantSecurity() {
  // 1. beforeFind – inject schoolId automatically
  sequelize.addHook('beforeFind', (options: FindOptions) => {
    if (!options.where) options.where = {};

    const tenantId = getCurrentTenantId();

    // Only apply if tenant exists and schoolId not already set
    if (
      tenantId &&
      (options.where as any).schoolId === undefined
    ) {
      (options.where as any).schoolId = tenantId;
    }

    // Superadmin explicit bypass: { where: { schoolId: null } }
    if ((options.where as any).schoolId === null) {
      delete (options.where as any).schoolId;
    }
  });

  // 2. beforeCreate / bulkCreate – auto-fill schoolId
  sequelize.addHook('beforeCreate', (instance: Model) => {
    const tenantId = getCurrentTenantId();
    if (tenantId && 'schoolId' in instance && !instance.schoolId) {
      instance.setDataValue('schoolId', tenantId);
    }
  });

  sequelize.addHook('beforeBulkCreate', (instances: Model[]) => {
    const tenantId = getCurrentTenantId();
    if (tenantId) {
      instances.forEach((inst) => {
        if ('schoolId' in inst && !inst.schoolId) {
          inst.setDataValue('schoolId', tenantId);
        }
      });
    }
  });

  // 3. Prevent changing schoolId (security)
  sequelize.addHook('beforeUpdate', (instance: Model) => {
    if (instance.changed('schoolId' as any)) {
      throw new Error('Modifying schoolId is not allowed');
    }
  });

  sequelize.addHook('beforeBulkUpdate', (options: any) => {
    if (options.attributes?.schoolId) {
      throw new Error('Bulk updating schoolId is not allowed');
    }
  });
}

applyTenantSecurity();
// // =========================================================================


export const initDB = async () => {
  try {
    await sequelize.authenticate()
    await School.sync({ alter: true })
    await Course.sync({ alter: true })
    await Student.sync({ alter: true })
    await Subject.sync({ alter: true })
    await Grade.sync({ alter: true })
    await User.sync({ alter: true })
    await CourseSubject.sync({ alter: true })
    console.log('Connection has been established successfully.')
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}
