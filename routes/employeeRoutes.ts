import { Router } from 'express';
import employees from '../controllers/employee';
import catchAsync from '../utils/catchAsync';
import passport from 'passport';

const router = Router();

router.route('/')
  .get(employees.getEmployees)
  .post(passport.authenticate('jwt'), employees.newEmployee);
  
router.route('/:employeeName')
  .delete(passport.authenticate('jwt'), catchAsync(employees.deleteEmployee))
  .put(passport.authenticate('jwt'), catchAsync(employees.updateEmployee));

router.post('/upload',passport.authenticate('jwt'), catchAsync(employees.setJsonEmployeeSupervisor));

router.get('/list', catchAsync(employees.getEmployeeList));

// router.post('/supervisor', catchAsync(employees.newSupervisor));

export default router;

