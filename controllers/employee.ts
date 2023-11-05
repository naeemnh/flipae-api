import { Request, Response, response } from "express";
import { createEmployee, createEmployeeWithoutError, deleteEmployeeByName, findEmployeeAndSupervisor, getEmployeeTree, listEmployees, updateEmployeeSupervisor } from "../database/employee";

/**
 * JSON Employee Supervisor Controller
 * @param req Request
 * @param res Response
 */
async function setJsonEmployeeSupervisor(req: Request, res: Response) {
  try {
    for (const [employee, supervisor] of Object.entries(req.body)) {
      await createEmployeeWithoutError(employee, supervisor as string);
    }
  } catch (err) {
    return res.status(500).json(err);
  }
}


/**
 * All Employees Controller
 * @param req Request
 * @param res Response
 * @returns All Employees in parent-child format
 */
async function getEmployees(req: Request, res: Response) {
  try {
    const employeeTree = await getEmployeeTree();
    return res.status(200).json(employeeTree);
  } catch (err) {
    return res.status(500).json(err);
  }
}

async function getEmployeeList(req: Request, res: Response) {
  try {
    const employees = await listEmployees()
    return res.status(200).json(employees);
  } catch (err) {
    return res.status(500).json(err);
  }
}

/**
 * New Employee Controller
 * @param req {Request}
 * @param res {Response}
 * @returns Promise<Response<any, Record<string, any>>>
 */
async function newEmployee(req: Request, res: Response) {
  try {
    let error: unknown;
    const { name } = req.body;
    const response = await createEmployee(name).then(response => response);
    error = response.error;
    if (error) return res.status(406).json({error, employee: null});
    return res.status(200).json({error, employee: response.employee});
  }  catch (error) {
    return res.status(500).json({error, employee: null});
  }
}

async function deleteEmployee (req: Request, res: Response) {
  try {
    const { employeeName } = req.params;
    const employee = await deleteEmployeeByName(employeeName);
    return res.status(200).json(employee);
  } catch (error) {
    return res.status(500).json(error);
  }
}

async function updateEmployee (req: Request, res: Response) {
  try {
    const { employeeName } = req.params;
    const { newSupervisor: supervisorName } = req.body;
    const {employee, error} = await updateEmployeeSupervisor(employeeName, supervisorName);
    
    if (error) {
      console.log('employee not updated')
      return res.status(400).json({
        employee: null,
        error,
      })
    }
    
    console.log('employee updated')
    return res.status(200).json({
      employee: { ...employee! },
      errorCode: null,
    })
  } catch (err) {
    console.log('employee not updated')
    return res.status(500).json({
      employee: null,
      error: err,
    })
  }

}

export default  {
  setJsonEmployeeSupervisor,
  getEmployees,
  getEmployeeList,
  newEmployee,
  deleteEmployee,
  updateEmployee,
}