import { Router } from 'express';
import employees from '../controllers/employee';
import catchAsync from '../utils/catchAsync';

const router = Router();

router.route('/')
  .get(employees.getEmployees)
  .post(employees.newEmployee);
  
router.route('/:employeeName')
  .delete(catchAsync(employees.deleteEmployee))
  .put(catchAsync(employees.updateEmployee));

router.post('/upload', catchAsync(employees.setJsonEmployeeSupervisor));

router.get('/list', catchAsync(employees.getEmployeeList));

// router.post('/supervisor', catchAsync(employees.newSupervisor));

export default router;

